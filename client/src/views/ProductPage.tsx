// React and Router imports
import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import toast from "react-hot-toast";

// Bootstrap and FontAwesome imports
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faGift, faDollarSign, faShoppingCart, faAlignLeft, faStar, faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";

// CSS imports
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/Product.css";

// Service and Model imports
import { fetchProductDetailsFromAxesso, addProductToWishlist, updateProductInWishlist, getProductsFromWishlist } from "../services/productService";
import { Product } from "../../../server/src/model/product.model";

const ProductPage: React.FC = () => {
  const history = useHistory();
  const { wishlistId: wishlistIdString, productId: productIdString } = useParams<{ wishlistId: string; productId: string }>();
  const wishlistId = parseInt(wishlistIdString, 10), productId = productIdString ? parseInt(productIdString, 10) : null;

  // State to hold product form fields
  const initialProductState = {
    webLink: "",
    itemName: "",
    rating: 0,
    price: 0.0,
    quantity: 1,
    whereToBuy: "",
    description: "",
    imageUrl: "",
  };

  // State for managing product data, error modal visibility and error message
  const [product, setProduct] = useState(initialProductState);
  const [isEditMode, setIsEditMode] = useState(false);

  // Event handlers
  // Function to handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Map state to Product model expected by the server
    const productData = {
      wishlist_id: wishlistId,
      title: product.itemName,
      description: product.description,
      url: product.webLink,
      imageUrl: product.imageUrl,
      price: product.price,
      amount: product.quantity,
      ranking: `${product.rating} star(s)`,
    };

    // Function to add or update the product based on its existence
    const addOrUpdateProduct = async () => {
      try {
        // Update existing product or add a new one
        if (isEditMode && productId) {
          await updateProductInWishlist(wishlistId, productId, productData);
        } else {
          const newProductData = {
            ...productData,
            date_added: new Date(),
          };
          await addProductToWishlist(wishlistId, newProductData);
        }

        setProduct(initialProductState);
        history.push("/wishlist");
      } catch (error: any) {
        console.error("Error adding or updating product in wishlist", error);
        const errorMsg = error.response?.data?.message || "Error adding or updating product in wishlist";
        toast.error(errorMsg)
      }
    };

    // Validate required fields before proceeding
    if (!product.itemName || !product.price || !product.whereToBuy) {
      toast.error("Please make sure all required fields are filled.")
      return;
    }

    addOrUpdateProduct();
  };

  // Function to handle input changes and update state
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: name === "price" || name === "quantity" ? parseFloat(value) : value });
  };

  // Function to reset form and state
  const handleCancel = () => {
    setProduct(initialProductState);
  };


  useEffect(() => {
    if (productId) {
      setIsEditMode(true);
      // Fetch existing product details using the productId and set form state
      const fetchExistingProductDetails = async () => {
        try {
          const response = await getProductsFromWishlist(wishlistId);
          const existingProduct = response.data.find((p: Product) => p.product_id === productId);
          if (existingProduct) {
            // Update form state with the existing product details
            setProduct({
              ...initialProductState,
              itemName: existingProduct.title,
              description: existingProduct.description,
              webLink: existingProduct.url,
              imageUrl: existingProduct.imageUrl,
              price: existingProduct.price,
              quantity: existingProduct.amount,
              rating: parseFloat(existingProduct.ranking.replace(/[^0-9.]+/g, "")),
              whereToBuy: existingProduct.url,
            });
          }
        } catch (error: any) {
          console.error("Error fetching product details", error);
          const errorMsg = error.response?.data?.message || "Error fetching product details";
          toast.error(errorMsg)
        }
      };

      fetchExistingProductDetails();
    }
    // Ignore warning since If initialProductState is not changing, you do not need to include it in the dependencies array
    // eslint-disable-next-line
  }, [productId, wishlistId]);

  // Function to fetch product details from an external API and update the form
  const fetchDetails = async () => {
    // Check if the product link is empty
    if (!product.webLink) {
      toast.error("Product link cannot be empty.")
      return;
    }

    try {
      const response = await fetchProductDetailsFromAxesso(product.webLink);
      const fetchedProductDetails = response.data;
      setProduct((prevProduct) => ({
        ...prevProduct,
        itemName: fetchedProductDetails.productTitle,
        rating: parseFloat(fetchedProductDetails.productRating),
        price: fetchedProductDetails.price,
        whereToBuy: product.webLink,
        description: fetchedProductDetails.productDescription,
        imageUrl: fetchedProductDetails.imageUrlList.length > 0 ? fetchedProductDetails.imageUrlList[0] : null,
      }));
    } catch (error: any) {
      console.error("Error fetching product details", error);
      const errorMsg = error.response?.data?.message || "Error fetching product details";
      toast.error(errorMsg)
    }
  };

  // Function to render rating stars based on the product rating
  const renderStars = () => {
    const fullStars = Math.floor(product.rating);
    const hasHalfStar = product.rating - fullStars >= 0.5;
    let stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`star-full-${i}`}
          icon={faStar}
          style={{ color: "gold" }}
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon
          key="star-half"
          icon={faStarHalfAlt}
          style={{ color: "gold" }}
        />
      );
    }

    // Fill remaining stars with empty ones if rating is less than 5
    while (stars.length < 5) {
      stars.push(
        <FontAwesomeIcon
          key={`star-empty-${stars.length}`}
          icon={faStar}
          style={{ color: "#e4e5e9" }}
        />
      );
    }

    return stars;
  };

  // Main form render function
  return (
    <>
      <div className="product-form-container">
        <form id="productForm" onSubmit={handleSubmit}>
          {/* Form header */}
          <h2 className="form-header">Add Your Item</h2>

          {/* Web link input */}
          <Row>
            <Col md={12}>
              <div className="form-group">
                <label htmlFor="webLink" className="form-label">
                  Web link
                </label>
                <div className="input-group">
                  <FontAwesomeIcon icon={faLink} className="fa-icon" />
                  <input
                    type="text"
                    className="form-control"
                    id="webLink"
                    name="webLink"
                    placeholder="Paste link to auto-fill item image & more!"
                    onChange={handleChange}
                    value={product.webLink}
                  />
                  <button
                    className="btn fetch-button"
                    type="button"
                    onClick={fetchDetails}
                  >
                    Fetch
                  </button>
                </div>
              </div>
            </Col>
          </Row>

          {/* Product name input */}
          <Row>
            <Col md={12}>
              <div className="form-group">
                <label htmlFor="itemName" className="form-label">
                  Gift name*
                </label>
                <FontAwesomeIcon icon={faGift} className="fa-icon" />
                <input
                  type="text"
                  className="form-control"
                  id="itemName"
                  name="itemName"
                  placeholder="Add your item name here..."
                  required
                  onChange={handleChange}
                  value={product.itemName}
                />
              </div>
            </Col>
          </Row>

          {/* Product rating display */}
          <Row>
            <Col md={12}>
              <div className="form-group">
                <label className="form-label">Rating</label>
                <div className="star-rating">{renderStars()}</div>
              </div>
            </Col>
          </Row>

          {/* Price and quantity inputs */}
          <Row>
            <Col md={6}>
              <div className="form-group">
                <label htmlFor="price" className="form-label">
                  Price*
                </label>
                <FontAwesomeIcon icon={faDollarSign} className="fa-icon" />
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  name="price"
                  required
                  onChange={handleChange}
                  value={product.price}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="form-group">
                <label htmlFor="quantity" className="form-label">
                  How many?
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  name="quantity"
                  onChange={handleChange}
                  value={product.quantity}
                />
              </div>
            </Col>
          </Row>

          {/* Where to buy input */}
          <Row>
            <Col md={12}>
              <div className="form-group">
                <label htmlFor="whereToBuy" className="form-label">
                  Where to buy*
                </label>
                <FontAwesomeIcon icon={faShoppingCart} className="fa-icon" />
                <input
                  type="text"
                  className="form-control"
                  id="whereToBuy"
                  name="whereToBuy"
                  required
                  onChange={handleChange}
                  value={product.whereToBuy}
                />
              </div>
            </Col>
          </Row>

          {/* Product description input */}
          <Row>
            <Col md={12}>
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <FontAwesomeIcon icon={faAlignLeft} className="fa-icon" />
                <textarea
                  className="form-control desc"
                  id="description"
                  name="description"
                  onChange={handleChange}
                  value={product.description}
                />
              </div>
            </Col>
          </Row>

          {/* Product image display */}
          <Row>
            <Col md={12}>
              {product.imageUrl && (
                <div className="form-group">
                  <label className="form-label">Product Image</label>
                  <img
                    src={product.imageUrl}
                    alt="Product"
                    className="product-image"
                  />
                </div>
              )}
            </Col>
          </Row>

          {/* Form submission buttons */}
          <Row>
            <Col md={12}>
              <div className="button-group">
                <button type="submit" className="btn save-button">
                  Save
                </button>
                <button
                  type="button"
                  className="btn cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </Col>
          </Row>
        </form>
      </div>
    </>
  );
};

export default ProductPage;
