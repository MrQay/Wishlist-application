// React imports
import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

// FontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListUl,
  faShareAlt,
  faLock,
  faGifts,
} from "@fortawesome/free-solid-svg-icons";

// Asset imports
import mainImage from "../images/main.png";
import birthdayWishlistImage from "../images/birthday-wishlist.png";
import weddingWishlistImage from "../images/wedding-wishlist.png";
import specialOccasionsWishlistImage from "../images/special-occasions-wishlist.png";
import whyChooseUsImage from "../images/why-choose-us-img.png";

/**
 * HomePage component displays the main landing page content,
 * including the hero section, product section, and the 'Why Choose Us' section.
 */
const HomePage: React.FC = () => {
  // Function to handle potential errors (for future expansion)
  const handleError = (message: string) => {
    toast.error(message);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-5">
              <div className="intro-excerpt">
                <h1>
                  Find the Perfect Gift Every Time{" "}
                  <span className="d-block">with Gift Genie</span>
                </h1>
                <p className="mb-4">
                  Discover unique gift ideas and manage your own wish lists for
                  every special occasion.
                </p>
                <p>
                  <Link to="/wishlist" className="btn btn-secondary me-2">
                    Make a Wish List
                  </Link>
                </p>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="hero-img-wrap">
                <img src={mainImage} alt="Main" className="img-fluid" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="product-section">
        <div className="container">
          <div className="row">
            {/* Intro Column */}
            <div className="col-md-12 col-lg-3 mb-5 mb-lg-0">
              <h2 className="mb-4 section-title">
                Create Your Perfect Wish List
              </h2>
              <p className="mb-4">
                Whether it's for a birthday, wedding, or just because, create a
                wish list that reflects your unique preferences and needs.
              </p>
              <p>
                <Link to="/wishlist" className="btn">
                  Start a Wish List
                </Link>
              </p>
            </div>
            {/* Wish List Categories */}
            <div className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
              <Link className="product-item" to="/">
                <img
                  src={birthdayWishlistImage}
                  alt="Birthday Wishes"
                  className="img-fluid product-thumbnail"
                />
                <h3 className="product-title">Birthday Wishes</h3>
                <strong className="product-price">Celebrate in Style</strong>
              </Link>
            </div>
            <div className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
              <Link className="product-item" to="/">
                <img
                  src={weddingWishlistImage}
                  alt="Wedding Registry"
                  className="img-fluid product-thumbnail"
                />
                <h3 className="product-title">Wedding Registry</h3>
                <strong className="product-price">Dream Gifts</strong>
              </Link>
            </div>
            <div className="col-12 col-md-4 col-lg-3 mb-5 mb-md-0">
              <Link className="product-item" to="/">
                <img
                  src={specialOccasionsWishlistImage}
                  alt="Special Occasions"
                  className="img-fluid product-thumbnail"
                />
                <h3 className="product-title">Special Occasions</h3>
                <strong className="product-price">Unique Moments</strong>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="why-choose-section">
        <div className="container">
          <div className="row justify-content-between">
            <div className="col-lg-6">
              <h2 className="section-title">Why Choose Us</h2>
              <p>
                Gift Genie offers a seamless experience for creating and sharing
                wish lists for all your special occasions.
              </p>
              <div className="row my-5">
                  <div className="col-6 col-md-6 pt-3">
                    <div className="feature">
                      <div className="icon">
                        <FontAwesomeIcon icon={faListUl} size="3x" />
                      </div>
                      <h3>Personalized Lists</h3>
                      <p>
                        Create wish lists that truly reflect your personality
                        and preferences, tailored for any event or occasion.
                      </p>
                    </div>
                  </div>
                <div className="col-6 col-md-6 pt-3">
                  <div className="feature">
                    <div className="icon">
                      <FontAwesomeIcon icon={faShareAlt} size="3x" />
                    </div>
                    <h3>Easy Sharing</h3>
                    <p>
                      Share your lists effortlessly with friends and family to
                      ensure you receive the gifts you truly desire.
                    </p>
                  </div>
                </div>
                <div className="col-6 col-md-6 pt-3">
                  <div className="feature">
                    <div className="icon">
                      <FontAwesomeIcon icon={faLock} size="3x" />
                    </div>
                    <h3>Privacy & Security</h3>
                    <p>
                      Your wish lists are private and secure. You have full
                      control over who can view or edit them.
                    </p>
                  </div>
                </div>
                <div className="col-6 col-md-6 pt-3">
                  <div className="feature">
                    <div className="icon">
                      <FontAwesomeIcon icon={faGifts} size="3x" />
                    </div>
                    <h3>Vast Selection</h3>
                    <p>
                      Add items from any store to your wish list, giving you and
                      your loved ones an endless variety of choices.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="img-wrap">
                <img
                  src={whyChooseUsImage}
                  alt="Why Choose Us"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
