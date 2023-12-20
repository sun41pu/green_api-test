import {Channel} from "amqplib"
import config from "../config"
import {randomUUID} from "crypto"
import {EventEmitter} from "events"

export default class Producer {
    constructor(private channel: Channel, private replQueueName: string, private event: EventEmitter) {}


    async sendMessage(data: any) {
        try {
            const uuid = randomUUID();

            console.log("-----------------\n");

            console.log("Отправка сообщения от M1\n");
            console.log(`Очередь: ${config.rabbitMQ.queues.RPCQueue}`);
            console.log(`Опции - reply to: ${this.replQueueName}, id запроса: ${uuid}`);
            
            console.log("-----------------\n");

            this.channel.sendToQueue(
            config.rabbitMQ.queues.RPCQueue, 
            Buffer.from(JSON.stringify(data)), 
            //Дополнительные опции для указания очереди на отправку из М2
            //а также id для связывания запроса и ответа
            {
                replyTo: this.replQueueName,
                correlationId: uuid,
            }
            )
        
            //Добавление обработки ивента, для того, чтобы вернуть результат
            return new Promise((resolve, reject)=> {             
                this.event.once(uuid, async (ms) => {
                    const result = JSON.parse(ms.content.toString());
                    console.log("Результат: ", result);
                    
                    resolve(result)
                })
            })
        } catch (err) {
            console.error(err)
        }
        
    }
}
