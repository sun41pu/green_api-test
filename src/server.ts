import express from "express";
import M1 from "./rabbitmq_M1/M1";
import M2 from "./rabbitmq_M2/M2"


const server = express();
server.use(express.json())

server.post("/double", async (req, res) => {
    try {
        if(!req.body.num || typeof req.body.num !== "number") {
            throw new Error(`Неверный формат входного параметра num, ожидается число, но получили: ${typeof req.body.num}`)
        }
    
        const result = await M1.produceMessage(req.body)
        
        res.send({ result })
    } catch (error) {
        console.log("err");
        
        console.trace(error);
        
        res.status(500).send({
            error: error.message,  
        })
        return;
    }
    
})



server.listen(3000, async ()=> {
    try {
        M1.init();
        M2.init();
    } catch (err) {
        console.trace(err)
    }
    
})