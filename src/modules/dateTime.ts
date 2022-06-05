/**
 * 現在日時の ISO 文字列 (UTC) を返す
 * @returns ISO文字列
 */
export const nowIsoString = (): string => {
  return new Date().toISOString()
}
