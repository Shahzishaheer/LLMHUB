import { describe, it, expect } from 'vitest'
import { cn } from '../src/lib/utils'

describe('cn utility', () => {
  it('joins truthy class names', () => {
    expect(cn('a', false, undefined, 'b', null, 'c')).toBe('a b c')
  })

  it('returns empty string for all falsy', () => {
    expect(cn(undefined, null, false)).toBe('')
  })
})
