import { format } from 'date-fns' // eslint-disable-line import/no-duplicates
import { enGB } from 'date-fns/locale' // eslint-disable-line import/no-duplicates

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const multiSeparatorSplit = (str: string, separators: string[]): string[] => {
  if (!str) {
    return []
  }

  let value = str
  const firstSeparator = separators[0]
  for (let i = 1; i < separators.length; i += 1) {
    value = value.split(separators[i]).join(firstSeparator)
  }
  return value.split(firstSeparator)
}

export const snake = (str: string): string => {
  if (!str) return str
  let value = str.trim().toLowerCase()
  value = value.replace(/ /g, '_')
  value = value.replace(/-/g, '_')
  return value
}

export const snakeUpper = (str: string): string => {
  if (!str) return str
  let value = str.trim().toLowerCase()
  value = value.replace(/ /g, '_')
  value = value.replace(/-/g, '_')
  return value.toUpperCase()
}

export const kebab = (str: string): string => {
  if (!str) return str
  return snake(str).replace(/_/g, '-')
}

export const apiEnum = (str: string): string => {
  if (!str) return str
  return snake(str).toUpperCase()
}

export const dayDiff = (fromDate: Date, toDate: Date) => {
  const diff = toDate.getTime() - fromDate.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

export const daysRemaining = (expiryDate?: string) => {
  if (!expiryDate) {
    return 0
  }
  const datePart = expiryDate.split('T')[0]
  const dateToday = new Date().toISOString().split('T')[0]

  const diff = dayDiff(new Date(dateToday), new Date(datePart))
  return diff < 0 ? 0 : diff
}

export const offsetNow = (days: number) => {
  return offsetDate(new Date(), days)
}

export const offsetDate = (date: Date, days: number) => {
  const newDate = new Date(date)
  newDate.setDate(date.getDate() + days)
  return newDate
}

export const parseIntWithDefault = (value: string, defaultValue: number) => {
  const parsed = parseInt(value, 10)
  return Number.isNaN(parsed) ? defaultValue : parsed
}

export const getDayOfExpiry = (daysLeft: string) => {
  const daysRemainingInt = parseIntWithDefault(daysLeft, 0)
  return offsetNow(daysRemainingInt).toISOString().split('T')[0]
}

export const dateISOString = (date: Date) => {
  return date.toISOString().split('T')[0]
}

export const getAccessTokenValiditySeconds = (accessTokenValidity: string, customAccessTokenValidity?: string) => {
  if (accessTokenValidity === 'custom' && customAccessTokenValidity) {
    return parseIntWithDefault(customAccessTokenValidity, 0)
  }
  return parseIntWithDefault(accessTokenValidity, 0)
}

export const dateFormat = (date: Date): string => {
  // dd-mm-yyyy
  return format(date, 'dd-MM-yyyy', { locale: enGB })
}

export const dateTimeFormat = (date: Date): string => {
  // dd-mm-yyyy hh:mm
  return format(date, 'dd-MM-yyyy HH:mm', { locale: enGB })
}

export const dateFormatFromString = (date: string): string => {
  // return null if date is null
  if (!date || Number.isNaN(Date.parse(date))) {
    return ''
  }

  // dd-mm-yyyy
  return format(new Date(date), 'dd-MM-yyyy', { locale: enGB })
}

export const dateTimeFormatFromString = (date: string): string => {
  // return null if date is null
  if (!date || Number.isNaN(Date.parse(date))) {
    return ''
  }

  // dd-mm-yyyy hh:mm for GB locale

  return format(new Date(date), 'dd-MM-yyyy HH:mm', { locale: enGB })
}

export const toBaseClientId = (id: string): string => {
  // remove any trailing hyphen and number
  if (!id) return id
  return id.replace(/-\d+$/, '')
}
