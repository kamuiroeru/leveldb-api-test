import { Quotation } from './model/models'
import { generateUuid } from './modules/uuid'
import { LevelDb } from './repository'


export interface PcService {
  repository: LevelDb
  all(): Promise<Quotation[]>
  get(id: string): Promise<Quotation>
  post(quotation: Quotation): Promise<string>
  put: (uuid: string, quotation: Quotation) => Promise<string>
}


export class PcServiceImpl implements PcService {
  repository: LevelDb

  constructor(repository: LevelDb) {
    this.repository = repository
  }

  async all(): Promise<Quotation[]> {
    return await this.repository.all()
  }

  async get(id: string): Promise<Quotation> {
    return await this.repository.get(id)
  }

  async post(quotation: Quotation): Promise<string> {
    // 重複しない uuid を生成する
    let uuid = ''
    do {
      uuid = generateUuid()
    } while (!(await this.repository.exists(uuid)))
    const copied: Quotation = JSON.parse(JSON.stringify(quotation))
    copied.id = uuid // id を付与する
    await this.repository.put(uuid, copied)
    return uuid
  }

  async put(uuid: string, quotation: Quotation): Promise<string> {
    await this.repository.put(uuid, quotation)
    return uuid
  }
}
