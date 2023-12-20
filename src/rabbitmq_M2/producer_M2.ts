import {Channel} from "amqplib"

export default class Producer {
    constructor(private channel: Channel) {}


    async sendMessage(data: number, correlationId: string, replQueue: string) {
            console.log("-----------------\n");
            
            console.log("Отправка сообщения с результатом от M2\n");
            console.log(`Очередь: ${replQueue}`);
            console.log(`Опции - id запроса: ${correlationId}`);
            
            console.log("-----------------\n");
        try {
            this.channel.sendToQueue(
                replQueue,
                Buffer.from(JSON.stringify(data)), 
                {
                    correlationId: correlationId,
                })
        } catch (err) {
            console.error(err)
        }
        
    }
}
