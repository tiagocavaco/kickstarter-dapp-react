import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Index from '../pages/index';
import { GlobalStore, GlobalContext } from '../context/store';

describe('Index', () => {
  it('renders a heading', () => {
    render(
      <GlobalContext.Provider value={{ globalState: {}, dispatch: jest.fn(() => {}) }}>
        <Index />
      </GlobalContext.Provider>
    )

    const heading = screen.getByRole('heading', {
      name: /Open Campaigns/i,
    })

    expect(heading).toBeInTheDocument()
  })
})