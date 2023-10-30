import { convertToTitleCase, dayDiff, daysRemaining, initialiseName, multiSeparatorSplit, offsetDate } from './utils'

describe('convert to title case', () => {
  it.each([
    [null, null, ''],
    ['empty string', '', ''],
    ['Lower case', 'robert', 'Robert'],
    ['Upper case', 'ROBERT', 'Robert'],
    ['Mixed case', 'RoBErT', 'Robert'],
    ['Multiple words', 'RobeRT SMiTH', 'Robert Smith'],
    ['Leading spaces', '  RobeRT', '  Robert'],
    ['Trailing spaces', 'RobeRT  ', 'Robert  '],
    ['Hyphenated', 'Robert-John SmiTH-jONes-WILSON', 'Robert-John Smith-Jones-Wilson'],
  ])('%s convertToTitleCase(%s, %s)', (_: string, a: string, expected: string) => {
    expect(convertToTitleCase(a)).toEqual(expected)
  })
})

describe('initialise name', () => {
  it.each([
    [null, null, null],
    ['Empty string', '', null],
    ['One word', 'robert', 'r. robert'],
    ['Two words', 'Robert James', 'R. James'],
    ['Three words', 'Robert James Smith', 'R. Smith'],
    ['Double barrelled', 'Robert-John Smith-Jones-Wilson', 'R. Smith-Jones-Wilson'],
  ])('%s initialiseName(%s, %s)', (_: string, a: string, expected: string) => {
    expect(initialiseName(a)).toEqual(expected)
  })
})

describe('multi separator split', () => {
  it.each([
    ['null', null, [' '], []],
    ['Empty string', '', [' '], []],
    ['One word', 'view', [' '], ['view']],
    ['One separator', 'view read', [' '], ['view', 'read']],
    ['Two separators - relevant separator first', 'view read', [' ', ','], ['view', 'read']],
    ['Two separators - relevant separator second', 'view read', [',', ' '], ['view', 'read']],
    ['Multiple relevant separators', 'read,write delete', [',', ' '], ['read', 'write', 'delete']],
  ])('%s multiSeparatorSplit', (_: string, a: string, b: string[], expected: string[]) => {
    expect(multiSeparatorSplit(a, b)).toEqual(expected)
  })
})

describe('offset date', () => {
  it.each([
    ['Zero days', new Date('2020-01-01'), 0, new Date('2020-01-01')],
    ['One day', new Date('2020-01-01'), 1, new Date('2020-01-02')],
    ['Negative days', new Date('2020-01-01'), -1, new Date('2019-12-31')],
  ])('%s offsetDate', (_: string, a: Date, b: number, expected: Date) => {
    expect(offsetDate(a, b)).toEqual(expected)
  })
})

describe('day diff', () => {
  it.each([
    ['Zero days', new Date('2020-01-01'), new Date('2020-01-01'), 0],
    ['One day', new Date('2020-01-01'), new Date('2020-01-02'), 1],
    ['Negative days', new Date('2020-01-01'), new Date('2019-12-31'), -1],
  ])('%s dayDiff', (_: string, a: Date, b: Date, expected: number) => {
    expect(dayDiff(a, b)).toEqual(expected)
  })
})

describe('days remaining', () => {
  it.each([
    ['Null', null, 0],
    ['Zero', 0, 0],
    ['One day', 1, 1],
    ['Negative days', -1, 0],
  ])('%s daysRemaining', (_: string, days: number, expected: number) => {
    const expiryDate = days ? offsetDate(new Date(), days).toISOString() : null

    expect(daysRemaining(expiryDate)).toEqual(expected)
  })
})
