import SideBar from "./SideBar";
import { error } from "jquery";
import { Link } from "react-router-dom";
import { Footer, Navbar } from "../components";
import { Button, Col, Container, FormControl, Row, Table } from 'react-bootstrap'
import { useEffect, useState, useRef } from 'react'
import { FaStar } from 'react-icons/fa'; 
import { BsFillInfoCircleFill } from 'react-icons/bs'; 
const Dashboard = () => {
    const [Product, setProduct] = useState([]);
    const [searchedProduct, setSearchedProduct] = useState([]);
    const [Category, setCategory] = useState([]);
    const [paggingProducts, setPaggingProducts] = useState([]);
    const [pagging, setPagging] = useState([]);
    const [isChange, setIsChange] = useState(true)
    const search = useRef("");

    useEffect(() => {
        fetch("http://localhost:9999/products")
            .then((res) => res.json())
            .then((result) => {
                const uniqueCategories = result
                    .map(product => product.category)
                    .filter((category, index, self) => self.indexOf(category) === index);
                setCategory(uniqueCategories);
            });
    }, []);
    useEffect(() => {
        fetch("http://localhost:9999/products")
            .then((res) => res.json())
            .then((result) => {
                if (result.length >= 5) {
                    setPaggingProducts(result.slice(0, 5))
                }
                else {
                    setPaggingProducts(result.slice(0, result.length));
                }
                let setpagging = [];
                let end;
                if (result.length % 5 == 0) {
                    end = result.length / 5;
                } else {
                    end = result.length / 5 + 1;
                }
                for (let i = 1; i <= end; i++) {
                    setpagging = [...setpagging, i]
                }
                setPagging(setpagging);
                setSearchedProduct(result);
                setProduct(result);
            });
    }, [isChange])
    useEffect(() => {
        if (searchedProduct.length >= 5) {
            setPaggingProducts(searchedProduct.slice(0, 5))
        }
        else {
            setPaggingProducts(searchedProduct.
                slice(0, searchedProduct.length));
        }
        let setpagging = [];
        let end;
        if (searchedProduct.length % 5 == 0) {
            end = searchedProduct.length / 5;
        } else {
            end = searchedProduct.length / 5 + 1;
        }
        for (let i = 1; i <= end; i++) {
            setpagging = [...setpagging, i]
        }
        setPagging(setpagging);
    }, [searchedProduct])

    const Pagging = (index) => {
        if (Product.length > index * 5) {
            setPaggingProducts(searchedProduct.
                slice((index - 1) * 5, index * 5))
        }
        else setPaggingProducts(searchedProduct.
            slice((index - 1) * 5, searchedProduct.length))
    }
    const filterByCategory = (e) => {
        if (e.target.value == "all") setSearchedProduct(Product);
        else {
            setSearchedProduct(Product.filter((p) => {
                return p.category == e.target.value;
            }))
        }
    }
    const SearchedList = (key) => {
        const searchedList = Product.filter((p) => {
            return p.title.toLowerCase().
                includes(key.current.value.toLowerCase());
        });
        setSearchedProduct(searchedList);
    }

    const deleteProduct = async (id) => {
        const confirm = window.confirm('Do you want to delete?')
        if (confirm) {
            fetch(`http://localHost:9999/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(() => {
                    setIsChange(!isChange);
                })
        };
    }
  if (
    JSON.parse(sessionStorage.getItem("user")) != null &&
    JSON.parse(sessionStorage.getItem("user")).roll == 1
  ) {
    return (
      <>
      {/* <Navbar /> */}
      <div>
      <Container fluid>
                <Row>
                    <SideBar />
                    <Col  md={10}  style={{ margin: "auto" }}>
                        <div classtitle="topbar" >
                            <h1 classtitle="admin-title" style={{ textAlign:"center" }}>Product Management</h1>
                        </div>
                        <div classtitle='admin-content'>
                            <Container>
                                <Row style={{ marginBottom: "20px" }}>
                                    <Col md={4}>
                                        <select onChange={(e) => filterByCategory(e)}>
                                            <option value="all">-- Filter By Category --</option>
                                            {
                                                Category.map((c) => {
                                                    return (
                                                        <option >{c}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </Col>
                                    <Col md={6}>
                                        <div classtitle='input-group'>
                                            <FormControl type='text' placeholder='Enter title to search'
                                                ref={search}
                                                onChange={() => SearchedList(search)} />
                                            <div classtitle='input-group-prepend'>
                                                {/* <Button classtitle='btn-dark'
                                                    onClick={() => SearchedList(search)}>
                                                    Search
                                                </Button> */}
                                            </div>
                                        </div>
                                    </Col>
                                    <Col md={2}>
                                        <Link to="/createproduct">
                                            <Button style={{ width: '200px' }}
                                                classtitle='btn-success'>
                                                Create a new product
                                            </Button>
                                        </Link>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={12}>
                                        <Table>
                                            <thead
                                                style={{
                                                    backgroundColor: '#1dbd55',
                                                    color: '#fff'
                                                }}>
                                                <th>ID</th>
                                                <th>Title</th>
                                                <th>Price</th>
                                                <th>Description</th>
                                                <th>Category</th>
                                                <th>Image</th>
                                                <th>Rate</th>
                                                <th>Action</th>
                                            </thead>
                                            <tbody>
                                                {
                                                    paggingProducts.map((p) => {
                                                        return (
                                                            <tr>
                                                                <td>{p.id}</td>
                                                                <td><Link to={`/EditProduct/${p.id}`}
                                                                    title='edit'>
                                                                        {/* {product.title.substring(0, 12)}... */}
                                                                    {p.title.substring(0, 12)}... <BsFillInfoCircleFill /></Link></td>
                                                                    
                                                                <td>{p.price}</td>
                                                                <td>{p.description.length > 50 ? `${p.description.substring(0, 50)}...` : p.description}</td>
                                                                <td>{
                                                                   p.category
                                                                }</td>
                                                                {/* <td>{p.image}</td> */}
                                                                <td>
                                                                <img src={p.image} alt="Product" style={{ width: "60px", height: "auto" }} />
                                                                </td>

                                                                <td>{p.rating.rate} <FaStar style={{ color: 'gold' }} /></td>
                                                                <td><Link
                                                                    onClick={() => deleteProduct(p.id)}>
                                                                    Delete</Link></td>
                                                            </tr>
                                                        )
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                        <div classtitle='pagging'>
                                            {
                                                pagging.map((p) => {
                                                    return (
                                                        <button classtitle='btn btn-success'
                                                            style={{ marginLeft: "5px" }}
                                                            onClick={() => Pagging(p)}>
                                                            {p}</button>
                                                    )
                                                })
                                            }
                                        </div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    </Col>
                </Row>
            </Container>
      </div>
      <Footer />
    </>
    );
  } else {
    error("You are not allowed to access this page");
  }
};

export default Dashboard;
