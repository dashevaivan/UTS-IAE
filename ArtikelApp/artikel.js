const express = require('express')
const app = express()
const amqp = require("amqplib/callback_api");

const articles = [
    {id:1, post:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."},
    {id:2, post:"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem."},
    {id:3, post:"At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus."},
]

app.get('/article', (req, res) =>{
    res.json(articles)
})

app.get('/article/:article_id', (req, res) =>{
    const articleId = parseInt(req.params.article_id)
    const article = articles.find(article => article.id === articleId)

    if(article){
        res.json(article)
    }else{
        res.status(404).json({error : "ndak ada datanya mas"})
    }
})

function handlePostCreated(post) {
    console.log("Post created:", post);
    // Add logic to handle the post created event, if necessary.
}

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

        channel.assertQueue(queue, { durable: false });
        console.log(" [*] Waiting for messages in %s", queue);

        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const post = JSON.parse(msg.content.toString());
                handlePostCreated(post);
                channel.ack(msg);
            }
        });
    });
});

app.listen(5003, () =>{
    console.log("gg dah bang")
})