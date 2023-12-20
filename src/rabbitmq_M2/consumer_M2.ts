import { Channel, ConsumeMessage } from "amqplib";
import MsHandler from "../msHandler";

export default class Consumer {

    constructor(private channel: Channel, private prodQueueName: string) {}


    async getMessages() {
        this.channel.consume(
            this.prodQueueName, 
            async (ms: ConsumeMessage) => {
                const {replyTo, correlationId} = ms.properties;
                const num = JSON.parse(ms.content.toString());
            
                if(!replyTo || !correlationId) {
                    console.log("Отсутствуют необходимые поля");
                    
                } else {
                    await MsHandler.handle(num, correlationId, replyTo)
                }
        })
    }
}