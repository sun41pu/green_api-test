import { Channel, ConsumeMessage } from "amqplib";
import {EventEmitter} from "events"

export default class Consumer {

    constructor(private channel: Channel, private replQueueName: string, private replyEvent: EventEmitter) {}

    //Получение сообщений от rabbit
    async getMessages() {
            
        console.log("Активация приема сообщений от M2\n");
        console.log(`Очередь: ${this.replQueueName}`);
            
            console.log("-----------------\n");
        try {
            this.channel.consume(
            
                //Указано название канала для прослушивания
                //а также повешен ивент по id операции
                this.replQueueName, 
                (ms: ConsumeMessage) => {
                this.replyEvent.emit(ms.properties.correlationId.toString(), ms),
                {
                    noAck: true,
                }
            })
        } catch (err) {
            console.error(err)
        }
        
    }
}