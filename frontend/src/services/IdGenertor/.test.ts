import { generateRandomUID } from '@services/IdGenertor'

describe('Random Id Generator', () => {
  it('should generate unique id', () => {
    const id1 = generateRandomUID()
    const id2 = generateRandomUID()
    expect(id1).not.toEqual(id2)
  })

  it('generated ID should have a length of 18', () => {
    expect(generateRandomUID().length).toBe(18)
  })
})
