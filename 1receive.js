#!/usr/bin/env node

// get the library
var amqp = require('amqplib/callback_api');

//connect to RabbitMQ server
amqp.connect('amqp://localhost', function(error0,
connection){
    if(error0){
        throw error0;
    }
    connection.createChannel(function(error1, channel) {
        if(error1){
            throw error1;
        }
        var queue = 'hello';

        channel.assertQueue(queue, {
            durable: false
        });

        console.log(" [*] Waiting for messages in %s. To exit press Ctrl+C", queue);

        channel.consume(queue, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
        }, {
            noAck: true
        });
    });
});


