import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import usersReducer from '../slice/usersSlice';
import { UsersTable } from '../components/UsersTable';

const mockUsers = [
  {
    id: 'usr-1',
    name: 'Gowtham Admin',
    email: 'gowtham@google.com',
    role: 'Admin' as const,
    status: 'Active' as const,
    department: 'Engineering' as const,
    avatar: '',
    createdAt: '2026-01-01T00:00:00Z',
    lastActive: '2026-08-01T00:00:00Z',
  },
  {
    id: 'usr-2',
    name: 'Sarah Connor',
    email: 'sarah@google.com',
    role: 'Manager' as const,
    status: 'Inactive' as const,
    department: 'Sales' as const,
    avatar: '',
    createdAt: '2026-02-01T00:00:00Z',
    lastActive: '2026-07-15T00:00:00Z',
  },
];

function renderWithStore(ui: React.ReactElement, preloadedState = {}) {
  const store = configureStore({
    reducer: { users: usersReducer },
    preloadedState: {
      users: {
        items: mockUsers,
        selected: [],
        meta: { page: 1, limit: 10, total: 2, totalPages: 1 },
        filters: { q: '', role: '', status: '', department: '', sort: 'name', order: 'asc' as const },
        loading: false,
        saving: false,
        error: null,
        optimisticDeletes: [],
        ...preloadedState,
      },
    },
  });
  return render(<Provider store={store}>{ui}</Provider>);
}

describe('UsersTable Component', () => {
  test('renders correct number of user rows from store state', () => {
    renderWithStore(<UsersTable onEdit={jest.fn()} />);

    expect(screen.getByText('Gowtham Admin')).toBeInTheDocument();
    expect(screen.getByText('sarah@google.com')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });

  test('calls onEdit callback when edit icon button is clicked', () => {
    const handleEdit = jest.fn();
    renderWithStore(<UsersTable onEdit={handleEdit} />);

    const editButtons = screen.getAllByRole('button', { name: /edit/i });
    fireEvent.click(editButtons[0]);

    expect(handleEdit).toHaveBeenCalledWith(mockUsers[0]);
  });
});
