import {Channel} from "amqplib"

export default class Producer {
    constructor(private channel: Channel) {}


    async sendMessage(data: number, correlationId: string, replQueue: string) {
        
        this.channel.sendToQueue(
            replQueue,
            Buffer.from(JSON.stringify(data)), 
            {
                correlationId: correlationId,
            })
    }
}
