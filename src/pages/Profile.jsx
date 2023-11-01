
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Navbar from "../components/Navbar";
const Profile = () => {
  const [user, setUser] = useState();
  const [listUsers, setListUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:9999/user")
      .then((response) => response.json())
      .then((data) => setListUsers(data));
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem("user")));
  }, []);

  const handleChangeAccPass = (data) => {
    const { currentPass, newPass, rePass } = data;
    let updatedUser;

    if (currentPass == user.password) {
      if (newPass === rePass) {
        updatedUser = { ...user, password: rePass };

        fetch(`http://localhost:9999/user/${user.id}`, {
          method: "PUT",
          Navbars: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedUser),
        })
          .then((response) => response.json())
          .then((data) => {
            setUser(data);
            sessionStorage.setItem("user", JSON.stringify(data));
            alert("Change password successfully");
          })
          .catch((error) => {
            console.error("Error:", error);
            alert("An error occurred while changing password");
          });
      } else {
        alert("New password does not match");
      }
    } else {
      alert("Password is not correct");
    }
    reset();
  };

  const updateProfile = async () => {
    if (user) {
      try {
        let check = listUsers.some((u) => u.account == user.account);
        if (check == false) {
          alert("account has existed, please enter another account name");
        } else {
          const updatedUser = {
            ...user,
          };

          const response = await fetch(
            `http://localhost:9999/user/${user.id}`,
            {
              method: "PUT",
              Navbars: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedUser),
            }
          );

          if (!response.ok) {
            throw new Error("Error updating user.");
          }

          const data = await response.json();

          console.log("User updated:", data);
          setUser(updatedUser);
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
          alert("Update succesfully!");
        }
      } catch (error) {
        alert("Update fail");
        console.error("Error updating user:", error);
      }
    }
  };

  return (
    <Container fluid className="p-0">
      <Navbar />
      <Row>
        <Container>
          <Col md={12} style={{ marginTop: "68px" }}>
            <h1>Edit Profile</h1>
            <hr></hr>
          </Col>
          <Row>

            <Col md={10}>
              <table className="w-100">
                <tbody className="table-edit">
                  <tr>
                    <td>
                      <h4>Profile Detail</h4>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex mb-3">
                        <span style={{ width: "15%" }}>First Name:</span>
                        <input
                          style={{ width: "85%" }}
                          type="text"
                          id="firstname"
                          value={user ? user.firstName : ""}
                          onChange={(e) =>
                            setUser((prevUser) => ({
                              ...prevUser,
                              firstName: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="d-flex  mb-3">
                        <span style={{ width: "15%" }}>Last Name:</span>
                        <input
                          style={{ width: "85%" }}
                          type="text"
                          id="lastname"
                          value={user ? user.lastName : ""}
                          onChange={(e) =>
                            setUser((prevUser) => ({
                              ...prevUser,
                              lastName: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <div className="d-flex mb-3">
                        <span style={{ width: "15%" }}>Account:</span>
                        <input
                          style={{ width: "85%" }}
                          type="text"
                          id="account"
                          value={user ? user.account : ""}
                          onChange={(e) =>
                            setUser((prevUser) => ({
                              ...prevUser,
                              account: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <div className="d-flex  mb-3">
                        <span style={{ width: "15%" }}>Date Of Birth:</span>
                        <input
                          style={{ width: "85%" }}
                          type="date"
                          id="dob"
                          value={user ? user.dateOfBirth : ""}
                          onChange={(e) =>
                            setUser((prevUser) => ({
                              ...prevUser,
                              dateOfBirth: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <div className="d-flex  mb-3">
                        <span style={{ width: "15%" }}>Phone Number:</span>
                        <input
                          style={{ width: "85%" }}
                          type="text"
                          id="phone"
                          value={user ? user.phone : ""}
                          onChange={(e) =>
                            setUser((prevUser) => ({
                              ...prevUser,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <div className="d-flex  mb-3">
                        <span style={{ width: "15%" }}>Address:</span>
                        <input
                          style={{ width: "85%" }}
                          type="text"
                          id="address"
                          value={user ? user.address : ""}
                          onChange={(e) =>
                            setUser((prevUser) => ({
                              ...prevUser,
                              address: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}>
                      <div className="d-flex  mb-3">
                        <span style={{ width: "15%" }}>Email:</span>
                        <input
                          style={{ width: "85%" }}
                          type="text"
                          id="email"
                          value={user ? user.email : ""}
                          onChange={(e) =>
                            setUser((prevUser) => ({
                              ...prevUser,
                              email: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </td>
                  </tr>
                  <tr className="d-flex justify-content-end">
                    <button
                      className="btn btn-danger w-25"
                      style={{ height: "48px" }}
                      onClick={() => updateProfile()}
                    >
                      Update Profile
                    </button>
                  </tr>
                </tbody>
              </table>
              <div className="d-flex flex-column justify-content-center">
                <button
                  type="button"
                  class="btn btn-danger mt-3"
                  data-toggle="modal"
                  data-target="#changePass"
                >
                  Change Password
                </button>
                <div class="modal fade" id="changePass">
                  <form onSubmit={handleSubmit(handleChangeAccPass)}>
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <h4 class="modal-title">Change Password</h4>
                        <div class="modal-body">
                          <table className="w-100">
                            <tbody>
                              <tr>
                                <td>Current Password:</td>
                                <td>
                                  <input
                                    type="password"
                                    className="w-100"
                                    id="currentPass"
                                    {...register("currentPass", {
                                      required: true,
                                    })}
                                  />
                                  {errors.currentPass && (
                                    <p
                                      style={{ fontSize: "12px" }}
                                      className="text-danger mb-0"
                                    >
                                      This field is required.
                                    </p>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td>New Password:</td>
                                <td>
                                  <input
                                    type="password"
                                    id="newPass"
                                    className="w-100"
                                    {...register("newPass", {
                                      required: true,
                                      minLength: 6,
                                      maxLength: 20,
                                    })}
                                  />
                                  {errors.newPass && (
                                    <p
                                      style={{ fontSize: "12px" }}
                                      className="text-danger mb-0"
                                    >
                                      This field is required.
                                    </p>
                                  )}
                                  {errors.newPass?.type === "minLength" && (
                                    <p
                                      style={{ fontSize: "12px" }}
                                      className="text-danger mb-0"
                                    >
                                      New password must have at least 6
                                      characters.
                                    </p>
                                  )}
                                  {errors.newPass?.type === "maxLength" && (
                                    <p
                                      style={{ fontSize: "12px" }}
                                      className="text-danger mb-0"
                                    >
                                      New password must have at most 20
                                      characters.
                                    </p>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td>Enter new password again:</td>
                                <td>
                                  <input
                                    type="password"
                                    id="rePass"
                                    className="w-100"
                                    {...register("rePass", { required: true })}
                                  />
                                  {errors.rePass && (
                                    <p
                                      style={{ fontSize: "12px" }}
                                      className="text-danger mb-0"
                                    >
                                      This field is required.
                                    </p>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div class="modal-footer d-flex justify-content-between">
                          <button
                            type="button"
                            class="btn btn-danger"
                            data-dismiss="modal"
                          >
                            Cancel
                          </button>
                          <button type="submit" className="btn btn-primary">
                            Change Password
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Row>
    </Container>
  );
};
export default Profile;
