const amqp = require("amqplib");

connect();

console.log("Consumer is running...");

async function connect() {
    try {
        const connection = await amqp.connect("amqp://localhost:5672");
        const channel = await connection.createChannel();
        const result = await channel.assertQueue("jobs");

        channel.consume("jobs", message => {
            var input = JSON.parse(message.content.toString());
            console.log(`Received job with input ${input.number}`);	
            channel.ack(message); // Remove from the queue
            console.log(`Acknowledge message..`);
            // Wait 1s
            setTimeout(() => {}, 1000);
        });

        console.log(`Waiting for messages...`);
    }catch(ex) {
        console.error(ex);
    }
}