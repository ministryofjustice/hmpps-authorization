import {
  apiEnum,
  convertToTitleCase,
  dayDiff,
  daysRemaining,
  initialiseName,
  kebab,
  multiSeparatorSplit,
  offsetDate,
  snake,
  dateTimeFormat,
  dateFormat,
  dateTimeFormatFromString,
  snakeUpper,
  toBaseClientId,
} from './utils'

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

describe('snake', () => {
  it.each([
    ['Null', null, null],
    ['Empty string', '', ''],
    ['Spaced', 'one two three', 'one_two_three'],
    ['Kebab', 'one-two-three', 'one_two_three'],
    ['Capitalised', 'One Two THREE', 'one_two_three'],
    ['Extra spaces', '  one two three   ', 'one_two_three'],
    ['Mixed', 'one-two Three  ', 'one_two_three'],
  ])('%s snake', (_: string, a: string, expected: string) => {
    expect(snake(a)).toEqual(expected)
  })
})

describe('snake_upper', () => {
  it.each([
    ['Null', null, null],
    ['Empty string', '', ''],
    ['Spaced', 'one two three', 'ONE_TWO_THREE'],
    ['Snake', 'one_two_three', 'ONE_TWO_THREE'],
    ['Kebab', 'one-two-three', 'ONE_TWO_THREE'],
    ['Capitalised', 'One Two THREE', 'ONE_TWO_THREE'],
    ['Extra spaces', '  one two three   ', 'ONE_TWO_THREE'],
    ['Mixed', 'one-two Three  ', 'ONE_TWO_THREE'],
  ])('%s snakeUpper', (_: string, a: string, expected: string) => {
    expect(snakeUpper(a)).toEqual(expected)
  })
})

describe('kebab', () => {
  it.each([
    ['Null', null, null],
    ['Empty string', '', ''],
    ['Spaced', 'one two three', 'one-two-three'],
    ['Snake', 'one_two_three', 'one-two-three'],
    ['Capitalised', 'One Two THREE', 'one-two-three'],
    ['Extra spaces', '  one two three   ', 'one-two-three'],
    ['Mixed', 'one_two Three  ', 'one-two-three'],
  ])('%s kebab', (_: string, a: string, expected: string) => {
    expect(kebab(a)).toEqual(expected)
  })
})

describe('api enum', () => {
  it.each([
    ['Null', null, null],
    ['Mixed case', 'OneTwoThree', 'ONETWOTHREE'],
    ['Spaced', 'One two three', 'ONE_TWO_THREE'],
  ])('%s apiEnum', (_: string, a: string, expected: string) => {
    expect(apiEnum(a)).toEqual(expected)
  })
})

describe('dateFormat', () => {
  it.each([
    ['a date with single digits', new Date(2020, 0, 1), '01-01-2020'],
    ['a date', new Date(2020, 11, 31), '31-12-2020'],
  ])('handles %s: %s -> %s', (_inputType: string, input: Date, expectedOutput: string) => {
    expect(dateFormat(input)).toEqual(expectedOutput)
  })
})

describe('dateTimeFormat', () => {
  it.each([
    ['a date time with single digits', new Date(2020, 0, 1, 0, 0), '01-01-2020 00:00'],
    ['a date in winter', new Date(2020, 11, 31, 23, 59), '31-12-2020 23:59'],
    ['a date time in British Summer time', new Date(2020, 7, 31, 12, 0), '31-08-2020 12:00'],
  ])('handles %s: %s -> %s', (_inputType: string, input: Date, expectedOutput: string) => {
    expect(dateTimeFormat(input)).toEqual(expectedOutput)
  })
})

describe('dateTimeStringFormat', () => {
  it.each([
    ['a date time with single digits', '2020-01-01T00:00:00.000Z', '01-01-2020 00:00'],
    ['a zulu date time in winter', '2020-12-31T23:59:00.000Z', '31-12-2020 23:59'],
    ['a zulu date time during British Summer Time', '2020-08-31T12:00:00.000Z', '31-08-2020 13:00'],
  ])('handles %s: %s -> %s', (_inputType: string, input: string, expectedOutput: string) => {
    expect(dateTimeFormatFromString(input)).toEqual(expectedOutput)
  })
})

describe('toBaseId', () => {
  it.each([
    ['an id without a trailing -digit', 'base_id', 'base_id'],
    ['an id with an internal -digit', 'base-1-id', 'base-1-id'],
    ['an id with a trailing -digit', 'base_id-1', 'base_id'],
    ['an id with trailing -multiple_digits', 'base_id-10', 'base_id'],
  ])('handles %s: %s -> %s', (_inputType: string, input: string, expectedOutput: string) => {
    expect(toBaseClientId(input)).toEqual(expectedOutput)
  })
})
