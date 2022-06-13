import supertest from 'supertest'
import { mockService as pcService } from './mocks'
import getApp from '../src/router'
import PcController from '../src/controller'
import {
  ErrorResponse,
  GetHello,
  GetPc,
  GetPcList,
  GetUuid,
  PostOkResponse,
} from '../src/model/responses'
import * as dateTime from '../src/modules/dateTime'
import * as myUuid from '../src/modules/uuid'
import { Quotation, quotationGenerator } from '../src/model/models'
import { NotFoundError } from 'level-errors'

const app = getApp(pcService)
const baseUrl = PcController.baseUri()

describe('PcController のテスト', () => {
  // モックを設定する
  // // service のメソッドモックを設定する
  const mockServAll = jest.spyOn(pcService, 'all')
  const mockServGet = jest.spyOn(pcService, 'get')
  const mockServPost = jest.spyOn(pcService, 'post')
  const mockServPut = jest.spyOn(pcService, 'put')
  // // その他のモック
  const mockDateTime = jest.spyOn(dateTime, 'nowIsoString')
  const mockGUuid = jest.spyOn(myUuid, 'generateUuid')

  afterEach(() => {
    // 各 it で モックをリセットする
    ;[
      mockServAll,
      mockServGet,
      mockServPost,
      mockServPut,
      mockDateTime,
      mockGUuid,
    ].map((m) => m.mockClear())
  })

  describe('正常系', () => {
    it('Get /', async () => {
      const res = await supertest(app).get(baseUrl + '/')
      expect(res.statusCode).toBe(200)
      const body: GetHello = res.body
      expect(body.status).toBe('ok')
    })

    it('Get /uuid', async () => {
      mockGUuid.mockReturnValue('generatedUUID')
      const res = await supertest(app).get(baseUrl + '/uuid')
      expect(res.statusCode).toBe(200)
      const body: GetUuid = res.body
      expect(body.v4).toBe('generatedUUID')
      expect(mockGUuid).toBeCalledTimes(1)
    })

    it('Post /gen-mock', async () => {
      mockDateTime.mockReturnValue('2022-06-05T12:34:56.789Z')
      mockGUuid.mockReturnValue('generatedUUID')
      mockServPost.mockImplementation(async (_quotation) => 'uuidUUIDuuid')
      const expectedQuotation = quotationGenerator(
        '2022-06-05T12:34:56.789Z',
        'generatedUUID'
      )
      const res = await supertest(app).post(baseUrl + '/gen-mock')
      expect(res.statusCode).toBe(200)
      const body: PostOkResponse = res.body
      expect(body.id).toBe('uuidUUIDuuid')
      expect(mockDateTime).toBeCalledTimes(1)
      expect(mockGUuid).toBeCalledTimes(1)
      expect(mockServPost).toBeCalledWith(expectedQuotation)
    })

    it('Post /pc', async () => {
      mockServPost.mockImplementation(async (_quotation) => 'uuidUUIDuuid')
      const expectedQuotation = quotationGenerator(
        '2022-06-05T12:34:56.789Z',
        'generatedUUID'
      )
      const res = await supertest(app)
        .post(baseUrl + '/pc')
        .send(expectedQuotation)
      expect(res.statusCode).toBe(200)
      const body: PostOkResponse = res.body
      expect(body.id).toBe('uuidUUIDuuid')
      expect(mockServPost).toBeCalledWith(expectedQuotation)
    })

    it('Get /pc/:id', async () => {
      const expectedQuotation = quotationGenerator(
        '2022-06-05T12:34:56.789Z',
        'generatedUUID'
      )
      mockServGet.mockImplementation(async (_id) => expectedQuotation)
      const res = await supertest(app).get(baseUrl + '/pc/uuid')
      expect(res.statusCode).toBe(200)
      const body: GetPc = res.body
      expect(body).toEqual(expectedQuotation)
      expect(mockServGet).toBeCalledWith('uuid')
    })

    it('Get /pc', async () => {
      const expected: Quotation[] = [
        quotationGenerator('1', '2'),
        quotationGenerator('3', '4'),
        quotationGenerator('5', '6'),
      ]
      mockServAll.mockImplementation(async () => expected)
      const res = await supertest(app).get(baseUrl + '/pc')
      expect(res.statusCode).toBe(200)
      const body: GetPcList = res.body
      expect(body.quotations).toEqual(expected)
      expect(mockServAll).toBeCalledTimes(1)
    })
  })

  describe('異常系', () => {
    it('Get /pc/:id Error 以外の異常', async () => {
      mockServGet.mockImplementation(async (_id) => {
        throw new Object()
      })
      const res = await supertest(app).get(baseUrl + '/pc/uuid')
      expect(res.statusCode).toBe(404)
      const body: ErrorResponse = res.body
      expect(body.message).toBe('error')
      expect(mockServGet).toBeCalledWith('uuid')
    })

    it('Get /pc/:id Error', async () => {
      mockServGet.mockImplementation(async (_id) => {
        throw new NotFoundError('Key not found in database [uuid]')
      })
      const res = await supertest(app).get(baseUrl + '/pc/uuid')
      expect(res.statusCode).toBe(404)
      const body: ErrorResponse = res.body
      expect(body.message).toBe('Key not found in database [uuid]')
      expect(body.name).toBe('NotFoundError')
      expect(mockServGet).toBeCalledWith('uuid')
    })
  })
})
