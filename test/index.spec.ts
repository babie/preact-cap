import { Cap } from '../src/'

describe('Cap', (): void => {
  it('rewind', (): void => {
    expect(Cap.rewind()).toStrictEqual([])
  })
})
