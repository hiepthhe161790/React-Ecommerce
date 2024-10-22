import React, { useState, useEffect } from "react";
import { Footer, Navbar } from "../components";
import { Container, Row, Col, Card, Table, Button, Pagination, Modal } from "react-bootstrap";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(3);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]); // State to hold products

  useEffect(() => {
    const savedUser = JSON.parse(sessionStorage.getItem("user"));
    if (savedUser) {
      setUserId(savedUser.id || "");
    }
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("http://localhost:9999/products");
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  // Fetch orders based on userId
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          userId
            ? `http://localhost:9999/order?userId=${userId}`
            : `http://localhost:9999/order?userId=null`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [userId]);

  // Filter orders for the logged-in user
  const filteredOrders = orders.filter(order => order.userId === userId);

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleModalOpen = (order) => {
    setSelectedOrder(order);
    console.log(order);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedOrder(null);
  };

  const ShowOrders = () => (
    <Row className="my-4">
      <Col md={12}>
        <h3 className="mb-4">Your Orders</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Products Count</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>${order.total.toFixed(2)}</td>
                <td>
                  {order.status === 0 ? 'Pending' :
                    order.status === 1 ? 'Completed' :
                      order.status === 2 ? 'Cancelled' :
                        'Unknown'}
                </td>

                <td>{order.products.length} items</td>
                <td>
                  <Button variant="info" onClick={() => handleModalOpen(order)}>
                    View Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Pagination className="justify-content-center mt-4">
          <Pagination.Prev
            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </Col>
    </Row>
  );

  const ProductDetailModal = () => (
    <Modal show={showModal} onHide={handleModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Order #{selectedOrder?.id} Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedOrder?.products.map(({ id, quantity }) => {
         const product = products.find(p => p.id === String(id));
          return product ? (
            <Card key={product.id} className="mb-3">
              <Card.Img variant="top" src={product.image} />
              <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>
                  <strong>Price:</strong> ${product.price.toFixed(2)} <br />
                  <strong>Quantity:</strong> {quantity} <br />
                  <strong>Description:</strong> {product.description} <br />
                </Card.Text>
              </Card.Body>
            </Card>
          ) : null; // If product not found, return null
        })}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );

  return (
    <>
      <Navbar />
      <Container className="my-3 py-3">
        <h1 className="text-center">My Orders</h1>
        <hr />
        <ShowOrders />
        <ProductDetailModal />
      </Container>
      <Footer />
    </>
  );
};

export default MyOrders;
