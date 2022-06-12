import { generateUuid } from '../../src/modules/uuid'

const isUuidV4 = (s: string): boolean => {
  return /^[0-f]{8}-[0-f]{4}-4[0-f]{3}-[8-f][0-f]{3}-[0-f]{12}$/.test(s)
}

describe('uuidモジュールのテスト', () => {
  const args = [...Array(10).keys()].map((i) => (' ' + (i + 1)).slice(-2)) // 2桁に揃えた引数
  test.each(args)('generateUuidのテスト %s 回目', (_s: string) => {
    expect(isUuidV4(generateUuid())).toBe(true)
  })
})
