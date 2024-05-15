const express = require('express')
const app = express()

const users = [
    {id:1, username:"john", name:"john1", email: "user1@gmail.com"},
    {id:2, username:"doe", name:"doe1", email: "user2@gmail.com"},
    {id:3, username:"john doe", name:"johndoe", email: "user3@gmail.com"}
]

app.get('/user', (req, res) =>{
    res.json(users)
})

app.get('/user/:user_id', (req, res) =>{
    const userId = parseInt(req.params.user_id)
    const user = users.find(user => user.id === userId)

    if(user){
        res.json(user)
    }else{
        res.status(404).json({error : "ndak ada datanya mas"})
    }
})

app.listen(5002, () =>{
    console.log("gg lah")
})