import { Channel, Connection, connect } from "amqplib";
import config from "../config";
import Consumer from "./consumer_M1";
import Producer from "./producer_M1";
import {EventEmitter} from "events"

class M1 {

    private constructor(){};

    private static client: M1;

    private isConnected = false;

    private connection: Connection;
    private consumer: Consumer;
    private producer: Producer;
    private prodCh: Channel;
    private consCh: Channel;

    private replyEvent: EventEmitter;


    //Инициализация соединения и каналов для обработки сообщений
    async init() {
        console.log("Инициализация M1\n");

        if(this.isConnected) {
            return;
        }

        try {
            this.connection = await connect(config.rabbitMQ.url)
            //EventEmitter для передачи сообщений между consumer 
            //и producer для отдачи ответа с сервера
            this.replyEvent = new EventEmitter();

            //Создание каналов
            this.prodCh = await this.connection.createChannel();
            this.consCh = await this.connection.createChannel();

            //Создание очереди. В этом случае название генерируется рандомно
            const {queue: replyQueue} = await this.consCh.assertQueue('', {exclusive: true});


            //Создание объектов "производителя" и "потребителя"
            this.consumer = new Consumer(this.consCh, replyQueue, this.replyEvent)
            this.producer = new Producer(this.prodCh, replyQueue, this.replyEvent)

            //Запуск приема сообщений для М1
            this.consumer.getMessages()

            this.isConnected = true;

        } catch (error) {
            console.error(error)
        }
    }

    //Метод для обращения к "производителю"
    async produceMessage(data: any) {
        try {
            const {num} = data
            console.log("--------------");
            
            console.log(`Начало отправки сообщения от M1, данные для отправки: ${ num }`);
            if(!this.isConnected) {
                await this.init();
            }
            return await this.producer.sendMessage(data);
        } catch (err) {
            console.error(err)
        } 
    }

    //Функция для получения инстанса М1
    public static getClient() {
        
        if(!this.client) {
            this.client = new M1();
        }

        return this.client;
    }
}


export default M1.getClient();