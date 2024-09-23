import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import CustomNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./views/HomePage";
import ProductPage from "./views/ProductPage";
import WishlistPage from './views/WishlistPage';
import Auth from "./components/Auth";
import { Toaster } from "react-hot-toast";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./css/Main.css";

function App() {
  return (
    <Router>
      <CustomNavbar />
      <Toaster></Toaster>
      <Switch>
        <Route path="/" exact component={HomePage} />
        {/* Update Existing Product */}
        <Route path="/product/:wishlistId/:productId" exact component={ProductPage} />
        {/* Add New Product */}
        <Route path="/product/:wishlistId" exact component={ProductPage} />
        <Route path="/wishlist" exact component={WishlistPage} />
        <Route path="/auth" exact component={Auth} />
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
