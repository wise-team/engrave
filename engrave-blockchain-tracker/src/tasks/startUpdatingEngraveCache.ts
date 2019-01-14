import { consumingLoop } from '../services/queue/queue';

export default async () => {
    console.log('Started updating Engrave cache');

    await consumingLoop();
    
}