import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModelSelector from '../src/components/ModelSelector'

// Ensure clean localStorage between tests
beforeEach(() => {
  localStorage.clear()
})

describe('ModelSelector', () => {
  it('defaults to Nvidia + SiliconFlow and notifies parent', async () => {
    const onSelectionChange = vi.fn()
    render(<ModelSelector multiSelect={true} onSelectionChange={onSelectionChange} />)

    // On mount, should call with two default models
    expect(onSelectionChange).toHaveBeenCalled()
    const firstCallArg = onSelectionChange.mock.calls[0][0]
    expect(firstCallArg.map((m: any) => m.id).sort()).toEqual(['Nvidia', 'SiliconFlow'])

    // Button label shows count
    expect(screen.getByRole('button')).toHaveTextContent('2 Models')
  })

  it('enables Gemini when API key is present and updates selection', async () => {
    const user = userEvent.setup()
    localStorage.setItem('gemini', 'dummy-key')
    const onSelectionChange = vi.fn()

    render(<ModelSelector multiSelect={true} onSelectionChange={onSelectionChange} />)

    // Open dropdown via the trigger button
    await user.click(screen.getByRole('button', { name: /models/i }))

    const geminiBtn = screen.getByText('Gemini').closest('button') as HTMLButtonElement
    expect(geminiBtn).toBeEnabled()

    await user.click(geminiBtn)

    // Label should update to 3 models selected
    expect(screen.getByRole('button', { name: /3 models/i })).toBeInTheDocument()
  })
})
