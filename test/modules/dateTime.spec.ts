import { nowIsoString } from '../../src/modules/dateTime'

describe('dateTimeモジュールのテスト', () => {
  const frozenTime = '2022-06-08T13:43:09.323Z'
  const mockDate = new Date(frozenTime)

  it('nowIsoStringのテスト', () => {
    // new Date の時間を固定する
    const toISOStringMock = jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate as unknown as string)
    expect(nowIsoString()).toBe(frozenTime)
    expect(toISOStringMock).toBeCalledTimes(1)
  })
})
