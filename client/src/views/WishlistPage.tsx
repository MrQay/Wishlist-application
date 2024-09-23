// React imports
import React, { useState, useEffect, FormEvent } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
// Bootstrap components and CSS
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Card,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlusSquare,
  faEdit,
  faTrashAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";

// Service imports
import {
  createWishlist,
  getWishlistsForUser,
  deleteWishlist,
  updateWishlist,
} from "../services/wishlistService";
import {
  getProductsFromWishlist,
  deleteAllProductsFromWishlist,
} from "../services/productService";

// Model imports
import { Wishlist } from "../../../server/src/model/wishlist.model";
import { Product } from "../../../server/src/model/product.model";

// Component and CSS imports
import ProductItem from "../components/ProductItem";
import "../css/Wishlist.css";

const WishlistPage: React.FC = () => {
  // State management
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [selectedWishlist, setSelectedWishlist] = useState<Wishlist | null>(
    null
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // Modal handlers
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowEditModal = () => {
    setEditTitle(selectedWishlist?.title || "");
    setEditDescription(selectedWishlist?.description || "");
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => setShowEditModal(false);

  // Wishlist operations
  const handleCreateWishlist = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const newWishlist = await createWishlist({
        title,
        description,
      });
      setWishlists((prevWishlists) => [...prevWishlists, newWishlist]);
      setTitle("");
      setDescription("");
      toast.success("Wishlist created successfully.");
      handleCloseModal();
    } catch (error) {
      toast.error("Error creating wishlist.");
      console.error("Error creating wishlist:", error);
    }
  };

  const handleUpdateWishlist = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedWishlist) {
      try {
        const updatedData = { title: editTitle, description: editDescription };
        await updateWishlist(selectedWishlist.wishlist_id, updatedData);

        // Update the wishlists state to reflect the change
        const updatedWishlists = wishlists.map((wishlist) => {
          if (wishlist.wishlist_id === selectedWishlist.wishlist_id) {
            return { ...wishlist, ...updatedData };
          }
          return wishlist;
        });

        setWishlists(updatedWishlists);
        setSelectedWishlist((prev) =>
          prev ? { ...prev, ...updatedData } : null
        );

        toast.success("Wishlist updated.");
        handleCloseEditModal();
      } catch (error) {
        toast.error("Error updating wishlist.");
        console.error("Error updating wishlist:", error);
      }
    }
  };

  const handleDeleteWishlist = async (wishlistId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this wishlist?"
    );

    if (confirmed) {
      try {
        await deleteAllProductsFromWishlist(wishlistId);
        await deleteWishlist(wishlistId);
        // Remove the deleted wishlist from the state
        const updatedWishlists = wishlists.filter(
          (wishlist) => wishlist.wishlist_id !== wishlistId
        );
        setWishlists(updatedWishlists);
        setSelectedWishlist(null);
        toast.success("Deleted wishlist.");
      } catch (error) {
        toast.error("Error deleting wishlist.");
        console.error("Error deleting wishlist:", error);
      }
    }
  };

  const handleSelectWishlist = async (wishlist: Wishlist) => {
    setSelectedWishlist(wishlist);
    try {
      const response = await getProductsFromWishlist(wishlist.wishlist_id);
      setProducts(response.data);
    } catch (error) {
      if (Cookies.get("authToken"))
        toast.error("Failed to fetch products in wishlist.");
    }
  };

  // Product operations
  const handleProductDelete = (productId: number) => {
    // Filter out the deleted product and update state
    setProducts(products.filter((product) => product.product_id !== productId));
  };

  const handleProductEdit = (productId: number) => {
    // Filter out the edited product and update state
    setProducts(products.filter((product) => product.product_id !== productId));
  };

  // Initial data fetch
  useEffect(() => {
    const fetchWishlists = async () => {
      try {
        const fetchedWishlists = await getWishlistsForUser();
        setWishlists(fetchedWishlists);
        // Check if there are any wishlists and select the first one by default
        if (fetchedWishlists.length > 0) {
          setSelectedWishlist(fetchedWishlists[0]);
          // Optionally, fetch products for the first wishlist
          const response = await getProductsFromWishlist(
            fetchedWishlists[0].wishlist_id
          );
          setProducts(response.data);
        }
      } catch (error) {
        if (Cookies.get("authToken")) toast.error("Failed to fetch wishlists.");
      }
    };

    fetchWishlists();
  }, []);

  return (
    <Container fluid className="wishlist-form-container">
      {/* Sidebar and Wishlist Details */}

      {Cookies.get("authToken") ? (
        <Row>
          {/* Sidebar for listing wishlists */}
          <Col sm={4} md={3} lg={2} className="sidebar">
            <Button
              variant="outline-dark"
              className="mb-3"
              onClick={handleShowModal}
            >
              <FontAwesomeIcon icon={faPlusSquare} /> New Wishlist
            </Button>
            {wishlists.length > 0 ? (
              wishlists.map((list) => (
                <Card
                  key={list.wishlist_id}
                  className={`mb-2 ${
                    selectedWishlist?.wishlist_id === list.wishlist_id
                      ? "wishlist-selected"
                      : ""
                  }`}
                  onClick={() => handleSelectWishlist(list)}
                >
                  <Card.Body>
                    <Card.Title style={{ cursor: "pointer" }}>
                      {selectedWishlist?.wishlist_id === list.wishlist_id && (
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="me-2"
                          style={{ color: "#3b5d50" }}
                        />
                      )}
                      {list.title}
                    </Card.Title>
                    <div
                      className="wishlist-card-actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline-primary"
                        size="sm"
                        aria-label="Edit wishlist"
                        onClick={() => {
                          handleShowEditModal();
                          setSelectedWishlist(list);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        className="ms-2"
                        aria-label="Delete wishlist"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteWishlist(list.wishlist_id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))
            ) : (
              <div className="empty-wishlist-container">
                <h3>No Wishlists Found</h3>
                <p>Create your first wishlist to get started.</p>
              </div>
            )}
          </Col>

          {/* Main content area for wishlist details and product listing */}
          <Col sm={8} md={9} lg={10} className="wishlist-details">
            {selectedWishlist ? (
              <>
                <div className="wishlist-content-header mb-4">
                  <div className="wishlist-header-overlay">
                    <h2 className="wishlist-title">{selectedWishlist.title}</h2>
                    <p className="wishlist-description">
                      {selectedWishlist.description}
                    </p>
                  </div>
                </div>
                {products.length === 0 ? (
                  <div className="empty-products-message text-center">
                    <Link
                      to={`/product/${selectedWishlist.wishlist_id}`}
                      className="btn btn-primary mb-3"
                    >
                      + Add Item
                    </Link>
                    <p className="mb-2">Your wishlist is currently empty.</p>
                    <p>Click "+ Add Item" to start filling your wishlist.</p>
                  </div>
                ) : (
                  <div className="product-list">
                    {products.map((product) => (
                      <ProductItem
                        key={product.product_id}
                        product={product}
                        onDelete={() => handleProductDelete(product.product_id)}
                        onEdit={() => handleProductEdit(product.product_id)}
                      />
                    ))}
                    <div className="text-center mt-4">
                      <Link to={`/product/${selectedWishlist?.wishlist_id}`}>
                        <Button variant="primary">+ Add More Items</Button>
                      </Link>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center mt-4">
                <p>Select a wishlist to view its details here.</p>
              </div>
            )}
          </Col>
        </Row>
      ) : (
        <Row>
          <a className="btn btn-warning btn-lg btn-block" href="/auth">
            Click here to login, so you can create a wishlist.
          </a>
        </Row>
      )}

      {/* Modals for creating and editing wishlists */}
      {/* Create Wishlist Modal */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Wishlist</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleCreateWishlist}>
          <Modal.Body>
            <Form.Group controlId="wishlistTitle">
              <Form.Label>Wishlist Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="wishlistDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Create Wishlist
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Edit Wishlist Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Wishlist</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleUpdateWishlist}>
          <Modal.Body>
            <Form.Group controlId="editWishlistTitle">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="editWishlistDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseEditModal}>
              Close
            </Button>
            <Button type="submit" variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default WishlistPage;
