import React from 'react';
import ReactDOM from 'react-dom/client';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store';


import { Home, Product, Products, AboutPage, ContactPage, Cart, Login, Register, Checkout, PageNotFound,Logout,Profile,DashBoard,EditProduct,CreateProduct,MyOrders,OrderManager,UserManager } from "./pages"
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Products />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/product/*" element={<PageNotFound />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/profile" element={<Profile />}  />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/createproduct" element={<CreateProduct />} />
        <Route path="/EditProduct/:ProductID" element={<EditProduct />} />
        <Route path="/myorders" element={<MyOrders />} />
        <Route path="/adminorders" element={<OrderManager />} />
        <Route path="/adminusers" element={<UserManager />} />
      </Routes>
    </Provider>
  </BrowserRouter>
  
);