const express = require('express')
const app = express()
const amqp = require("amqplib");

const postings = [
    {id:1, username:"john", name:"john1", judul:"Lorem ipsum"},
    {id:2, username:"doe", name:"doe1", judul:"Lorem ipsum"},
    {id:3, username:"john doe", name:"johndoe", judul:"Lorem ipsum lor alet"},
]

app.get('/posting', (req, res) =>{
    res.json(postings)
})

app.get('/posting/:posting_id', (req, res) =>{
    const postingId = parseInt(req.params.posting_id)
    const posting = postings.find(posting => posting.id === postingId)

    if(posting){
        res.json(posting)
    }else{
        res.status(404).json({error : "ndak ada datanya mas"})
    }
})

function sendPostCreatedEvent(post) {
    amqp.connect('amqp://localhost', (err, conn) => {
        if (err) {
            console.error(err);
            return;
        }
        conn.createChannel((err, channel) => {
            if (err) {
                console.error(err);
                return;
            }
            const queue = 'post_created';
            const msg = JSON.stringify(post);

            channel.assertQueue(queue, { durable: false });
            channel.sendToQueue(queue, Buffer.from(msg));
            console.log(" [x] Sent %s", msg);
        });

        setTimeout(() => {
            conn.close();
        }, 500);
    });
}

app.listen(5000, () =>{
    console.log("gg bang")
})