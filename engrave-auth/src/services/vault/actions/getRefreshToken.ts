import store from '../store/store';

export default async (username: string) => {
    return await store.read(`secret/refresh/${username}`) // lease: 7d
}