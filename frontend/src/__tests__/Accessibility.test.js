import { render, screen } from '@testing-library/react';
import AccessibilityChecker from '../components/AccessibilityChecker';

describe('AccessibilityChecker Component', () => {
  const mockIssues = [
    { id: 1, type: 'error', message: 'Missing alt text', element: 'img' },
    { id: 2, type: 'warning', message: 'Low contrast', element: 'button' }
  ];

  it('renders accessibility issues correctly', () => {
    render(<AccessibilityChecker issues={mockIssues} />);
    expect(screen.getByText(/Missing alt text/i)).toBeInTheDocument();
    expect(screen.getByText(/Low contrast/i)).toBeInTheDocument();
  });

  it('shows "No issues found" when issues array is empty', () => {
    render(<AccessibilityChecker issues={[]} />);
    expect(screen.getByText(/No accessibility issues found/i)).toBeInTheDocument();
  });
});
