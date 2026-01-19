import { render, screen } from '@testing-library/react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';

describe('Performance Monitoring in AnalyticsDashboard', () => {
  const mockData = {
    performance: {
      loadTime: 1.2,
      interactiveTime: 2.5,
      score: 92
    },
    usage: []
  };

  it('displays performance metrics', () => {
    render(<AnalyticsDashboard data={mockData} />);
    expect(screen.getByText(/1.2s/i)).toBeInTheDocument();
    expect(screen.getByText(/92/i)).toBeInTheDocument();
  });
});
