import Level from 'level-ts'
import { NotFoundError } from 'level-errors'
import { Quotation } from '../src/model/models'
import { LevelDbImpl } from '../src/repository'
import { PcServiceImpl } from '../src/service'
import { testQuotation } from './modelTools'
import * as dateTime from "../src/modules/dateTime"
import * as myUuid from '../src/modules/uuid'

// モック化した db を作って repository を作成する
// 参考: https://jestjs.io/docs/es6-class-mocks#automatic-mock
jest.mock('level-ts') // モジュールルートで実施する必要がある
const db = new Level('')
const repository = new LevelDbImpl(db)
const service = new PcServiceImpl(repository)

describe('serviceのunitTest', () => {
  // モックを設定する
  // // repository のメソッドモックを設定する
  const mockRepoAll = jest.spyOn(repository, 'all')
  const mockRepoGet = jest.spyOn(repository, 'get')
  const mockRepoPut = jest.spyOn(repository, 'put')
  const mockRepoDel = jest.spyOn(repository, 'del')
  const mockRepoExists = jest.spyOn(repository, 'exists')
  // その他のモック
  const dateTimeMock = jest.spyOn(dateTime, 'nowIsoString')
  const mockGenerateUuid = jest.spyOn(myUuid, 'generateUuid')

  afterEach(() => {
    // 各 it で モックをリセットする
    [
      mockRepoAll, mockRepoGet, mockRepoPut, mockRepoDel, mockRepoExists,
      dateTimeMock, mockGenerateUuid
    ].map(m => m.mockClear())
  })

  describe('正常系', () => {
    it('allチェック', async () => {
      // repository.all の挙動を指定
      const expected = [testQuotation()]
      mockRepoAll.mockImplementation(async () => expected)
      // テスト対象を実行
      const result = await service.all()
      // 返り値や呼び出し回数のチェック
      expect(result.length).toEqual(expected.length)
      expect(result[0]).toEqual(expected[0])
      expect(mockRepoAll).toBeCalledTimes(1)
    })

    it('getチェック', async () => {
      // repository.get の挙動を指定
      const expected = testQuotation()
      mockRepoGet.mockImplementation(async (id: string) => expected)
      // テスト対象を実行
      const result = await service.get(expected.id)
      // 返り値や呼び出し回数のチェック
      expect(result).toEqual(expected)
      expect(mockRepoGet).toBeCalledTimes(1)
      expect(mockRepoGet).toBeCalledWith(expected.id)
    })

    it('postチェック', async () => {
      // generateUuid によって生成した Uuid が 2回 衝突 しても正常に動作することを確認
      // generateUuid() と repository.exists の挙動を指定
      mockGenerateUuid
        .mockReturnValueOnce('uuid1') // 1回目の返り値
        .mockReturnValueOnce('uuid2') // 2回目の返り値
        .mockReturnValue('uuidN') // 3回目以降の返り値
      mockRepoExists
        .mockReturnValueOnce(new Promise(res => { res(false) })) // 1回目 衝突
        .mockReturnValueOnce(new Promise(res => { res(false) })) // 2回目 衝突
        .mockReturnValue(new Promise(res => { res(true) })) // 3回目以降は衝突しない
      // テスト対象を実行
      const input = testQuotation()
      const result = await service.post(input)
      // 返り値や呼び出し回数のチェック
      expect(result).toBe('uuidN')
      expect(mockGenerateUuid).toBeCalledTimes(3)
      // // repository.exists が、['uuid1'], ['uuid2'], ['uuidN'] の引数の順に 3回呼ばれたことを確認
      expect(mockRepoExists.mock.calls).toEqual([['uuid1'], ['uuid2'], ['uuidN']])
      const copied: Quotation = JSON.parse(JSON.stringify(input))
      copied.id = 'uuidN' // 衝突しない UUID が指定されて repository.put されているはず
      expect(mockRepoPut).toBeCalledWith('uuidN', copied)
    })

    it('putチェック', async () => {
      // repository.put の挙動を指定
      mockRepoPut.mockImplementation(async (uuid, quotation) => { })
      // テスト対象を実行
      const quotation = testQuotation()
      await service.put(quotation.id, quotation)
      // 返り値や呼び出し回数のチェック
      expect(mockRepoPut).toBeCalledTimes(1)
      expect(mockRepoPut).toBeCalledWith(quotation.id, quotation)
    })
  })

  describe('異常系', () => {
    it('存在しない項目をgetする', () => {
      mockRepoGet.mockImplementation(async (id: string) => { throw new NotFoundError() })
      const invalidId = 'hoge'
      // repository の get を呼ぶと NotFoundError になる
      expect(service.get(invalidId)).rejects.toThrow(NotFoundError)
      // 呼び出されたことを確認する
      expect(mockRepoGet).toBeCalledTimes(1)
      expect(mockRepoGet).toBeCalledWith(invalidId)
    })
  })
})
