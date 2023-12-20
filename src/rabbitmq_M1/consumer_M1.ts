import { Channel, ConsumeMessage } from "amqplib";

export default class Consumer {

    constructor(private channel: Channel, private replQueueName: string) {}


    async getMessages() {

        this.channel.consume(
            this.replQueueName, 
            (ms: ConsumeMessage) => {
            console.log("Result: ", JSON.parse(ms.content.toString()));
        })
    }
}