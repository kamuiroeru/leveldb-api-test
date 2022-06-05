import level from 'level-ts'
import { Quotation } from "./model/models";
import { nowIsoString } from './modules/dateTime';

export interface LevelDb {
  db: level<Quotation>
  all(): Promise<Quotation[]>
  get(id: string): Promise<Quotation>
  put(uuid: string, quotation: Quotation): Promise<void>
  del(uuid: string): Promise<void>
  exists(uuid: string): Promise<boolean>
}

export class LevelDbImpl implements LevelDb {
  // db = new level<Quotation>(`${process.cwd()}/.leveldb`)
  db: level<Quotation>

  constructor (db: level<Quotation>) {
    this.db = db
  }

  async all(): Promise<Quotation[]> {
    return await this.db.all()
  }

  async get(id: string): Promise<Quotation> {
    return await this.db.get(id)
  }

  async put(uuid: string, quotation: Quotation): Promise<void> {
    quotation.updatedAt = nowIsoString()
    await this.db.put(uuid, quotation)
  }

  async del(uuid: string): Promise<void> {
    await this.db.del(uuid)
  }

  async exists(uuid: string): Promise<boolean> {
    return await this.db.exists(uuid)
  }
}
