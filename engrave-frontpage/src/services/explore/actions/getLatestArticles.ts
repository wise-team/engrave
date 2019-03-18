import axios from 'axios';

const getLatestArticles = async (category: string, skip: number, limit: number) => {
    try {

        let query: any = {
            skip: skip,
            limit: limit
        }

        if(category) {
            query.category = category;
        }

        const options = {
            url: "http://api-gateway:3000/explore/articles",
            method: 'GET',
            data: query
        };
    
        const { data } = await axios(options);
  
        return data;
    } catch (error) {
        return [];
    }
}

export default getLatestArticles;