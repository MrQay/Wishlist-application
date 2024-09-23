import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Auth from '../../components/Auth';
import { login, register } from '../../services/authService';
import { MemoryRouter } from 'react-router-dom';
import toast from 'react-hot-toast';

// Setup mocks for external dependencies
jest.mock('../../services/authService');
jest.mock('react-hot-toast');

describe('Auth Component Tests', () => {
    // Preserve the original window.location object to restore after tests
    const originalLocation = window.location;

    beforeEach(() => {
        // Mock the window.location object
        delete (window as any).location;
        window.location = { ...originalLocation, assign: jest.fn(), href: jest.fn() } as any;

        // Mock localStorage.setItem
        Storage.prototype.setItem = jest.fn();

        // Mock toast succes and error
        jest.spyOn(toast, 'success').mockImplementation();
        jest.spyOn(toast, 'error').mockImplementation();
    });


    afterEach(() => {
        jest.clearAllMocks();
        window.location = originalLocation;
    });

    it('renders login and register form', () => {
        render(<MemoryRouter><Auth /></MemoryRouter>);

        // Confirm both email and password fields are present initially
        expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();

        // Confirm Password field should not be visible in login mode
        expect(screen.queryByPlaceholderText(/Confirm Password/i)).not.toBeInTheDocument();
    });

    it('switches between login and register form', () => {
        render(<MemoryRouter><Auth /></MemoryRouter>);

        // Toggle to the register form and verify additional fields
        fireEvent.click(screen.getByText(/Register/i));
        expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();

        // Toggle back to login form
        fireEvent.click(screen.getByText(/Login/i));
        expect(screen.queryByPlaceholderText(/Confirm Password/i)).not.toBeInTheDocument();
    });

    it('handles successful login', async () => {
        (login as jest.Mock).mockResolvedValue({ status: 200, data: { authToken: 'fake-token' } });
        render(<MemoryRouter><Auth /></MemoryRouter>);

        // Simulate successful login process
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'user@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByTestId('auth-submit'));

        // Validate successful login feedback
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Logged in.'));
    });

    it('handles login error', async () => {
        const errorMessage = 'Login failed';
        (login as jest.Mock).mockRejectedValue({ response: { data: { message: errorMessage } } });
        render(<MemoryRouter><Auth /></MemoryRouter>);

        // Attempt to log in with incorrect credentials
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'user@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByTestId('auth-submit'));

        // Check for error feedback
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith(errorMessage));
    });

    it('handles registration error', async () => {
        const errorMessage = 'Registration failed';
        (register as jest.Mock).mockRejectedValue({ response: { data: { message: errorMessage } } });
        render(<MemoryRouter><Auth /></MemoryRouter>);

        // Attempt to register and trigger an error
        fireEvent.click(screen.getByTestId('register-switch'));
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'failuser@test.com' } });

        const passwordInputs = screen.getAllByPlaceholderText(/Password/i);
        fireEvent.change(passwordInputs[0], { target: { value: 'failpassword' } });
        fireEvent.change(passwordInputs[1], { target: { value: 'failpassword' } });
        fireEvent.click(screen.getByTestId('auth-submit'));

        // Ensure registration error is displayed
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith(errorMessage));
    });

    it('shows an error when trying to register with non-matching passwords', async () => {
        render(<MemoryRouter><Auth /></MemoryRouter>);

        // Switch to the registration form
        fireEvent.click(screen.getByTestId('register-switch'));

        // Fill the form with mismatching passwords
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getAllByPlaceholderText(/Password/i)[0], { target: { value: 'password123' } });
        fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'password124' } });

        // Attempt to submit the form
        fireEvent.click(screen.getByTestId('auth-submit'));

        // Check for the password mismatch error message
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Passwords don't match."));
    });

    it('shows an error when trying to register with a short password', async () => {
        render(<MemoryRouter><Auth /></MemoryRouter>);

        // Trigger short password error during registration
        fireEvent.click(screen.getByTestId('register-switch'));
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'user@example.com' } });
        fireEvent.change(screen.getAllByPlaceholderText(/Password/i)[0], { target: { value: 'pass' } }); // Intentionally short password
        fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'pass' } });
        fireEvent.click(screen.getByTestId('auth-submit'));

        // Verify the short password error
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Password length should be at least 8."));
    });
});
