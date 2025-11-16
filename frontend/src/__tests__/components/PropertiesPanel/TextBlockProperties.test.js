import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextBlockProperties from '../../../components/PropertiesPanel/TextBlockProperties';

describe('TextBlockProperties', () => {
  test('renders textarea for content', () => {
    const mockBlock = { id: 1, type: 'text', content: 'Initial content' };
    const onChange = jest.fn();

    render(
      <TextBlockProperties block={mockBlock} onChange={onChange} />
    );

    const textarea = screen.getByLabelText('Content text');
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe('Initial content');
  });

  test('calls onChange when content is updated', () => {
    const mockBlock = { id: 1, type: 'text', content: 'Initial content' };
    const onChange = jest.fn();

    render(
      <TextBlockProperties block={mockBlock} onChange={onChange} />
    );

    const textarea = screen.getByLabelText('Content text');
    fireEvent.change(textarea, { target: { value: 'New content' } });

    expect(onChange).toHaveBeenCalledWith(1, { content: 'New content' });
  });

  test('renders textarea for heading type', () => {
    const mockBlock = { id: 2, type: 'heading', content: 'Heading text' };
    const onChange = jest.fn();

    render(
      <TextBlockProperties block={mockBlock} onChange={onChange} />
    );

    const textarea = screen.getByLabelText('Content text');
    expect(textarea).toBeInTheDocument();
    expect(textarea.value).toBe('Heading text');
  });

  test('handles empty content', () => {
    const mockBlock = { id: 3, type: 'text', content: '' };
    const onChange = jest.fn();

    render(
      <TextBlockProperties block={mockBlock} onChange={onChange} />
    );

    const textarea = screen.getByLabelText('Content text');
    expect(textarea.value).toBe('');
  });
});
