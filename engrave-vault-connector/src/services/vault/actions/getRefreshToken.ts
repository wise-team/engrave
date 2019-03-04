import store from '../store/store';

export default async (username: string) => {
    const { data: {value: token}} = await store.read(`secret/refresh/${username}`)
    return token;
}