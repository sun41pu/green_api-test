import { Channel, ConsumeMessage } from "amqplib";
import {EventEmitter} from "events"

export default class Consumer {

    constructor(private channel: Channel, private replQueueName: string, private replyEvent: EventEmitter) {}

    //Получение сообщений от rabbit
    async getMessages() {
        try {
            this.channel.consume(
            
                //Указано название канала для прослушивания
                //а также повешен ивент по id операции
                this.replQueueName, 
                (ms: ConsumeMessage) => {
                this.replyEvent.emit(ms.properties.correlationId.toString(), ms)
            })
        } catch (err) {
            console.error(err)
        }
        
    }
}