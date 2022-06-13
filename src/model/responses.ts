import { Quotation } from './models'

export type GetHello = {
  status: string
}

export type GetUuid = {
  v4: string
}

export type GetPcList = {
  quotations: Quotation[]
}

export type GetPc = Quotation

export type PostOkResponse = {
  id: string
}

export type ErrorResponse = {
  message: string
  name?: string
}
