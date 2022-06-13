import Level from 'level-ts'
import express from 'express'
import getApp from './router'
import { Quotation } from './model/models'
import { LevelDbImpl } from './repository'
import { PcServiceImpl } from './service'

const PORT = 8888

const db: Level<Quotation> = new Level(`${process.cwd()}/.leveldb`)
const repository = new LevelDbImpl(db)
const pcService = new PcServiceImpl(repository)

const app = getApp(pcService)

// CORS対応（というか完全無防備：本番環境ではだめ絶対）
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', '*')
    res.header('Access-Control-Allow-Headers', '*')
    next()
  }
)

app.listen(PORT, () => {
  console.log(`Start on port ${PORT}.`)
})
