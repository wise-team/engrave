import store from '../store/store';

export default async (username: string, access_token: string) => {
    console.log(`Store access token for username: ${username}`);
    await store.write(`secret/access/${username}`, { value: access_token})
}