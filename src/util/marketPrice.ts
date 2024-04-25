

export const buildMarketPrice = (data): { marketPrice: number, minPrice: number } => {
  const marketPrice = Number(data.相場) * 0.95
  const minPrice = Number(data.相場) * 0.4
  return {
    marketPrice, minPrice
  }
}
