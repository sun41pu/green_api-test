import rabbitServer from './rabbitmq_M2/M2'

export default class MsHandler {
    static handle(arg: any, corrId: string, replyTo: string) {
        setTimeout(async ()=> {
            let res = {}
        
            let { num } = arg

            res = num * 2;

            await rabbitServer.produceMessage(res, corrId, replyTo)
        }, 5000)
        
    }
}