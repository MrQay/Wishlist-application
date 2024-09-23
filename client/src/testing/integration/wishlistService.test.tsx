import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import { axiosMock } from '../../setupTests';
import { MemoryRouter } from 'react-router-dom';
import WishlistPage from '../../views/WishlistPage';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

// Mock Cookies
jest.mock('react-hot-toast');
jest.mock('js-cookie');

describe('WishlistPage Integration Tests', () => {
  beforeEach(() => {
    // Reset the mock adapter before each test
    axiosMock.reset();

    // Mock successful authentication
    (Cookies.get as jest.Mock).mockImplementation((key: string) => {
      if (key === 'authToken') return 'fake-token';
      return null;
    });

    // Mocking getWishlistsForUser to return an empty array by default
    axiosMock.onGet('/wishlists').reply(200, []);

    // Clear all mocks
    jest.clearAllMocks();
  });

  it('fetches wishlists successfully', async () => {
    const wishlists = [
      { wishlist_id: 1, title: 'First Wishlist', description: 'This is the first wishlist.' },
      { wishlist_id: 2, title: 'Second Wishlist', description: 'This is the second wishlist.' },
    ];

    axiosMock.onGet('http://localhost:8080/wishlists').reply(200, wishlists);

    render(<MemoryRouter><WishlistPage /></MemoryRouter>);

    await waitFor(() => {
      wishlists.forEach(async (wishlist) => {
        const wishlistTitles = await screen.findAllByText(wishlist.title);
        expect(wishlistTitles.length).toBeGreaterThanOrEqual(1);
      });
    });
  });

  it('handles error when fetching wishlists fails', async () => {
    // Mock an error response for fetching wishlists
    axiosMock.onGet('http://localhost:8080/wishlists').networkError();

    // Render the component
    await act(async () => {
      render(<MemoryRouter><WishlistPage /></MemoryRouter>);
    });

    // Verify that an error message is displayed or logged
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Failed to fetch wishlists.");
    });
  });

  it('allows a user to create a new wishlist', async () => {
    const newWishlist = { user_id: 1, title: 'My New Wishlist', description: 'Description of my new wishlist.', };

    // Mock the POST request for creating a new wishlist
    axiosMock.onPost('/wishlists/wishlist').reply(201, newWishlist);

    await act(async () => { render(<MemoryRouter><WishlistPage /></MemoryRouter>); });

    // Open the modal for creating a new wishlist
    await act(async () => { userEvent.click(screen.getByText(/New Wishlist/i)); });
    // Type the wishlist title into the input field
    await act(async () => { userEvent.type(await screen.findByLabelText("Wishlist Title"), newWishlist.title); });
    // Type the wishlist description into the input field
    await act(async () => { userEvent.type(await screen.findByLabelText("Description"), newWishlist.description); });
    // Submit the form
    await act(async () => { userEvent.click(screen.getByText(/Create Wishlist/i)); });

    // Use findByText to wait for the new wishlist title to appear on the page
    await waitFor(() => { expect(screen.getByText(/My New Wishlist/i)).toBeInTheDocument(); });
  });


  it('displays an error when creating a new wishlist fails', async () => {
    // Simulate a server error response during wishlist creation
    axiosMock.onPost('/wishlists/wishlist').networkError();

    await act(async () => { render(<MemoryRouter><WishlistPage /></MemoryRouter>); });

    // Simulate clicking the button to create a new wishlist
    await act(async () => { userEvent.click(screen.getByText(/New Wishlist/i)); });
    // Type into the input fields
    await act(async () => {
      userEvent.type(await screen.findByLabelText("Wishlist Title"), 'Failed Wishlist');
      userEvent.type(await screen.findByLabelText("Description"), 'This should fail');
    });
    // Submit the form
    await act(async () => { userEvent.click(screen.getByText(/Create Wishlist/i)); });

    // Check for an error toast message
    await waitFor(() => { expect(toast.error).toHaveBeenCalledWith("Error creating wishlist."); });
  });

  it('allows a user to update an existing wishlist', async () => {
    // Initial state with a single wishlist
    const newWishlist = { wishlist_id: 1, user_id: 1, title: 'My New Wishlist', description: 'Description of my new wishlist.', };

    axiosMock.onGet('http://localhost:8080/wishlists/wishlists').reply(200, [newWishlist]);

    // Prepare the updated wishlist data
    const updatedWishlist = { title: 'Updated Wishlist', description: 'Updated description.', };

    // Mock the PATCH request for updating the wishlist
    axiosMock.onPatch(`http://localhost:8080/wishlists/wishlist/${newWishlist.wishlist_id}`).reply(200, {
      ...newWishlist,
      ...updatedWishlist,
    });

    await act(async () => { render(<MemoryRouter><WishlistPage /></MemoryRouter>); });

    // Simulate clicking the button to edit the wishlist
    await act(async () => {
      const editButton = await screen.findByRole('button', { name: /edit wishlist/i });
      userEvent.click(editButton);
    });
    // Find the input field for the title and update it
    await act(async () => { userEvent.type(await screen.findByLabelText("Title"), updatedWishlist.title); });
    // Submit the form by clicking the save changes button
    await act(async () => { userEvent.click(screen.getByRole('button', { name: /Save Changes/i })); });

    // Check for a success toast message
    await waitFor(() => { expect(toast.success).toHaveBeenCalledWith("Wishlist updated."); });
  });

  it('displays an error when updating an existing wishlist fails', async () => {
    // Initial state with a single wishlist
    const newWishlist = {
      wishlist_id: 1,
      user_id: 1,
      title: 'My New Wishlist',
      description: 'Description of my new wishlist.',
    };

    axiosMock.onGet('http://localhost:8080/wishlists/wishlists').reply(200, [newWishlist]);

    // Mock the PATCH request for updating the wishlist to fail
    axiosMock.onPatch(`http://localhost:8080/wishlists/wishlist/${newWishlist.wishlist_id}`).networkError();

    await act(async () => { render(<MemoryRouter><WishlistPage /></MemoryRouter>); });

    // Simulate clicking the button to edit the wishlist
    await act(async () => {
      const editButton = await screen.findByRole('button', { name: /edit wishlist/i });
      userEvent.click(editButton);
    });
    // Find the input field for the title and update it
    await act(async () => { userEvent.type(await screen.findByLabelText("Title"), 'Updated Wishlist'); });
    // Submit the form by clicking the save changes button
    await act(async () => { userEvent.click(screen.getByRole('button', { name: /Save Changes/i })); });

    // Check for an error toast message
    await waitFor(() => { expect(toast.error).toHaveBeenCalledWith("Error updating wishlist."); });
  });

  it('allows a user to delete an existing wishlist', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    // Initial state with a single wishlist
    const newWishlist = {
      wishlist_id: 1,
      user_id: 1,
      title: 'My New Wishlist',
      description: 'Description of my new wishlist.',
    };

    // Mock the GET request to return an existing wishlist
    axiosMock.onGet('http://localhost:8080/wishlists/wishlists').reply(200, [newWishlist]);

    // Mock the DELETE request for deleting the wishlist
    axiosMock.onDelete(`http://localhost:8080/wishlists/wishlist/${newWishlist.wishlist_id}`).reply(200);
    axiosMock.onDelete(`http://localhost:8080/wishlist/${newWishlist.wishlist_id}/products`).reply(200);

    await act(async () => { render(<MemoryRouter><WishlistPage /></MemoryRouter>); });

    // Simulate clicking the button to delete the wishlist
    await act(async () => {
      const deleteButton = await screen.findByRole('button', { name: /delete wishlist/i });
      userEvent.click(deleteButton);
    });

    // Check for a success toast message indicating the wishlist was deleted successfully
    await waitFor(() => expect(toast.success).toHaveBeenCalledWith("Deleted wishlist."));
  });

  it('displays an error when deleting a wishlist fails', async () => {
    jest.spyOn(window, 'confirm').mockReturnValue(true);

    // Initial state with a single wishlist
    const newWishlist = { wishlist_id: 1, user_id: 1, title: 'My New Wishlist', description: 'Description of my new wishlist.' };

    // Mock the GET request to return an existing wishlist
    axiosMock.onGet('http://localhost:8080/wishlists/wishlists').reply(200, [newWishlist]);

    // Mock the DELETE request for deleting the wishlist to fail
    axiosMock.onDelete(`http://localhost:8080/wishlists/wishlist/${newWishlist.wishlist_id}`).networkError();
    axiosMock.onDelete(`http://localhost:8080/wishlist/${newWishlist.wishlist_id}/products`).networkError();

    await act(async () => { render(<MemoryRouter><WishlistPage /></MemoryRouter>); });

    // Simulate clicking the button to delete the wishlist
    await act(async () => {
      const deleteButton = await screen.findByRole('button', { name: /delete wishlist/i });
      userEvent.click(deleteButton);
    });

    // Check for error message
    await waitFor(() => { expect(toast.error).toHaveBeenCalledWith("Error deleting wishlist."); });
  });

});
