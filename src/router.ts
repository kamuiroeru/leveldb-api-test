import express from 'express'
import Level from 'level-ts'

import { generateUuid } from './modules/uuid'
import type { Quotation } from './model/models'
import { PcService, PcServiceImpl } from './service'
import { LevelDb, LevelDbImpl } from './repository'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS対応（というか完全無防備：本番環境ではだめ絶対）
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Access-Control-Allow-Headers', '*')
    next()
  }
)

const repository: LevelDb = new LevelDbImpl(
  new Level<Quotation>(`${process.cwd()}/.leveldb`)
)
export const pcService: PcService = new PcServiceImpl(repository)

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
  })
})

app.get('/uuid', (req, res) => {
  res.status(200).json({
    v4: generateUuid(),
  })
})

app.post('/gen-mock', async (req, res) => {
  const now = new Date().toISOString()
  const requestQuotation: Quotation = {
    id: '[[toBeReplaced]]',
    cpu: {
      id: generateUuid(),
      name: 'Intel Core i9-12900K',
      url: 'https://www.dospara.co.jp/5shopping/detail_parts.php?bg=1&br=11&sbr=1329&ic=475986&utm_source=kakaku.com&utm_medium=referral&utm_campaign=kakaku_parts_camp&_bdadid=JPGTE5.00002isv&lf=0',
      price: 75980,
      shop: 'ドスパラ',
      watts: null,
    },
    totalPrice: 75980,
    totalWatts: 150,
    text: '',
    createdAt: now,
    updatedAt: now,
  }

  const id = await pcService.post(requestQuotation)
  res.status(200).send({ id })
})

app.post('/pc', async (req, res) => {
  const requestQuotation: Quotation = req.body
  const id = await pcService.post(requestQuotation)
  res.status(200).send({ id })
})

app.get('/pc/:id', async (req, res) => {
  const id = req.params.id
  try {
    const requestQuotation = await pcService.get(id)
    res.status(200).send(requestQuotation)
  } catch (e) {
    res.sendStatus(404)
  }
})

app.get('/pc', async (req, res) => {
  res.status(200).json({
    quotations: await pcService.all(),
  })
})

// 単体テスト用に export する
export default app
