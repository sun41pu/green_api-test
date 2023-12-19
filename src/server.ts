import express from "express";
import RabbitMQCLient from "./rabbitmq_client/M1";


//const rabbitClient = new RabbitMQCLient();

const server = express();
server.use(express.json())

server.post("/multiply", async (req, res, next) => {
    console.log(req.body);

    await RabbitMQCLient.produceMessage(req.body)
})



server.listen(3001, async ()=> {
    console.log("Server is running");
    RabbitMQCLient.init();
    //rabbitClient.init()
})