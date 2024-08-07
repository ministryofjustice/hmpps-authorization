import { kebab, snake, dateFormat, dateTimeFormat } from '../../utils/utils'

const isBlank = (str: string): boolean => {
  return !str || /^\s*$/.test(str)
}

const capitalCase = (sentence: string | null): string => {
  return sentence === null || isBlank(sentence) ? '' : sentence.split(' ').map(capitalize).join(' ')
}

const sentenceCase = (sentence: string | null): string => {
  if (sentence === null || isBlank(sentence)) {
    return ''
  }

  const words = sentence.split(' ')
  if (words.length === 1) {
    return capitalize(words[0])
  }
  return `${capitalize(words[0])} ${words.slice(1).join(' ')}`
}

const capitalize = (word: string): string => {
  if (!word) return word
  return word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word
}

const toLinesHtml = (str?: string[]): string | null => {
  if (str === undefined) {
    return ''
  }
  return str.join('<br>')
}

const toLines = (str?: string[]): string | null => {
  if (str === undefined) {
    return ''
  }
  return str.join('\n')
}

const ternary = (condition: boolean, value: string, alternative: string): string => {
  return condition ? value : alternative
}

export default {
  toLinesHtml,
  toLines,
  sentenceCase,
  capitalize,
  capitalCase,
  snake,
  kebab,
  dateFormat,
  dateTimeFormat,
  ternary,
}
