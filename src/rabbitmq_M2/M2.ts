import { Channel, Connection, connect } from "amqplib";
import config from "../config";
import Consumer from "./consumer_M2";
import Producer from "./producer_M2";

class M2 {

    private constructor(){};

    private static client: M2;

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

            //Создание очереди, в данном случае название очереди 
            //берется из config файла
            const {queue: rpcQueue} = await this.consCh.assertQueue(config.rabbitMQ.queues.RPCQueue, {exclusive: true});

            this.consumer = new Consumer(this.consCh, rpcQueue)
            this.producer = new Producer(this.prodCh)

            //Запуск получения сообщений для M2
            this.consumer.getMessages()

            this.isConnected = true;

        } catch (error){
            console.error(error)
        }
    }

    async produceMessage(data: any, correlationId: string, replyToQueue: string) { 
        try {

            console.log(`Отправка сообщений от М2, результат: ${data}, 
                id запроса: ${correlationId}, очередь для ответа: ${replyToQueue}`);

            if(!this.isConnected) {
                await this.init();
            }
            return await this.producer.sendMessage(data, correlationId, replyToQueue);
        } catch (err) {
            console.error(err)
        }
        
    }

    public static getClient() {
        if(!this.client) {
            this.client = new M2();
        }

        return this.client;
    }
}


export default M2.getClient();