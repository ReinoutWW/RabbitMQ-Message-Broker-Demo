const amqp = require("amqplib");

class Publisher {
    constructor(connection) {
        this.connection = connection;
    }

    static async connect() {
        try {
            const connection = await amqp.connect("amqp://localhost:5672");
            return new Publisher(connection);
        } catch (ex) {
            console.error(ex);
        }
    }

    async sendToQueue(message) {
        try {
            const channel = await this.connection.createChannel();
            await channel.assertQueue("jobs");
            channel.sendToQueue("jobs", Buffer.from(JSON.stringify(message)));
            console.log(`Job sent successfully ${message.number}`);
        } catch (ex) {
            console.error(ex);
        }
    }

    async close() {
        await this.connection.close();
    }
}

async function main() {
    const publisher = await Publisher.connect();

    const maxAmountOfMessages = 100;
    
    for (let i = 0; i < maxAmountOfMessages; i++) {
        await publisher.sendToQueue({ number: i + 1 });
    }

    await publisher.close();
}

main();