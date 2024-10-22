import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap";

const UserDetail = ({ userId, orderId, show, handleClose }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchUserAndProducts = async () => {
      if (userId) {
        // Fetch user information (you need to replace this with your actual API)
        const userResponse = await fetch(`http://localhost:9999/users/${userId}`);
        const userData = await userResponse.json();
        setUser(userData);
      }

      // Fetch products in the order
      if (orderId) {
        const orderResponse = await fetch(`http://localhost:9999/orders/${orderId}`);
        const orderData = await orderResponse.json();
        setProducts(orderData.products);
      }
    };

    fetchUserAndProducts();
  }, [userId, orderId]);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>User Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user ? (
          <div>
            <h5>User Information</h5>
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
            <h5>Products in Order</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.title}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <p>Loading user details...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UserDetail;
