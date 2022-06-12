import level from 'level-ts'
import { LevelDb, LevelDbImpl } from '../../src/repository'
import { rm } from 'node:fs/promises'
import { drop, loadJsonToDb, loadJson } from './tool'
import * as dateTime from '../../src/modules/dateTime'

const testLevelDbDir = `${process.cwd()}/.leveldb-test`
const db = new level(testLevelDbDir)
let repository: LevelDb

describe('repositoryのdbUnitTest', () => {
  beforeAll(async () => {
    console.log('Setup repository.')
    repository = new LevelDbImpl(db)
  })

  beforeEach(async () => {
    console.log('Reset db.')
    await drop(db)
    await loadJsonToDb(`${__dirname}/data/pcInit.json`, db)
  })

  describe('正常系', () => {
    it('allチェック', async () => {
      const quotations = await repository.all()
      // console.log('ids:\n', quotations.map(q => q.id).join('\n'))
      expect(quotations.length).toBe(5)
      expect(quotations).toEqual(
        await loadJson(`${__dirname}/data/pcInit.json`)
      )
    })

    it('GETチェック', async () => {
      const id = 'e8527e04-9bb7-407e-94c6-c71844141b4e'
      const quotation = await repository.get(id)
      const expectedQuotation = (
        await loadJson(`${__dirname}/data/pcInit.json`)
      ).slice(-1)[0]
      expect(quotation.id).toBe(id)
      expect(quotation).toEqual(expectedQuotation)
    })

    it('PUTチェック', async () => {
      // nowIsoString をモックする
      const spy = jest
        .spyOn(dateTime, 'nowIsoString')
        .mockReturnValue('2022-06-05T12:34:56.789Z')
      // 更新する Quotation を用意する
      const id = 'e8527e04-9bb7-407e-94c6-c71844141b4e'
      const quotation = await repository.get(id)
      delete quotation.cpu
      quotation.totalPrice = 0
      quotation.totalWatts = 1
      quotation.text = 'updated'
      // システム時間を固定して 更新
      await repository.put(id, quotation)
      // 検証
      const expected = await loadJson(`${__dirname}/data/pcPutExpected.json`)
      const actual = await repository.all()
      expect(expected).toEqual(actual)
      expect(spy).toBeCalledTimes(1)
    })

    it('DELチェック', async () => {
      const ids = [
        '0e9df247-1ae2-45e0-97e4-d8555a596bdd',
        '38a19f87-6e37-4a6a-89d1-941f89521a35',
        '96d5885e-bc1a-4452-9a8f-dc81512c202b',
        'ab06e9a0-5c1b-480f-893b-45b3f4a76d82',
      ]
      // 順に消す
      for (const id of ids) {
        await repository.del(id)
      }
      // 検証
      const expected = await loadJson(`${__dirname}/data/pcDelExpected.json`)
      const actual = await repository.all()
      expect(expected).toEqual(actual)
    })

    it('DELチェック', async () => {
      const ids = [
        '0e9df247-1ae2-45e0-97e4-d8555a596bdd',
        '38a19f87-6e37-4a6a-89d1-941f89521a35',
        '96d5885e-bc1a-4452-9a8f-dc81512c202b',
        'ab06e9a0-5c1b-480f-893b-45b3f4a76d82',
      ]
      // 順に消す
      for (const id of ids) {
        await repository.del(id)
      }
      // 検証
      const expected = await loadJson(`${__dirname}/data/pcDelExpected.json`)
      const actual = await repository.all()
      expect(expected).toEqual(actual)
    })
  })

  describe('異常系', () => {
    it('存在しない UUID を GET', () => {
      const id = 'invalid-key'
      // async 関数は await せずに .rejects をつけてチェックする
      expect(() => repository.get(id)).rejects.toThrow(
        'Key not found in database [invalid-key]'
      )
    })
  })

  afterAll(async () => {
    console.log('Teardown repository.')
    await rm(testLevelDbDir, {
      recursive: true,
      force: true,
    })
  })
})
