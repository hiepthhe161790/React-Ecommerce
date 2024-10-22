import React, { useState, useEffect } from "react";
import { Table, Col, Row, Card, Button, Modal, Form, Pagination, Container } from "react-bootstrap";
import SideBar from "./SideBar";
import { FaEye } from 'react-icons/fa';
const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false); // New state for product details modal
  const [isEditing, setIsEditing] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [users, setUsers] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchOrders = async () => {
    const response = await fetch("http://localhost:9999/order");
    const data = await response.json();
    setOrders(data);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("http://localhost:9999/products");
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch(`http://localhost:9999/user`);
    const data = await response.json();
    const userMap = data.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {});
    setUsers(userMap);
  };

  const fetchUserById = async (userId) => {
    const response = await fetch(`http://localhost:9999/user?id=${userId}`);
    const data = await response.json();
    return Array.isArray(data) && data.length > 0 ? data[0] : null;
  };

  const handleShow = async (order = null) => {
    setIsEditing(!!order);
    setCurrentOrder(order);
    if (order) {
      const user = await fetchUserById(order.userId);
      setCurrentUser(user);
    }
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentOrder(null);
    setCurrentUser(null);
    setShowProductModal(false); // Close product modal when closing main modal
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const orderData = {
      id: currentOrder?.id || Date.now().toString(),
      userId: formData.get("userId"),
      guestInfo: {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        address: formData.get("address"),
      },
      products: JSON.parse(formData.get("products")),
      total: parseFloat(formData.get("total")),
      status: parseInt(formData.get("status")),
    };

    if (isEditing) {
      await fetch(`http://localhost:9999/order/${currentOrder.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
    } else {
      await fetch("http://localhost:9999/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
    }

    fetchOrders();
    handleClose();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:9999/order/${id}`, {
      method: "DELETE",
    });
    fetchOrders();
  };

  const handleModalOpen = (order) => {
    setSelectedOrder(order);
    setShowProductModal(true); // Show product details modal
  };

  // Pagination Logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);
  console.log("selectedOrder", selectedOrder);
  return (
    <>

      <Container fluid>
        <Row>
          <SideBar />
          <Col md={10} style={{ margin: "20px auto" }}>
            <h1 className="text-center">Order Manager</h1>
            <Button variant="primary" onClick={() => handleShow()}>
              Add Order
            </Button>

            <Table striped bordered hover className="my-4">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User Name</th>
                  <th>Products Count</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{users[order.userId]?.firstName} {users[order.userId]?.lastName || "Guest"}</td>
                    <td>
                      {order.products.length} items &nbsp;
                      <Button variant="info" onClick={() => handleModalOpen(order)}>
                        <FaEye /> 
                      </Button>
                    </td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>
                      {order.status === 0 ? 'Pending' :
                        order.status === 1 ? 'Completed' :
                          order.status === 2 ? 'Cancelled' :
                            'Unknown'}
                    </td>

                    <td>

                      <Button variant="info" onClick={() => handleShow(order)}>
                        Edit
                      </Button>
                      <Button variant="danger" onClick={() => handleDelete(order.id)}>
                        Delete
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

            <Modal show={showModal} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{isEditing ? "Edit Order" : "Add Order"}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form onSubmit={handleSave}>
                  <Form.Group controlId="firstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      defaultValue={currentUser?.firstName || currentOrder?.guestInfo?.firstName || ""}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="lastName">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      defaultValue={currentUser?.lastName || currentOrder?.guestInfo?.lastName || ""}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="phone">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      defaultValue={currentUser?.phone || currentOrder?.guestInfo?.phone || ""}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      defaultValue={currentUser?.email || currentOrder?.guestInfo?.email || ""}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="address">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      defaultValue={currentUser?.address || currentOrder?.guestInfo?.address || ""}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="products">
                    {/* <Form.Label>Products (JSON Array)</Form.Label>
              <Form.Control
                type="text"
                name="products"
                defaultValue={JSON.stringify(currentOrder?.products || [])}
                required
              /> */}
                  </Form.Group>
                  <Form.Group controlId="total">
                    <Form.Label>Total</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="total"
                      defaultValue={currentOrder?.total || ""}
                      required
                    />
                  </Form.Group>
                  <Form.Group controlId="status">
                    <Form.Label>Status</Form.Label>
                    <Form.Control
                      as="select"
                      name="status"
                      defaultValue={currentOrder?.status || 0}
                    >
                      <option value={0}>Pending</option>
                      <option value={1}>Completed</option>
                      <option value={2}>Cancelled</option>
                    </Form.Control>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Save
                  </Button>
                </Form>
              </Modal.Body>
            </Modal>

            {/* Product Details Modal */}
            <Modal show={showProductModal} onHide={() => setShowProductModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Product Details</Modal.Title>
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
                <Button variant="secondary" onClick={() => setShowProductModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default OrderManager;
