import { consumeUpdate, consumingLoop } from "../queue";

export default async () => {
    try {
        
        await consumeUpdate();

        setTimeout(consumingLoop, 100);
        
    } catch (error) {
        console.log(error);
        setTimeout(consumingLoop, 100);
    }
}