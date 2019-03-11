import store from '../store/store';

export default async (username: string, access_token: string, elevated: boolean) => {
    
    console.log(`Store access token for username: ${username}`);
    
    await store.write(`secret/access/${elevated ? 'dashboard' : 'blog' }/${username}`, { value: access_token})
}