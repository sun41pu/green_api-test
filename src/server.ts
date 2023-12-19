import express from "express";
import RabbitMQCLient from "./rabbitmq/M1";


const rabbitClient = new RabbitMQCLient();

const server = express();
server.use(express.json())

server.post("/multiply", async (req, res, next) => {
    console.log(req.body);

    await rabbitClient.produceMessage(req.body)
})



server.listen(3001, async ()=> {
    console.log("Server is running");
    //rabbitClient.init()
})