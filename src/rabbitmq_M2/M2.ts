import { Channel, Connection, connect } from "amqplib";
import config from "../config";
import Consumer from "./consumer_M2";
import Producer from "./producer_M2";

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

            const {queue: rpcQueue} = await this.consCh.assertQueue(config.rabbitMQ.queues.RPCQueue, {exclusive: true});

            this.consumer = new Consumer(this.consCh, rpcQueue)
            this.producer = new Producer(this.prodCh)

            this.consumer.getMessages()

            this.isConnected = true;

        } catch {

        }
    }

    async produceMessage(data: any, correlationId: string, replyToQueue: string) {
        if(!this.isConnected) {
            await this.init();
        }
        return await this.producer.sendMessage(data, correlationId, replyToQueue);
    }

    public static getClient() {
        if(!this.client) {
            this.client = new RabbitMQCLient();
        }

        return this.client;
    }
}


export default RabbitMQCLient.getClient();