import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../slice/usersSlice';
import { UserModal } from '../components/UserModal';

function renderWithStore(ui: React.ReactElement) {
  const store = configureStore({
    reducer: { users: usersReducer },
  });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('UserModal Form Validation & Pre-fill', () => {
  test('validates required fields on submission of empty Add form', async () => {
    renderWithStore(<UserModal open={true} onClose={jest.fn()} />);

    const submitBtn = screen.getByRole('button', { name: /create user/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test('pre-fills form fields when editing an existing user', () => {
    const editUser = {
      id: 'usr-99',
      name: 'Bruce Wayne',
      email: 'bruce@gotham.com',
      role: 'Admin' as const,
      status: 'Active' as const,
      department: 'Engineering' as const,
      avatar: '',
      createdAt: '2026-01-01T00:00:00Z',
      lastActive: '2026-08-01T00:00:00Z',
    };

    renderWithStore(<UserModal open={true} onClose={jest.fn()} editUser={editUser} />);

    expect(screen.getByDisplayValue('Bruce Wayne')).toBeInTheDocument();
    expect(screen.getByDisplayValue('bruce@gotham.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });
});
