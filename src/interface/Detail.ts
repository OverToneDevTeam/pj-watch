export interface Detail extends Record<string, string> {
  brand: string
  model: string
  accessories: string
  price: string
  bidDate: string
  lot: string
  page: string
}

export interface ScrapedDetail {
  url: string
  price: number
  source: string
}