import express from 'express';
import axios from 'axios';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: false }));

const { MessagingResponse } = twilio.twiml;

app.post('/webhook', async (req, res) => {
  const msg = req.body.Body;

  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: msg }],
  }, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    }
  });

  const twiml = new MessagingResponse();
  twiml.message(response.data.choices[0].message.content);
  res.type('text/xml').send(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Bot rodando na porta', PORT);
});
