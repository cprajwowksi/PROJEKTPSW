const mqtt = require("mqtt");
const client = mqtt.connect("ws://localhost:9000/mqtt");


client.on("connect", () => {
    client.subscribe("login", (err) => {
    });
    client.subscribe("logout", (err) => {
    });
});

let logged = 0
client.on("message", (topic, message) => {
    if (topic === "login"){
        logged++
        client.publish("infoClient", logged.toString())

    }
    if (topic === "logout"){
        logged--
        client.publish("infoClient", logged.toString())

    }
    if (topic === "infoServer"){
        client.publish("infoClient", logged.toString())
    }
    console.log(logged)
});

