const express = require('express')
const proxy = require('express-http-proxy')

const app = express()

const targetUrl = process.env.LINE_WEBHOOK_URL || 'www.google.com'
const targetPort = process.env.LINE_WEBHOOK_PORT || '80'

app.use('/proxy', proxy(targetUrl, {
  https: false,
  port: parseInt(targetPort)
}))

const port = process.env.PORT || 3100;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
