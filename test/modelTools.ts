import { Quotation } from '../src/model/models'

export const testQuotation = (): Quotation => {
  return {
    id: 'id',
    cpu: {
      id: 'cpuId',
      name: 'Intel Core i9-12900K',
      url: 'https://intel-core-i9-12900K.com',
      price: 75980,
      shop: 'pcShop',
      watts: null,
    },
    totalPrice: 75980,
    totalWatts: 150,
    text: 'Comment',
    createdAt: '2022-06-05T13:34:09.319Z',
    updatedAt: '2022-06-05T13:34:09.319Z',
  }
}
