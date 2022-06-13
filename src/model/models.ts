export type Component = {
  id: string
  name: string
  url: string
  price: number
  shop: string
  watts: null | number
}

export type Quotation = {
  id: string
  cpu?: Component
  cpuCooler?: Component
  memory?: Component
  motherBoard?: Component
  videoCard?: Component
  soundCard?: Component
  ssd?: Component
  hdd?: Component
  diskDrive?: Component
  case?: Component
  powerSupply?: Component
  os?: Component
  totalPrice: number
  totalWatts: number
  text: string
  createdAt?: string // iso string
  updatedAt?: string // iso string
}

export const quotationGenerator = (now: string, uuid: string): Quotation => {
  return {
    id: '[[toBeReplaced]]',
    cpu: {
      id: uuid,
      name: 'Intel Core i9-12900K',
      url: 'https://www.dospara.co.jp/5shopping/detail_parts.php?bg=1&br=11&sbr=1329&ic=475986&utm_source=kakaku.com&utm_medium=referral&utm_campaign=kakaku_parts_camp&_bdadid=JPGTE5.00002isv&lf=0',
      price: 75980,
      shop: 'ドスパラ',
      watts: null,
    },
    totalPrice: 75980,
    totalWatts: 150,
    text: '',
    createdAt: now,
    updatedAt: now,
  }
}
