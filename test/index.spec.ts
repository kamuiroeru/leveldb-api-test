import supertest from 'supertest'
import app from '../src/index'
import * as myUuid from '../src/modules/uuid'

describe('サーバのテスト', () => {
  it('Path [/] のテスト', async () => {
    const res = await supertest(app).get('/')
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe('ok')
  })

  it('Path [/uuid] のテスト', async () => {
    //
    const spy = jest.spyOn(myUuid, 'generateUuid').mockReturnValue('generatedUUID')
    // const spy = jest.spyOn(dateTime, 'nowIsoString').mockReturnValue('2022-06-05T12:34:56.789Z')
    const res = await supertest(app).get('/uuid')
    expect(res.statusCode).toBe(200)
    expect(res.body.v4).toBe('generatedUUID')
    expect(spy).toBeCalledTimes(1)
  })
})
