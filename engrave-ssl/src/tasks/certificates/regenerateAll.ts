import { Blogs } from "../../submodules/engrave-shared/models/BlogsModel";
import generateCertificate from "../../services/generateCertificate";

async function regenerateAll () {
    
    try {
        let blogs = await Blogs.find({ ssl: true, configured: true, is_domain_custom: true });
        for(const blog of blogs) {
            try {
                console.log(" * Regenerating SSL certificates for: ", blog.domain);
                await generateCertificate(blog.domain);
            } catch (error) {
                console.log("Generating SSL error:", error);
            }
        }
    } catch (error) {
        console.log(" * Regenerating SSL error:", error);
    }
}

export default regenerateAll;