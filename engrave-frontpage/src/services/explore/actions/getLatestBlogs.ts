import axios from 'axios';

const getLatestBlogs = async (category: string, skip: number, limit: number) => {
    try {

        let query: any = {
            skip: skip,
            limit: limit
        }

        if(category) {
            query.category = category;
        }

        const options = {
            url: "http://api-gateway:3000/explore/blogs",
            method: 'GET',
            data: query
        };
    
        const { data } = await axios(options);
  
        return data;
    } catch (error) {
        return [];
    }
}

export default getLatestBlogs;