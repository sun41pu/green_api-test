import { Channel, ConsumeMessage } from "amqplib";

export default class Consumer {

    constructor(private channel: Channel, private replQueueName: string) {}


    async getMessages() {
        console.log("consuming messages");

        this.channel.consume(
            this.replQueueName, 
            (ms: ConsumeMessage) => {
            console.log("reply: ", JSON.parse(ms.content.toString()));
        })
    }
}