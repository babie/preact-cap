import express from 'express'
import { html } from './html'

const app = express()
app.get('*', (req, res) => {
  res.send(html({ url: req.url }))
})

app.listen(3000, () => console.log('Server listening on port 3000.'))
