import express from 'express'
import level from 'level-ts'

import { generateUuid } from './modules/uuid'
import type { Component, Quotation } from './model/models'

const db = new level<Quotation>(`${process.cwd()}/.leveldb`)
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const PORT = 8888

// CROS対応（というか完全無防備：本番環境ではだめ絶対）
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*")
  res.header("Access-Control-Allow-Headers", "*");
  next();
})

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok'
  })
})

app.post('/gen-mock', async (req, res) => {
  const id = generateUuid();
  const requestQuotation: Quotation = {
    id,
    cpu: {
      id: generateUuid(),
      name: 'Intel Core i9-12900K',
      url: 'https://www.dospara.co.jp/5shopping/detail_parts.php?bg=1&br=11&sbr=1329&ic=475986&utm_source=kakaku.com&utm_medium=referral&utm_campaign=kakaku_parts_camp&_bdadid=JPGTE5.00002isv&lf=0',
      price: 75980,
      shop: 'ドスパラ',
      watts: null
    },
    totalPrice: 75980,
    totalWatts: 150,
    text: '',
  }

  console.log({ requestQuotation })
  await db.put(id, requestQuotation)
  res.sendStatus(200)
})

app.post('/pc', async (req, res) => {
  const requestQuotation: Quotation = req.body
  const uuid = generateUuid()
  requestQuotation.id = uuid;
  await db.put(uuid, requestQuotation)
  res.sendStatus(200)
})

app.get('/pc/:id', async (req, res, next) => {
  const id = req.params.id
  try {
    const requestQuotation = await db.get(id)
    res.sendStatus(200).send(requestQuotation)
  } catch (e) {
    res.sendStatus(404)
  }
})

app.get('/pc', async (req, res) => {
  const requestQuotation: Quotation = req.body
  const uuid = generateUuid()
  requestQuotation.id = uuid;
  await db.put(uuid, requestQuotation)
  res.sendStatus(200)
})

app.listen(PORT, () => {
  console.log(`Start on port ${PORT}.`)
})
