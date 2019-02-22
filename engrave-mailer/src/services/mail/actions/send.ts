import { engine, sender_name, sender_address } from '../engine/engine';

export default async (email: string, subject: string, html: string) => {

    return await engine.sendMail({
        from: { 
            name: sender_name, 
            address: sender_address 
        },
        to: email,
        subject: subject,
        html: html
    });

}