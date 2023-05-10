const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
app.use(express.json())
app.use(cors())

const API_KEY = process.env.API_KEY

app.post('/completions', async (req, res) => {
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: req.body.message}],
            max_tokens: 100
        })
    }
    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options)

        const data = await response.json();
        console.log("what is coming to backend! ")
        console.log(req.body.message)
        res.send(data);

    } catch (error) {
        console.error(error)
    }
})

const PORT = 8000;
app.listen(PORT, () => console.log('Your server is running on PORT ' + PORT))
