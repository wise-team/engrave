import { SSLModule } from './SSL';
import { Blogs } from './../database/BlogsModel';
import { IBlog } from '../helpers/IBlog';
import { Config } from "../config";
import * as pm2 from 'pm2'
import { NginxModule } from './Nginx';

let fs = require('fs');
let path = require('path');

let config = Config.GetConfig();

export class NodeAppsModule {

    /**
     * Create NGINX configuration and run blog instance app
     * @param blog IBlog interface blog instance
     */
    static async createAndRun(blog: IBlog) {
        try {
            const instancesDirectoryPath = path.join(__dirname, '../../instances');
            const blogPath = path.join(instancesDirectoryPath, blog.domain);
            
            this.validateInstancesDirectory(instancesDirectoryPath, blogPath);

            const newAppConfig = {
                apps: [{
                    name: blog.domain,
                    script: './blog/app.js',
                    watch: false,
                    env: {
                        PORT: blog.port,
                        STEEM_USERNAME: blog.steem_username,
                        DATABASE_URL: config.database_url,
                        NODE_ENV: "development"
                    },
                }]
            };

            await NginxModule.generateNginxSettings(blog);

            await this.pm2Connect();
            fs.writeFileSync(path.join(blogPath, 'app_config.json'), JSON.stringify(newAppConfig), { flag: 'w' });
            await this.pm2Start(path.join(blogPath, 'app_config.json'));
            pm2.disconnect();

            console.log(' * Copying files completed.');
            console.log(' * New blog with domain: ' + blog.domain + ' for: @' + blog.steem_username + " is ready!");

        } catch (error) {
            console.log(" * Copying files error:", error);
        }
    }

    /**
     * Configure NGINX and create PM2 instance for every configured blog
     */
    static async ConfigureAndStartConfiguredBlogs() {
        try {
            const blogs = await Blogs.find({configured: true});
            
            for(let blog of blogs) {
                try {
                    if (blog.is_domain_custom) {
                        if (!SSLModule.validateDomainCertificates(blog.domain)) {
                            blog.ssl = false;
                            await blog.save();
                        }
                    }
                    await this.createAndRun(blog);
                    await this.wait_s(20);
                    console.log("Created instance for: ", blog.domain);
                } catch (error) {
                    console.log("Couldn't generate certificates on running for: ", blog.domain, error);
                }
            }
        } catch (error) {
            console.log('Error while reading blogs from database');
            throw error;
        }
    }

     private static async wait_s(seconds: number) {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, seconds*1000);
        })
    }

    /**
     * Check if instances directory exists and create new one if not
     * @param instancesDirectoryPath absolue path to directory when blog instances are stored
     * @param blogPath absolute path to blog instance (should include instancesDirectoryPath)
     */
    private static validateInstancesDirectory(instancesDirectoryPath: string, blogPath: string) {
        if (!fs.existsSync(instancesDirectoryPath)) {
            fs.mkdirSync(instancesDirectoryPath);
        }
        if (!fs.existsSync(blogPath)) {
            fs.mkdirSync(blogPath);
        }
    }

    /**
     * Promisified version of pm2.connect() method. Can be awaited.
     */
    private static async pm2Connect() {

        return new Promise(
            (resolve, reject) => {
                pm2.connect((err) => {
                    if (err) reject(err);
                    else resolve();
                })
            }
        );
    }

    /**
     * Promisified version of pm2.start() method. Can be awaited.
     */
    private static async pm2Start(path: string) {

        return new Promise (
            (resolve, reject) => {
                pm2.start(path, (err, proc) => {
                    if(err) reject(err);
                    else resolve(proc);
                })
            }
        );

    }

}
