// React imports
import React from "react";
import toast from "react-hot-toast";

// FontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faStarHalfAlt,
  faShoppingCart,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

// Model and service imports
import { Product } from "../../../server/src/model/product.model";
import { deleteProductFromWishlist } from "../services/productService";

// TypeScript type for component props
interface ProductItemProps {
  product: Product;
  onDelete: () => void;
  onEdit: () => void;
}

// Component definition
const ProductItem: React.FC<ProductItemProps> = ({
  product,
  onDelete,
  onEdit,
}) => {
  // Parses the product ranking to a float for accurate star ratings
  const ratingValue = parseFloat(product.ranking.split(" ")[0]);

  // Handles the deletion of a product with confirmation and error handling
  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirmed) {
      try {
        await deleteProductFromWishlist(
          product.wishlist_id,
          product.product_id
        );
        toast.success("Product Deleted successfully.");
        onDelete(); // Callback to parent component to handle deletion
      } catch (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete the product.");
      }
    }
  };

  // Triggers the edit functionality and navigates to the product edit page
  const handleEdit = () => {
    onEdit(); // Callback to parent component to handle edit
    window.location.href = `/product/${product.wishlist_id}/${product.product_id}`;
  };

  // Generates star ratings based on the product's ranking
  const renderStars = () => {
    let stars = [];
    for (let i = 0; i < Math.floor(ratingValue); i++) {
      stars.push(
        <FontAwesomeIcon
          key={`star-full-${i}`}
          icon={faStar}
          size="sm"
          color="gold"
        />
      );
    }
    if (ratingValue % 1 !== 0) {
      stars.push(
        <FontAwesomeIcon
          key="star-half"
          icon={faStarHalfAlt}
          size="sm"
          color="gold"
        />
      );
    }
    while (stars.length < 5) {
      stars.push(
        <FontAwesomeIcon
          key={`star-empty-${stars.length}`}
          icon={faStar}
          size="sm"
          color="#e4e5e9"
        />
      );
    }
    return stars;
  };

  return (
    <div className="product-row">
      <div className="product-rating">{renderStars()}</div>
      <div className="product-image">
        <img
          src={product.imageUrl}
          alt={product.title}
          style={{ width: "100px" }}
        />
      </div>
      <div className="product-info">
        <h6
          className="product-title"
          onClick={() =>
            (window.location.href = `/product/${product.wishlist_id}/${product.product_id}`)
          }
        >
          {product.title.length > 50
            ? `${product.title.substring(0, 90)}...`
            : product.title}
        </h6>
        <button
          onClick={() => window.open(product.url, "_blank")}
          className="product-website-button"
        >
          <span style={{ fontSize: "16px", paddingRight: "10px" }}>
            <FontAwesomeIcon icon={faShoppingCart} />
            Website
          </span>
        </button>
      </div>
      <div className="product-price">${product.price}</div>
      <div className="product-quantity">Qty: {product.amount}</div>
      <div className="product-actions">
        <button onClick={handleEdit} className="product-edit-button">
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button onClick={handleDelete} className="product-delete-button">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  );
};

export default ProductItem;
