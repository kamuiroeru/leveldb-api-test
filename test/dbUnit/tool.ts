import level from 'level-ts'
import { readFile, writeFile } from 'node:fs/promises'
import { Quotation } from '../../src/model/models'

export const drop = async (db: level) => {
  const records: Quotation[] = await db.all()
  for (const q of records) {
    await db.del(q.id)
  }
}

export const loadJson = async (jsonPath: string): Promise<Quotation[]> => {
  const contents = await readFile(jsonPath)
  return JSON.parse(contents.toString())
}

export const loadJsonToDb = async (jsonPath: string, db: level) => {
  for (const q of await loadJson(jsonPath)) {
    await db.put(q.id, q)
  }
}

export const dumpDbToJson = async (outPath: string, db: level) => {
  const contents = JSON.stringify(await db.all())
  await writeFile(outPath, contents)
}
