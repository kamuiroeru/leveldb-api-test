import express from 'express'
import { PcService } from './service'
import PcController from './controller'

export default function getApp(pcService: PcService): express.Express {
  const app = express()
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  const pcController = new PcController(pcService)
  app.use(PcController.baseUri(), pcController.getRouter())

  return app
}
