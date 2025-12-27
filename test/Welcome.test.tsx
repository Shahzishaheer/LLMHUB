import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Welcome from '../src/components/Welcome'

describe('Welcome component', () => {
  it('renders title and message', () => {
    render(<Welcome />)
    expect(screen.getByText('Welcome to Our Website!')).toBeInTheDocument()
    expect(screen.getByText("We're glad to have you here.")).toBeInTheDocument()
  })
})
