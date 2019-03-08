import { Blogs } from "../../submodules/engrave-shared/models/Blogs";
import generateNginxSettings from '../../services/nginx/generateNginxSettings';
import checkIfDomainPointsEngraveServer from '../../services/checkIfDomainPointsEngraveServer';
import generateCertificate from "../../services/generateCertificate";

async function secureNewBlogs () {

    try {
        let blogs = await Blogs.find({ ssl: { $ne: true }, configured: true, is_domain_custom: true });

        for(const blog of blogs) {
            try {
                if (await checkIfDomainPointsEngraveServer(blog.domain) &&
                    await checkIfDomainPointsEngraveServer('www.' + blog.domain)) {
                    console.log("Unsecured blog: ", blog.domain, "from @" + blog.owner);
                    await generateCertificate(blog.domain);
                    console.log(" * SSL generated for ", blog.domain);
                    await generateNginxSettings(blog);
                    console.log(" * NGINX with SSL generated for: ", blog.domain);
                    // blog.ssl = true;
                    await blog.save();
                    console.log(" * Database entry saved for blog");
                }
            } catch (error) {
                console.log("Generating SSL error:", error);
            }
        }
        
    } catch (error) {
        // just ignore
    }
}

export default secureNewBlogs;