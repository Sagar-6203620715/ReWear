import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders health warning when backend is unhealthy', () => {
  // Mock fetch to simulate unhealthy backend
  global.fetch = jest.fn(() => Promise.resolve({ json: () => Promise.resolve({ status: 'fail' }) }));
  render(<App />);
  expect(screen.getByText(/Warning: Backend API is not reachable or unhealthy/i)).toBeInTheDocument();
}); 