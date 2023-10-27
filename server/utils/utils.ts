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
  newDate.setDate(newDate.getDate() + days)
  return newDate
}
