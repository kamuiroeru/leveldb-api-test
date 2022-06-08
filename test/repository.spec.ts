import Level from 'level-ts'
import { Quotation } from '../src/model/models'
import { LevelDbImpl } from '../src/repository'
import { testQuotation } from './modelTools'
import * as dateTime from "../src/modules/dateTime"

// モック化した db を作って repository を作成する
jest.mock('Level')
const db = new Level('')
const repository = new LevelDbImpl(db)

describe('repositoryのunitTest', () => {
  describe('正常系', () => {
    it('allチェック', async () => {
      // db.all をモック化する
      const expected = [testQuotation()]
      const mockDbAll = jest.spyOn(db, 'all').mockImplementation(async () => expected)
      // テスト対象を実行
      const result = await repository.all()
      // 返り値や呼び出し回数のチェック
      expect(result.length).toEqual(expected.length)
      expect(result[0]).toEqual(expected[0])
      expect(mockDbAll).toBeCalledTimes(1)
    })

    it('getチェック', async () => {
      // db.get をモック化する
      const expected = testQuotation()
      const mockDbGet = jest.spyOn(db, 'get').mockImplementation(async (id: string) => expected)
      // テスト対象を実行
      const result = await repository.get(expected.id)
      // 返り値や呼び出し回数のチェック
      expect(result).toEqual(expected)
      expect(mockDbGet).toBeCalledTimes(1)
      expect(mockDbGet).toBeCalledWith(expected.id)
    })

    it('putチェック', async () => {
      // db.put と nowIsoString をモック化する
      const frozenTime = '2022-06-05T12:34:56.789Z'
      const mockDbPut = jest.spyOn(db, 'put').mockImplementation(async (uuid: string, q: Quotation) => { })
      const dateTimeMock = jest.spyOn(dateTime, 'nowIsoString').mockReturnValue(frozenTime)
      const expected = testQuotation()
      expected.updatedAt = frozenTime
      // テスト対象を実行
      const quotationWillBePut = testQuotation()
      await repository.put(quotationWillBePut.id, quotationWillBePut)
      // 返り値や呼び出し回数のチェック
      expect(mockDbPut).toBeCalledTimes(1)
      expect(mockDbPut).toBeCalledWith(expected.id, expected)
      // quotationWillBePut.updatedAt は更新されていないことを確認する
      expect(quotationWillBePut.updatedAt).not.toBe(expected.updatedAt)
    })

    it('delチェック', async () => {
      // db.del をモック化する
      const mockDbDel = jest.spyOn(db, 'del').mockImplementation(async (uuid: string) => { })
      const expectedId = 'id'
      // テスト対象を実行
      await repository.del(expectedId)
      // 返り値や呼び出し回数のチェック
      expect(mockDbDel).toBeCalledTimes(1)
      expect(mockDbDel).toBeCalledWith(expectedId)
    })

    it('existsチェック', async () => {
      // db.exists をモック化する
      const expectedId = 'id'
      const mockDbDel = jest.spyOn(db, 'exists').mockImplementation(async (uuid: string) => uuid === expectedId)
      // テスト対象を実行
      const result = await repository.exists(expectedId)
      // 返り値や呼び出し回数のチェック
      expect(mockDbDel).toBeCalledTimes(1)
      expect(result).toBe(true)
      // ついでに false も得られるかチェック
      expect(await repository.exists('invalidId')).toBe(false)
    })
  })
})
