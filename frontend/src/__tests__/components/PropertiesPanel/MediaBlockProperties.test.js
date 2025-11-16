import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MediaBlockProperties from '../../../components/PropertiesPanel/MediaBlockProperties';

describe('MediaBlockProperties', () => {
  test('renders URL and title inputs for image', () => {
    const mockBlock = { id: 1, type: 'image', url: 'https://example.com/image.jpg', title: 'Test Image' };
    const onChange = jest.fn();

    render(
      <MediaBlockProperties block={mockBlock} onChange={onChange} />
    );

    expect(screen.getByLabelText('Media URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Media title')).toBeInTheDocument();
    expect(screen.getByLabelText('Alt text for image')).toBeInTheDocument();
  });

  test('renders URL and title inputs for video', () => {
    const mockBlock = { id: 2, type: 'video', url: 'https://example.com/video.mp4', title: 'Test Video' };
    const onChange = jest.fn();

    render(
      <MediaBlockProperties block={mockBlock} onChange={onChange} />
    );

    expect(screen.getByLabelText('Media URL')).toBeInTheDocument();
    expect(screen.getByLabelText('Media title')).toBeInTheDocument();
    expect(screen.getByLabelText('Video description')).toBeInTheDocument();
  });

  test('calls onChange when URL is updated', () => {
    const mockBlock = { id: 1, type: 'image', url: 'old-url.jpg' };
    const onChange = jest.fn();

    render(
      <MediaBlockProperties block={mockBlock} onChange={onChange} />
    );

    const urlInput = screen.getByLabelText('Media URL');
    fireEvent.change(urlInput, { target: { value: 'new-url.jpg' } });

    expect(onChange).toHaveBeenCalledWith(1, { url: 'new-url.jpg' });
  });

  test('calls onChange when alt text is updated for image', () => {
    const mockBlock = { id: 1, type: 'image', alt: 'Old alt text' };
    const onChange = jest.fn();

    render(
      <MediaBlockProperties block={mockBlock} onChange={onChange} />
    );

    const altInput = screen.getByLabelText('Alt text for image');
    fireEvent.change(altInput, { target: { value: 'New alt text' } });

    expect(onChange).toHaveBeenCalledWith(1, { alt: 'New alt text' });
  });

  test('calls onChange when description is updated for video', () => {
    const mockBlock = { id: 2, type: 'video', alt: 'Old description' };
    const onChange = jest.fn();

    render(
      <MediaBlockProperties block={mockBlock} onChange={onChange} />
    );

    const descriptionInput = screen.getByLabelText('Video description');
    fireEvent.change(descriptionInput, { target: { value: 'New description' } });

    expect(onChange).toHaveBeenCalledWith(2, { alt: 'New description' });
  });
});
