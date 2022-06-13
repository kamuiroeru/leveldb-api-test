import express from 'express'
import { generateUuid } from './modules/uuid'
import { Quotation, quotationGenerator } from './model/models'
import { PcService } from './service'
import { nowIsoString } from './modules/dateTime'
import { ErrorResponse } from './model/responses'

export default class PcController {
  private router: express.Router

  constructor(private service: PcService) {
    this.router = express.Router()
    this.routing(this.router) // ルーティング設定
  }

  public static baseUri(): string {
    return '/api/v1'
  }

  public getRouter(): express.Router {
    return this.router
  }

  private routing(router: express.Router): void {
    router.get('/', (req, res) => {
      res.status(200).json({
        status: 'ok',
      })
    })

    router.get('/uuid', (req, res) => {
      res.status(200).json({
        v4: generateUuid(),
      })
    })

    router.post('/gen-mock', async (req, res) => {
      const requestQuotation = quotationGenerator(
        nowIsoString(),
        generateUuid()
      )
      const id = await this.service.post(requestQuotation)
      res.status(200).send({ id })
    })

    router.post('/pc', async (req, res) => {
      const requestQuotation: Quotation = req.body
      const id = await this.service.post(requestQuotation)
      res.status(200).send({ id })
    })

    router.get('/pc/:id', async (req, res) => {
      const id = req.params.id
      try {
        const requestQuotation = await this.service.get(id)
        res.status(200).send(requestQuotation)
      } catch (e) {
        const errorResponse: ErrorResponse = {
          message: 'error',
        }
        if (e instanceof Error) {
          errorResponse.message = e.message
          errorResponse.name = e.name
        }
        res.status(404).send(errorResponse)
      }
    })

    router.get('/pc', async (req, res) => {
      res.status(200).json({
        quotations: await this.service.all(),
      })
    })
  }
}
