import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer, Navbar } from "../components";
const Register = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:9999/user")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  useEffect(() => {
    console.log(errors.phone);
  }, [errors]);

  const submit = (data) => {
    const { account, phone, email } = data;
    const userExists = users.some((user) => {
      if (user.account === account) {
        alert("Account already exists");
        return true;
      }
      if (user.phone === phone) {
        alert("This phone number is already used for another account");
        return true;
      }
      if (user.email === email) {
        alert("This email is already used for another account");
        return true;
      }
      return false;
    });

    if (!userExists) {
      const newUser = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone,
        address: data.address,
        email: data.email,
        dateOfBirth: data.dateOfBirth,
        account: data.account,
        roll: 0,
        password: data.password,
      };
      // Send POST request to add the new user
      fetch("http://localhost:9999/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(newUser),
      })
        .then((response) => {
          if (response.status >= 400) {
            throw new Error(response.message || "Bad response from server");
          }
          return response.json();
        })
        .then((responseData) => {
          alert("Register successfully");
          navigate("/login");
        })
        .catch((error) => {
          // Handle the error if needed
          console.error(error);
        });
    }
  };

  const password = watch("password");

  return (
    <>
    <Navbar />
    <div className="container" style={{ width: "700px", height: "72vh", margin: "10vh auto", 
    padding: "20px" }}>
      <div className="row justify-content-center">
        <div className="inner-wrap col-xl-12">
        <h1 className="text-center">Register</h1>
                <hr />
          <div className="data mt-3">
            <form className="" onSubmit={handleSubmit(submit)}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Account"
                  className="form-control"
                  id="account"
                  name="account"
                  {...register("account", {
                    required: "Account is required",
                  })}
                />
                {errors.account && (
                  <p className="text-danger">{errors.account.message}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="New Password"
                  className="form-control"
                  id="password"
                  name="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                    maxLength: {
                      value: 20,
                      message: "Password must not exceed 20 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-danger">{errors.password.message}</p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="New Password Again"
                  className="form-control"
                  id="confirm-password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-danger">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Phone Number"
                  className="form-control"
                  maxLength="11"
                  name="phone_number"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^((\+84|84|0)[3|5|7|8|9])+([0-9]{8})$/,
                      message: "Invalid phone number format",
                    },
                    minLength: {
                      value: 10,
                      message: "Phone number must be at least 10 digits",
                    },
                  })}
                />
                {errors.phone && (
                  <p className="text-danger">{errors.phone.message}</p>
                )}
              </div>
              <div className="form-group">
                  <input
                    type="text"
                    placeholder="Date Of Birth"
                    className="form-control"
                    name="dateOfBirth"
                    {...register("dateOfBirth", {
                      // Add validation rules for dateOfBirth here
                      required: "Date Of Birth is required",
                    })}
                  />
                  {errors.dateOfBirth && (
                    <p className="text-danger">{errors.dateOfBirth.message}</p>
                  )}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Address"
                    className="form-control"
                    name="address"
                    {...register("address", {
                      // Add validation rules for address here
                      required: "Address is required",
                    })}
                  />
                  {errors.address && (
                    <p className="text-danger">{errors.address.message}</p>
                  )}
                </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Email"
                  className="form-control"
                  id="email"
                  name="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-danger">{errors.email.message}</p>
                )}
              </div>
              <div className="form-group mb-1">
                <div className="row">
                  <div className="col">
                    <input
                      type="text"
                      placeholder="First Name"
                      className="form-control"
                      id="first-name"
                      name="first_name"
                      {...register("firstName", {
                        required: "First name is required",
                        pattern: {
                          value: /^[\p{L}]+(\s[\p{L}]+)?$/u,
                          message: "First name should only contain letters",
                        },
                      })}
                    />
                    {errors.firstName && (
                      <p className="text-danger">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div className="col">
                    <input
                      type="text"
                      placeholder="Last Name"
                      className="form-control"
                      id="last-name"
                      name="last_name"
                      {...register("lastName", {
                        required: "Last name is required",
                        pattern: {
                          value: /^[\p{L}]+(\s[\p{L}]+)?$/u,
                          message: "Last name should only contain letters",
                        },
                      })}
                    />
                    {errors.lastName && (
                      <p className="text-danger">{errors.lastName.message}</p>
                    )}
                  </div>

                </div>
              </div>
              <div className="sign-in d-flex float-right mb-2">
                <Link to="/login">I have an account?</Link>
              </div>
              <div className="form-group">
                <button
                  className="btn form-control"
                  style={{ backgroundColor: "black", color: "white" }}
                >
                  Sign Up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
};
export default Register
