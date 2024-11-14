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
            
            if(input.number == 7) {
                console.log('Job acklowledged');
                channel.ack(message); // Remove from the queue
            }
        });

        console.log(`Waiting for messages...`);
    }catch(ex) {
        console.error(ex);
    }
}