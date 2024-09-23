import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route } from 'react-router-dom';
import Auth from '../../components/Auth';
import { axiosMock } from '../../setupTests'; // Axios mock for simulating network requests
import toast from 'react-hot-toast';

describe('Auth Integration Tests', () => {
    const originalLocation = window.location;

    beforeEach(() => {
        // Mock the window.location object
        delete (window as any).location;
        window.location = { ...originalLocation, assign: jest.fn(), href: jest.fn() } as any;

        // Reset all mocks before each test
        axiosMock.reset();

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


    it('successfully logs in and redirects to /wishlist', async () => {
        // Mocking successful login response
        axiosMock.onPost('http://localhost:8080/auth/login').reply(200, {
            authToken: 'test-token',
        });

        // Rendering Auth component within MemoryRouter to mimic routing
        render(
            <MemoryRouter initialEntries={['/']}>
                <Route path="/" exact>
                    <Auth />
                </Route>
                <Route path="/wishlist">
                    <div>Wishlist Page</div>
                </Route>
            </MemoryRouter>
        );

        // Simulating user input and form submission
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'user@test.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'password' } });
        fireEvent.click(screen.getByTestId('auth-submit'));

        // Asserting the expected outcome
        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Logged in.'));
        expect(window.location.href).toContain('/wishlist');
    });

    it('displays error on login failure', async () => {
        // Mocking a network error
        axiosMock.onPost('http://localhost:8080/auth/login').networkError();

        // Rendering Auth component within MemoryRouter
        render(<MemoryRouter><Auth /></MemoryRouter>);

        // Simulating user input and form submission
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'user@fail.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByTestId('auth-submit'));

        // Asserting the expected outcome
        await waitFor(() => expect(toast.error).toHaveBeenCalled());
    });

    it('displays an error for invalid login credentials', async () => {
        axiosMock.onPost('http://localhost:8080/auth/login').reply(401, {
            message: 'Invalid credentials',
        });

        // Rendering Auth component within MemoryRouter
        render(<MemoryRouter><Auth /></MemoryRouter>);

        // Simulating user input and form submission
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'wronguser@example.com' } });
        fireEvent.change(screen.getByPlaceholderText(/Password/i), { target: { value: 'wrongpassword' } });
        fireEvent.click(screen.getByTestId('auth-submit'));

        // Asserting the expected outcome
        await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Invalid credentials"));
    });

    it('successfully registers a new user', async () => {
        axiosMock.onPost('http://localhost:8080/auth/register').reply(200);

        render(<MemoryRouter><Auth /></MemoryRouter>);

        // Click to switch to the register form
        fireEvent.click(screen.getByText(/register/i, { selector: 'button' }));
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'newuser@test.com' } });

        // Select the password and confirm password fields specifically within the registration form context
        const passwordFields = screen.getAllByPlaceholderText(/password/i);
        fireEvent.change(passwordFields[0], { target: { value: 'newpassword' } });
        fireEvent.change(passwordFields[1], { target: { value: 'newpassword' } });

        // Submit registration form
        fireEvent.click(screen.getByTestId('auth-submit'));

        await waitFor(() => expect(toast.success).toHaveBeenCalledWith('User created successfully.'));
    });

    it('displays error on registration failure', async () => {
        // Mocking a network error for the registration endpoint
        axiosMock.onPost('http://localhost:8080/auth/register').networkError();

        render(<MemoryRouter><Auth /></MemoryRouter>);

        // Switch to the register form
        fireEvent.click(screen.getByTestId('register-switch'));

        // Fill the Email field
        fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'failuser@test.com' } });

        // Select the password and confirm password fields specifically within the registration form context
        const passwordFields = screen.getAllByPlaceholderText(/Password/i);
        const passwordInput = passwordFields[0];
        const confirmPasswordInput = screen.getByPlaceholderText(/Confirm Password/i);

        fireEvent.change(passwordInput, { target: { value: 'failpassword' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'failpassword' } });

        // Submit the registration form
        fireEvent.click(screen.getByTestId('auth-submit'));

        // Check for error handling
        await waitFor(() => expect(toast.error).toHaveBeenCalled());
    });
});

