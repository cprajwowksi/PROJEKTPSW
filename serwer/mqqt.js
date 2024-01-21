const mqtt = require("mqtt");
const client = mqtt.connect("ws://localhost:9000/mqtt");


client.on("connect", () => {
    client.subscribe("login", (err) => {
    });
    console.log("polaczylem sie!!")
    client.subscribe("logout", (err) => {
    });
    client.subscribe("chat/+")
});

let ids = []
let logged = 0
client.on("message", (topic, message) => {

    if (topic === "login"){
        const wynik = JSON.parse(message.toString())
        ids.push(wynik.userId)
        logged++
        client.publish("infoClient", logged.toString())

    }

    if (topic === "logout"){
        logged--
        client.publish("infoClient", logged.toString())
        client.unsubscribe(`chat/${message}`)

    }
    if (topic === "infoServer"){
        client.publish("infoClient", logged.toString())
    }

    if (topic.startsWith("chat/")) {
        const wynik = JSON.parse(message.toString());
        const json = { message: wynik.message, sender: 'server'};
        if (wynik.sender !== 'server') {
            client.publish(topic, JSON.stringify(json));
        }
    }
});

