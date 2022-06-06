/**
 * 現在日時の ISO 文字列 (UTC) を返す
 * @return ISO文字列
 */
export const nowIsoString = (): string => {
  return new Date().toISOString()
}
