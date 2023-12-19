import { Channel, Connection, connect } from "amqplib";
import config from "../config";
import Consumer from "./consumer";
import Producer from "./producer";

export default class RabbitMQCLient {

    
    private connection: Connection;
    private consumer: Consumer;
    private producer: Producer;
    private prodCh: Channel;
    private consCh: Channel;

    async init() {
        try {
            this.connection = await connect(config.rabbitMQ.url)

            this.prodCh = await this.connection.createChannel();
            this.consCh = await this.connection.createChannel();

            const {queue: replyQueue} = await this.consCh.assertQueue('', {exclusive: true});

            this.consumer = new Consumer(this.consCh, replyQueue)
            this.producer = new Producer(this.prodCh, replyQueue)

            this.consumer.getMessages()

        } catch {

        }
    }

    async produceMessage(data: any) {
        if(!this.connection) {
            await this.init();
        }
        return await this.producer.sendMessage(data)
    }
}