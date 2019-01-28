import store from '../store/store';

export default async (username: string, refresh_token: string) => {
    console.log(`Store refresh token for username: ${username}`);
    await store.write(`secret/refresh/${username}`, { value: refresh_token }) // lease: 7d
}