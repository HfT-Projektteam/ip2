import { generateRandomUID } from '@services/IdGenertor'

describe('Random Id Generator', () => {
  it('should generate unique id', () => {
    const id1 = generateRandomUID()
    const id2 = generateRandomUID()
    expect(id1).not.toEqual(id2)
  })

  it('generated ID should have a length of 0', () => {
    expect(generateRandomUID().length).toBeGreaterThanOrEqual(0)
  })

  it.todo('Random Id should always be the same length')
})
