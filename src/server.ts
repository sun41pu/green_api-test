import express from "express";
import RabbitMQCLient from "./rabbitmq_M1/M1";
import RabbitMQCServer from "./rabbitmq_M2/M2"



const server = express();
server.use(express.json())

server.post("/multiply", async (req, res, next) => {
    
    await RabbitMQCLient.produceMessage(req.body)
})



server.listen(3001, async ()=> {
    RabbitMQCLient.init();
    RabbitMQCServer.init();
})