import store from '../store/store';

export default async (username: string) => {
    const { data: {value: token}} = await store.read(`secret/access/${username}`) // lease: 7d
    return token;
}