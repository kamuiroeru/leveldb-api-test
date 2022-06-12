import Level from 'level-ts'
import FsPromises from 'node:fs/promises'
import * as tool from './tool'

// 参考: https://jestjs.io/docs/es6-class-mocks#automatic-mock
jest.mock('level-ts') // モジュールルートで実施する必要がある

describe('tool.tsのテスト', () => {
  it('dumpDbToJson のテスト', async () => {
    // これだけ coverage に寄与したので書く
    // モックの設定
    const db = new Level('')
    const mockDbAll = jest.spyOn(db, 'all').mockImplementation(async () => [])
    const mockWriteFile = jest
      .spyOn(FsPromises, 'writeFile')
      .mockImplementation(async (outPath, db) => {})
    // 実行
    const outPath = '/path/to/output.json'
    await tool.dumpDbToJson(outPath, db)
    // チェック
    expect(mockDbAll).toBeCalledTimes(1)
    expect(mockWriteFile).toBeCalledWith(outPath, '[]')
  })
})
