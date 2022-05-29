import supertest from 'supertest'
import app from '../src/index'

describe('サーバのテスト', () => {
  it('Path [/] のテスト', async () => {
    const res = await supertest(app).get('/')
    expect(res.statusCode).toBe(200)
    expect(res.body.status).toBe('ok')
  })
})
