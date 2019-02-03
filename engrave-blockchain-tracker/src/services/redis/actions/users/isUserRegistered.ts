import engine from "../../store/engine";

async function isUserRegistered(username: string): Promise<boolean> {
    return ( await engine.get(`users:${username}`) != null);
}

export default isUserRegistered;