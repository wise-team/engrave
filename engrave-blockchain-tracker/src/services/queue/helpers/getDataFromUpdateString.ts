
export default (update: string) => {
    try {
        
        const [author, permlink] = update.split(':');
        
        return {
            author,
            permlink
        }
        
    } catch (error) {
        return null;
    }
}