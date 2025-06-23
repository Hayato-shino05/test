import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CountdownPage from '../CountdownPage';

// Utility: generate a date string for tomorrow to ensure non-negative countdown
function tomorrowISO() {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return t.toISOString().split('T')[0];
}

describe('CountdownPage', () => {
  it('renders heading and time boxes', () => {
    render(<CountdownPage date={tomorrowISO()} />);
    expect(screen.getByRole('heading', { name: /happy birthday countdown/i })).toBeInTheDocument();
    // verify the four time elements exist
    expect(screen.getByLabelText('days')).toBeInTheDocument();
    expect(screen.getByLabelText('hours')).toBeInTheDocument();
    expect(screen.getByLabelText('minutes')).toBeInTheDocument();
    expect(screen.getByLabelText('seconds')).toBeInTheDocument();
  });
});
