import nunjucksUtils from './nunjucksUtils'

describe('nunjucksUtils', () => {
  describe('capitalCase', () => {
    it.each([
      [null, null, ''],
      ['an empty string', '', ''],
      ['lower case', 'robert', 'Robert'],
      ['upper case', 'ROBERT', 'Robert'],
      ['mixed case', 'RoBErT', 'Robert'],
      ['multiple words', 'RobeRT SMiTH', 'Robert Smith'],
      ['leading spaces', '  RobeRT', '  Robert'],
      ['trailing spaces', 'RobeRT  ', 'Robert  '],
    ])('handles %s: %s -> %s', (_inputType: string | null, input: string | null, expectedOutput: string) => {
      expect(nunjucksUtils.capitalCase(input)).toEqual(expectedOutput)
    })
  })

  describe('sentenceCase', () => {
    it.each([
      ['an empty string', '', ''],
      ['a single lower case letter', 'a', 'A'],
      ['a single upper case letter', 'A', 'A'],
      ['a lower case word', 'rosa', 'Rosa'],
      ['an upper case word', 'ROSA', 'Rosa'],
      ['a proper case word', 'Rosa', 'Rosa'],
      ['a mixed case word', 'RoSa', 'Rosa'],
      ['multiple words', 'the fish swam', 'The fish swam'],
    ])('handles %s: %s -> %s', (_inputType: string, input: string, expectedOutput: string) => {
      expect(nunjucksUtils.sentenceCase(input)).toEqual(expectedOutput)
    })
  })

  describe('capitalize', () => {
    it.each([
      ['an empty string', '', ''],
      ['a single lower case letter', 'a', 'A'],
      ['a single upper case letter', 'A', 'A'],
      ['a lower case word', 'rosa', 'Rosa'],
      ['an upper case word', 'ROSA', 'Rosa'],
      ['a proper case word', 'Rosa', 'Rosa'],
      ['a mixed case word', 'RoSa', 'Rosa'],
    ])('handles %s: %s -> %s', (_inputType: string, input: string, expectedOutput: string) => {
      expect(nunjucksUtils.capitalize(input)).toEqual(expectedOutput)
    })
  })
})
