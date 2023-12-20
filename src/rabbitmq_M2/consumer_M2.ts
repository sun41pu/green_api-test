import { Channel, ConsumeMessage } from "amqplib";
import MsHandler from "../msHandler";

export default class Consumer {

    constructor(private channel: Channel, private prodQueueName: string) {}

    //Обработка воходящего сообшения от rabbit
    async getMessages() {
            
        console.log("Активация приема сообщений от M1\n");
        console.log(`Очередь: ${this.prodQueueName}\n`);
            
        try {
            this.channel.consume(
                this.prodQueueName, 
                async (ms: ConsumeMessage) => {
                    const {replyTo, correlationId} = ms.properties;
                    const num = JSON.parse(ms.content.toString());
                    //Проверка наличия необходимых полей для отправки результата
                    if(!replyTo || !correlationId) {
                        throw new Error("Отсутствуют необходимые параметры" + 
                        `для предоставления ответа от M2. correlationId: ${correlationId}, replyTo: ${replyTo}`)
                        
                    } else {
                        
                        await MsHandler.handle(num, correlationId, replyTo)
                    }
            })
        } catch (err) {
            console.error(err)
        }
        
    }
}