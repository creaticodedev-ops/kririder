import { groupCarsByCategory } from '../utils/vehicleCategories'
import { vehicleImage } from './theme'

const isPriced = (car) => Number(car?.pricePerDay) > 0
const isListed = (car) => car?.isAvaliable !== false

export const categoryCurrency = (profile) =>
  String(profile?.currency || import.meta.env.VITE_CURRENCY || 'MAD').replace(/\s+/g, ' ').trim()

export const formatFromAmount = (amount, currency) => {
  if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) return ''
  return `${Number(amount)} ${currency}`.trim()
}

/**
 * Categories and starting prices from the live catalog only.
 * Empty categories never appear. Prices are min(pricePerDay) of real vehicles.
 */
export const buildCategoryShowcase = (cars = []) =>
  groupCarsByCategory(cars)
    .map(({ category, cars: items }) => {
      const priced = items.filter(isPriced)
      const availablePriced = priced.filter(isListed)
      const pricePool = availablePriced.length ? availablePriced : priced
      const fromPrice = pricePool.length
        ? Math.min(...pricePool.map((car) => Number(car.pricePerDay)))
        : null

      const visualPool = items.filter((car) => vehicleImage(car))
      const availableVisual = visualPool.filter(isListed)
      const shots = (availableVisual.length ? availableVisual : visualPool)
      const lead = shots[0] || pricePool[0] || items[0]
      const image = vehicleImage(lead)

      return {
        id: String(category),
        category,
        count: items.length,
        fromPrice,
        image,
        lead,
        nextImage: vehicleImage(shots[1]) || '',
      }
    })
    .filter((slide) => slide.category)
