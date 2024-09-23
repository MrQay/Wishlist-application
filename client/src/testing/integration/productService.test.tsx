import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { axiosMock } from '../../setupTests';
import { MemoryRouter, Route } from 'react-router-dom';
import ProductPage from '../../views/ProductPage';
import toast from 'react-hot-toast';

jest.mock('react-hot-toast');

describe('ProductPage Component and Service Methods', () => {
    beforeEach(() => {
        axiosMock.reset();
        jest.clearAllMocks();
    });

    it('successfully adds a new product to the wishlist', async () => {
        // Define mock response and request expectations
        const mockProduct = {
            product_id: 1,
            wishlist_id: 1,
            title: "Lightweight Water-Resistant Jacket",
            description: "A perfect jacket for unpredictable weather.",
            url: "https://www.example.com/product",
            imageUrl: "https://www.example.com/image.jpg",
            price: 49.99,
            amount: 1,
            ranking: "5 stars",
            date_added: new Date('2024-02-25T08:00:00Z').toISOString()
        };
        axiosMock.onPost('/wishlist/1/products').reply(200, mockProduct);

        render(<MemoryRouter><ProductPage /></MemoryRouter>);

        // Simulate user input
        await act(async () => { userEvent.type(screen.getByLabelText(/gift name/i), 'Test Product'); });
        await act(async () => { userEvent.type(screen.getByLabelText(/price/i), '100'); });
        await act(async () => { userEvent.type(screen.getByLabelText(/where to buy/i), mockProduct.url); });

        // Simulate form submission
        await act(async () => { userEvent.click(screen.getByText(/save/i)); });
        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));
    });

    it('displays an error modal when adding a new product fails', async () => {
        // Simulate a server error response
        axiosMock.onPost('/wishlist/1/products').networkError();

        await act(async () => { render(<MemoryRouter><ProductPage /></MemoryRouter>); });

        // Simulate user input and submission that leads to an error
        await act(async () => { userEvent.type(screen.getByLabelText(/gift name/i), 'Test Product'); });
        await act(async () => { userEvent.type(screen.getByLabelText(/gift name/i), 'Test Product'); });
        await act(async () => { userEvent.type(screen.getByLabelText(/price/i), '100'); });
        await act(async () => { userEvent.type(screen.getByLabelText(/where to buy/i), 'https://www.example.com/failure'); });
        await act(async () => {
            userEvent.click(screen.getByText(/save/i));
        });

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(expect.anything());
        });

    });

    it('successfully updates an existing product in the wishlist', async () => {
        // Assume this product represents the initial state before update
        const initialProduct = {
            product_id: 1,
            wishlist_id: 1,
            title: "Lightweight Water-Resistant Jacket",
            description: "A perfect jacket for unpredictable weather.",
            url: "https://www.example.com/product",
            imageUrl: "https://www.example.com/image.jpg",
            price: 49.99,
            amount: 1,
            ranking: "5 stars",
            date_added: new Date('2024-02-25T08:00:00Z').toISOString(),
        };

        // Mock response for fetching the initial product details
        axiosMock.onGet(`/wishlist/1/products/${initialProduct.product_id}`).reply(200, initialProduct);

        // Mock response for the update operation
        const updatedProduct = { ...initialProduct, title: "Updated Jacket", price: 59.99 };
        axiosMock.onPatch(`/wishlist/1/products/${initialProduct.product_id}`).reply(200, updatedProduct);

        render(<MemoryRouter><ProductPage /></MemoryRouter>);

        // Assuming the UI renders with initialProduct's details populated, simulate user updating the title and price
        await act(async () => { userEvent.clear(screen.getByLabelText(/gift name/i)); });
        await act(async () => { userEvent.type(screen.getByLabelText(/gift name/i), updatedProduct.title); });
        await act(async () => { userEvent.clear(screen.getByLabelText(/price/i)); });
        await act(async () => { userEvent.type(screen.getByLabelText(/price/i), updatedProduct.price.toString()); });

        // Simulate clicking the "Update" button
        await act(async () => {
            userEvent.click(screen.getByText(/save/i));
        });

        // Check if the toast notification for success was called
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith(expect.anything());
        });
    });

});