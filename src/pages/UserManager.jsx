import React, { useState, useEffect } from "react";
import { Table,Col,Row, Button, Modal, Form, Container, Pagination } from "react-bootstrap";
import SideBar from "./SideBar";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch(`http://localhost:9999/user`);
      const data = await response.json();
      setUsers(data);
    };
    fetchUsers();
  }, []);

  const handleShow = (user = null) => {
    setIsEditing(!!user);
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentUser(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = {
      id: currentUser?.id || Date.now().toString(),
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      address: formData.get("address"),
      email: formData.get("email"),
      dateOfBirth: formData.get("dateOfBirth"),
      account: formData.get("account"),
      roll: parseInt(formData.get("roll")),
      password: formData.get("password"),
    };

    if (isEditing) {
      
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === currentUser.id ? userData : user))
      );
    } else {
     
      setUsers((prevUsers) => [...prevUsers, userData]);
    }

    handleClose();
  };

  const handleDelete = (id) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

 
  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  return (
<>
    <Container fluid>
          <Row>
          <SideBar />
          <Col md={10} style={{ margin: "20px auto" }}>
      <h1 className="text-center">User Manager</h1>
      <Button variant="primary" onClick={() => handleShow()}>
        Add User
      </Button>

      <Table striped bordered hover className="my-4">
        <thead>
          <tr>
            <th>Account</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.account}</td>
              <td>
                {user.firstName} {user.lastName}
              </td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.address || "N/A"}</td>
              <td>{user.roll === 1 ? "Admin" : "User"}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => handleShow(user)}
                  className="mr-2"
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => handleDelete(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination>
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages).keys()].map((pageNumber) => (
          <Pagination.Item
            key={pageNumber + 1}
            active={pageNumber + 1 === currentPage}
            onClick={() => handlePageChange(pageNumber + 1)}
          >
            {pageNumber + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>

      {/* Modal for Add/Edit User */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            {/* Form Fields */}
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                defaultValue={currentUser?.firstName || ""}
                required
              />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                defaultValue={currentUser?.lastName || ""}
                required
              />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                defaultValue={currentUser?.phone || ""}
                required
              />
            </Form.Group>
            <Form.Group controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                defaultValue={currentUser?.address || ""}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                defaultValue={currentUser?.email || ""}
                required
              />
            </Form.Group>
            <Form.Group controlId="dateOfBirth">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                name="dateOfBirth"
                defaultValue={currentUser?.dateOfBirth || ""}
              />
            </Form.Group>
            <Form.Group controlId="account">
              <Form.Label>Account</Form.Label>
              <Form.Control
                type="text"
                name="account"
                defaultValue={currentUser?.account || ""}
                required
              />
            </Form.Group>
            <Form.Group controlId="roll">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                name="roll"
                defaultValue={currentUser?.roll || 0}
              >
                <option value={0}>User</option>
                <option value={1}>Admin</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                defaultValue={currentUser?.password || ""}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      </Col>
        </Row>
    </Container>
    </>
  );
};

export default UserManager;
