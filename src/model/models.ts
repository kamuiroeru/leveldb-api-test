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
