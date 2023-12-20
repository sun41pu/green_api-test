import {Channel} from "amqplib"
import config from "../config"
import {randomUUID} from "crypto"

export default class Producer {
    constructor(private channel: Channel, private replQueueName: string) {}


    async sendMessage(data: any) {
        
        const uuid = randomUUID();

        this.channel.sendToQueue(
            config.rabbitMQ.queues.RPCQueue, 
            Buffer.from(JSON.stringify(data)), 
            {
                replyTo: this.replQueueName,
                correlationId: uuid,
                headers: {
                    num: data.num
                }
            })
    }
}
