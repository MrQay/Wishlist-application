import React from 'react';
import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import WishlistPage from '../../views/WishlistPage';
import * as wishlistService from '../../services/wishlistService';
import { deleteAllProductsFromWishlist } from '../../services/productService';
import { MemoryRouter } from 'react-router-dom';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

// Mocking external modules and services
jest.mock('../../services/wishlistService');
jest.mock('../../services/productService');
jest.mock('react-hot-toast');
jest.mock('js-cookie');

describe('WishlistPage Component Tests', () => {
    // Sample data to use across tests
    const mockWishlists = [
        { wishlist_id: 1, title: 'My First Wishlist', description: 'This is my first wishlist.' },
        { wishlist_id: 2, title: 'Holiday Gifts', description: 'Wishlist for holiday gifts.' },
    ];

    beforeEach(async () => {
        // Reset mocks and set up initial conditions
        jest.clearAllMocks();
        (Cookies.get as jest.Mock).mockImplementation((key) => key === 'authToken' ? 'fake-token' : null);
        (wishlistService.getWishlistsForUser as jest.Mock).mockResolvedValue(mockWishlists);
        (wishlistService.createWishlist as jest.Mock).mockResolvedValue({
            wishlist_id: 3, title: 'Birthday Gifts', description: 'Wishlist for birthday gifts.',
        });

        // Render the component before each test
        await act(async () => {
            render(<MemoryRouter><WishlistPage /></MemoryRouter>);
        });
    });

    it('renders and fetches wishlists', async () => {
        // Verifying that wishlist titles from the mock data are rendered
        await waitFor(() => {
            mockWishlists.forEach(async (wishlist) => {
                const wishlistTitles = await screen.findAllByText(wishlist.title);
                expect(wishlistTitles.length).toBeGreaterThanOrEqual(1);
            });
        });
    });

    it('handles error when fetching wishlists fails', async () => {
        // Mock an error response for fetching wishlists
        (wishlistService.getWishlistsForUser as jest.Mock).mockRejectedValue(new Error("Failed to fetch wishlists"));

        // Render the component
        await act(async () => {
            render(<MemoryRouter><WishlistPage /></MemoryRouter>);
        });

        // Verify that an error message is displayed or logged
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Failed to fetch wishlists.");
        });
    });

    it('creates a new wishlist', async () => {
        // Interact with UI to create a new wishlist
        await act(async () => {
            fireEvent.click(screen.getByText('New Wishlist'));
        });

        const titleInput = await screen.findByPlaceholderText('Enter title');
        const descriptionInput = await screen.findByPlaceholderText('Enter description');

        fireEvent.change(titleInput, { target: { value: 'Birthday Gifts' } });
        fireEvent.change(descriptionInput, { target: { value: 'Wishlist for birthday gifts.' } });

        fireEvent.click(screen.getByRole('button', { name: 'Create Wishlist' }));

        // Assert that the new wishlist is created and displayed
        await waitFor(() => {
            expect(screen.getByText('Birthday Gifts')).toBeInTheDocument();
        });

        expect(toast.success).toHaveBeenCalledWith('Wishlist created successfully.');
    });

    it('handles error when creating a new wishlist fails', async () => {
        (wishlistService.createWishlist as jest.Mock).mockRejectedValue(new Error("Failed to create wishlist"));
        // Simulating user action to open the modal for creating a new wishlist
        const newWishlistButton = screen.getAllByText('New Wishlist')[0];
        fireEvent.click(newWishlistButton);

        // Filling in the form and submiting it
        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText('Enter title'), { target: { value: 'Failing Wishlist' } });
            fireEvent.change(screen.getByPlaceholderText('Enter description'), { target: { value: 'This should fail.' } });
            const createButton = screen.getByRole('button', { name: 'Create Wishlist' });
            fireEvent.click(createButton);
        });

        // Asserting that an error toast message is shown to the user
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Error creating wishlist.");
        });
    });


    it('allows a user to update an existing wishlist', async () => {
        // Mocking the update wishlist response
        const updatedWishlist = {
            wishlist_id: 1, title: 'Updated Title', description: 'Updated Description'
        };
        (wishlistService.updateWishlist as jest.Mock).mockResolvedValue(updatedWishlist);

        // Opening the edit modal for the first wishlist
        const editButtons = await screen.findAllByLabelText('Edit wishlist');
        fireEvent.click(editButtons[0]);

        // Filling out and submitting the edit form
        const titleInput = await screen.findByLabelText('Title');
        const descriptionInput = await screen.findByLabelText('Description');
        fireEvent.change(titleInput, { target: { value: updatedWishlist.title } });
        fireEvent.change(descriptionInput, { target: { value: updatedWishlist.description } });
        fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

        // Verifying the update logic and user feedback
        await waitFor(() => {
            expect(wishlistService.updateWishlist).toHaveBeenCalledWith(updatedWishlist.wishlist_id, {
                title: updatedWishlist.title, description: updatedWishlist.description,
            });
            expect(toast.success).toHaveBeenCalledWith("Wishlist updated.");
        });
    });

    it('handles error when updating a wishlist fails', async () => {
        (wishlistService.updateWishlist as jest.Mock).mockRejectedValue(new Error("Failed to update wishlist"));

        // Opening the edit modal for the first wishlist
        const editButtons = await screen.findAllByLabelText('Edit wishlist');
        fireEvent.click(editButtons[0]);

        // Attempt to update a wishlist
        await act(async () => {
            const titleInput = await screen.findByLabelText('Title');
            const descriptionInput = await screen.findByLabelText('Description');
            fireEvent.change(titleInput, { target: { value: 'Update Fail' } });
            fireEvent.change(descriptionInput, { target: { value: 'This update should fail.' } });
            fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
        });

        // Verify that an error toast is displayed
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Error updating wishlist.");
        });
    });


    it('deletes a wishlist', async () => {
        // Setup to simulate user confirmation for deletion
        window.confirm = jest.fn().mockReturnValue(true);
        (wishlistService.deleteWishlist as jest.Mock).mockResolvedValue({});
        (deleteAllProductsFromWishlist as jest.Mock).mockResolvedValue({});

        // Deleting the first wishlist
        const deleteButtons = screen.getAllByLabelText('Delete wishlist');
        if (deleteButtons.length > 0) {
            await act(async () => {
                fireEvent.click(deleteButtons[0]);
            });
        }

        // Asserting the deletion logic and feedback
        await waitFor(() => {
            expect(wishlistService.deleteWishlist).toHaveBeenCalledWith(mockWishlists[0].wishlist_id);
            expect(toast.success).toHaveBeenCalledWith("Deleted wishlist.");
        });
    });

    it('handles error when deleting a wishlist fails', async () => {
        // Mock a failure for deleting a wishlist
        window.confirm = jest.fn().mockReturnValue(true); // User confirms deletion
        (wishlistService.deleteWishlist as jest.Mock).mockRejectedValue(new Error("Failed to delete wishlist"));
        (deleteAllProductsFromWishlist as jest.Mock).mockResolvedValue({});

        // Attempt to delete a wishlist
        await act(async () => {
            render(<MemoryRouter><WishlistPage /></MemoryRouter>);
            const deleteButtons = screen.getAllByLabelText('Delete wishlist');
            if (deleteButtons.length > 0) {
                fireEvent.click(deleteButtons[0]);
            }
        });

        // Verify that an error toast is displayed
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith("Error deleting wishlist.");
        });
    });
});
