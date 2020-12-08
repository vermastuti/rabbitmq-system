#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var https = require("https");
var querystring = require('querystring');


amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'rpc_queue';

    channel.assertQueue(queue, {
      durable: false
    });
    channel.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    channel.consume(queue, function reply(msg) {
      var n = parseInt(msg.content.toString());

      console.log(" [.] fib(%d)", n);

      var r = fibonacci(n);

      channel.sendToQueue(msg.properties.replyTo,
        Buffer.from(r.toString()), {
          correlationId: msg.properties.correlationId
        });

      channel.ack(msg);
    });
  });
});

function fibonacci(n) {

    // Build the post string from an object
    const post_data = JSON.stringify({"business_id": 2083,"to": "7073119334","type": "template","template": {"namespace": "031dd339_7f4c_4cfc_92f7_20bb92e0b1cb","name": "seen_confirmation","language": {"policy": "deterministic","code": "hi"},"components": [{ "type": "body", "parameters": []}]}})

    var options = {
        host: "Staging-messenger.haptikapi.com",
        path: "/whatsapp/notification/v2/",
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer e54b609801c9af2443148f08652aaa14",
            "client-id": "bab3c4e369b54f0ae79580cd73e6f1c7e3543682"
        },
    };

    var req = https.request(options, function (res) {
        var responseString = "";

        res.on("data", function (data) {
            responseString += data;
            // save all the data from response
        });
        res.on("end", function () {
            console.log(responseString);
            // print to console when response ends
        });
    });

    req.write(post_data);
    req.end();


    return 1;
}

//curl -X POST https://Staging-messenger.haptikapi.com/whatsapp/notification/v2/ -H 'Authorization: Bearer e54b609801c9af2443148f08652aaa14' -H 'Content-Type: application/json' -H 'client-id: bab3c4e369b54f0ae79580cd73e6f1c7e3543682' -d '{"business_id": 2083,"to": "7073119334","type": "template","template": {"namespace": "031dd339_7f4c_4cfc_92f7_20bb92e0b1cb","name": "seen_confirmation","language": {"policy": "deterministic","code": "hi"},"components": [{ "type": "body", "parameters": []}]}}'