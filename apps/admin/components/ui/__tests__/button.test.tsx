'use client';

import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../button';
import { describe, it, expect, vi } from 'vitest';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    render(<Button>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('renders correctly with outline variant', () => {
    render(<Button variant="outline">Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('border border-input');
  });

  it('renders correctly with destructive variant', () => {
    render(<Button variant="destructive">Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toHaveClass('bg-red-500');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click Me</Button>);
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeDisabled();
  });
});