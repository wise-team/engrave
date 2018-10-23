import { exit } from 'process';
import { Blogs } from '../src/database/BlogsModel';

import * as fs from 'fs';
import * as path from 'path';

export class TestUtils {

    private static async dropDatabase() {
        await Blogs.deleteMany({});
    }

    private static  async prepareDatabase() {
        const databaseMockup = fs.readFileSync(path.join(__dirname, 'database', 'blogs.json'), 'utf-8');

        const blogs = JSON.parse(databaseMockup);
        for (const blog of blogs) {
            await Blogs.create(blog);
        }
    }

    static async prepare() {
        try {
            await this.dropDatabase();
            await this.prepareDatabase();
        } catch (error) {
            console.error(error);
            exit(1);
        }
    }

}