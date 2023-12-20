import { Channel, Connection, connect } from "amqplib";
import config from "../config";
import Consumer from "./consumer_M1";
import Producer from "./producer_M1";

class RabbitMQCLient {

    private constructor(){};

    private static client: RabbitMQCLient;

    private isConnected = false;

    private connection: Connection;
    private consumer: Consumer;
    private producer: Producer;
    private prodCh: Channel;
    private consCh: Channel;

    async init() {
        if(this.isConnected) {
            return;
        }

        try {
            this.connection = await connect(config.rabbitMQ.url)

            this.prodCh = await this.connection.createChannel();
            this.consCh = await this.connection.createChannel();

            const {queue: replyQueue} = await this.consCh.assertQueue('', {exclusive: true});

            this.consumer = new Consumer(this.consCh, replyQueue)
            this.producer = new Producer(this.prodCh, replyQueue)

            this.consumer.getMessages()

            this.isConnected = true;

        } catch {

        }
    }

    async produceMessage(data: any) {
        
        if(!this.isConnected) {
            await this.init();
        }
        return await this.producer.sendMessage(data);
    }

    public static getClient() {
        if(!this.client) {
            this.client = new RabbitMQCLient();
        }

        return this.client;
    }
}


export default RabbitMQCLient.getClient();