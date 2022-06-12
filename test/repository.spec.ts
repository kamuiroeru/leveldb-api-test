import Level from 'level-ts'
import { NotFoundError } from 'level-errors'
import { Quotation } from '../src/model/models'
import { LevelDbImpl } from '../src/repository'
import { testQuotation } from './modelTools'
import * as dateTime from "../src/modules/dateTime"

// モック化した db を作って repository を作成する
// 参考: https://jestjs.io/docs/es6-class-mocks#automatic-mock
jest.mock('level-ts') // モジュールルートで実施する必要がある
const db = new Level('')
const repository = new LevelDbImpl(db)

describe('repositoryのunitTest', () => {
  // モックを設定する
  // // db のメソッドモックを設定する
  const mockDbAll = jest.spyOn(db, 'all')
  const mockDbGet = jest.spyOn(db, 'get')
  const mockDbPut = jest.spyOn(db, 'put')
  const mockDbDel = jest.spyOn(db, 'del')
  const mockDbExists = jest.spyOn(db, 'exists')
  // その他のモック
  const dateTimeMock = jest.spyOn(dateTime, 'nowIsoString')

  afterEach(() => {
    // 各 it で モックをリセットする
    [
      mockDbAll, mockDbGet, mockDbPut, mockDbDel, mockDbExists,
      dateTimeMock,
    ].map(m => m.mockClear())
  })

  describe('正常系', () => {
    it('allチェック', async () => {
      // db.all の挙動を指定
      const expected = [testQuotation()]
      mockDbAll.mockImplementation(async () => expected)
      // テスト対象を実行
      const result = await repository.all()
      // 返り値や呼び出し回数のチェック
      expect(result.length).toEqual(expected.length)
      expect(result[0]).toEqual(expected[0])
      expect(mockDbAll).toBeCalledTimes(1)
    })

    it('getチェック', async () => {
      // db.get の挙動を指定
      const expected = testQuotation()
      mockDbGet.mockImplementation(async (id: string) => expected)
      // テスト対象を実行
      const result = await repository.get(expected.id)
      // 返り値や呼び出し回数のチェック
      expect(result).toEqual(expected)
      expect(mockDbGet).toBeCalledTimes(1)
      expect(mockDbGet).toBeCalledWith(expected.id)
    })

    it('putチェック', async () => {
      // db.put と nowIsoString の挙動を指定
      const frozenTime = '2022-06-05T12:34:56.789Z'
      mockDbPut.mockImplementation(async (uuid: string, q: Quotation) => { })
      dateTimeMock.mockReturnValue(frozenTime)
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
      mockDbDel.mockImplementation(async (uuid: string) => { })
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
      mockDbExists.mockImplementation(async (uuid: string) => uuid === expectedId)
      // テスト対象を実行
      const result = await repository.exists(expectedId)
      // 返り値や呼び出し回数のチェック
      expect(mockDbExists).toBeCalledTimes(1)
      expect(result).toBe(true)
      // ついでに false も得られるかチェック
      expect(await repository.exists('invalidId')).toBe(false)
    })
  })

  describe('異常系', () => {
    it('存在しない項目をgetする', () => {
      mockDbGet.mockImplementation(async (id: string) => { throw new NotFoundError() })
      const invalidId = 'hoge'
      // repository の get を呼ぶと NotFoundError になる
      expect(repository.get(invalidId)).rejects.toThrow(NotFoundError)
      // 呼び出されたことを確認する
      expect(mockDbGet).toBeCalledTimes(1)
      expect(mockDbGet).toBeCalledWith(invalidId)
    })
  })
})
