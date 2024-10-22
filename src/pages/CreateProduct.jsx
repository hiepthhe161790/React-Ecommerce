import { Col, Container, Row, Button } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react';

const CreateProduct = () => {
    const navigate = useNavigate();
    const { ProductID } = useParams();
    const [Product, setProduct] = useState();
    const [Category, setCategory] = useState([]);
    const [img, setImg] = useState("");
    const name = useRef();
    const description = useRef();
    const category = useRef();
    const price = useRef();
    const image = useRef();
    const rate = useRef();
    const count = useRef();


    const [productId, setProductId] = useState(0);
    useEffect(() => {
        fetch("http://localhost:9999/products")
            .then((res) => res.json())
            .then((result) => {
                setProductId(result.length + 1);
            });
    }, [])
    useEffect(() => {
        fetch("http://localhost:9999/products")
            .then((res) => res.json())
            .then((result) => {
                result.map((r) => {
                    if (r.id == ProductID) {
                        setProduct(r);
                    }
                })
            });
    }, [])
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
    
    const handleCreate = async () => {
        if (name.current.value == "" || category.current.value == "" ||
            price.current.value == ""
            && image.current.value == "") {
            alert("Nhập đầy đủ thông tin")
        }
        else {
            try {
                const link = image.current.value;
                const links = link.split("\\");
                const linkname = category.current.value;
                // const nameproduct = name.current.value.trim().split(" ");
                // const linkname = nameproduct.join("_");
                const newproduct = {
                    title: name.current.value,
                    category: category.current.value,
                    price: parseFloat(price.current.value),
                    description: description.current.value,
                    rating: {  
                        rate: parseFloat(rate.current.value),
                        count: parseFloat(count.current.value)
                    },
                    // image: `../../images/Product/${linkname}/${links.pop()}`
                    image: image.current.value
                }

                const response = await fetch("http://localhost:9999/products", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newproduct),
                });
            } catch (error) {
                console.error(error);
                // Handle the error, show an error message, or perform any necessary actions
            }
            navigate("/dashboard");
        }
    }
    const updateImage = (e) => {
        const link = e.target.value;
        const links = link.split("\\");
        const linkname = category.current.value;
        // const nameproduct = name.current.value.trim().split(" ");
        // const linkname = nameproduct.join("_");
        // console.log(links)
        setImg(`../../images/Product/${linkname}/${links.pop()}`)
    }

// console.log("data la :", Product )
console.log("category", Category)
    return (
        <div>
            <Container fluid>
                <Row>
                    <Col md={10} style={{ padding: "0" }}>
                        <div className="topbar">
                            <h1 className="admin-title">Create Product</h1>
                        </div>
                        <div className='admin-content'>
                            <Row>
                                <Col md={12}>
                                    <div className="form-group">
                                        <label htmlFor="category">Category:</label>
                                        <select className="form-control"
                                            id="category"
                                            ref={category}>
                                            {Category.map((c) => {
                                                return (
                                                    <option
                                                        >
                                                        {c}
                                                    </option>
                                                )
                                            })
                                            }
                                        </select>
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="form-group">
                                        <label htmlFor="name">Title:</label>
                                        <input type="text"
                                            className="form-control"
                                            id="name"
                                            ref={name} />
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className="form-group">
                                        <label htmlFor="price">Price:</label>
                                        <input type="number"
                                            className="form-control"
                                            id="price"
                                            ref={price} />
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className="form-group">
                                        <label htmlFor="rate">Rate:</label>
                                        <input type="number"
                                            className="form-control"
                                            id="rate"
                                            ref={rate} />
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className="form-group">
                                        <label htmlFor="count">Count:</label>
                                        <input type="number"
                                            className="form-control"
                                            id="count"
                                            ref={count} />
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className="form-group">
                                        <label htmlFor="description">Description:</label>
                                        <input type="text"
                                            className="form-control"
                                            id="description"
                                            ref={description} />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <img src={img} style={{ width: "100%" }} />
                                    <div className="form-group">
                                        <label htmlFor="image">Image:</label>
                                        {/* <input type="file"
                                            className="form-control"
                                            id="image" ref={image}
                                            onChange={(e) => updateImage(e)} /> */}
                                        <input type="text" className="form-control" id="image" ref={image} placeholder="Enter image URL" />
                                    </div>
                                </Col>
                            </Row>
                            <Button style={{ marginTop: "10px" }}
                                onClick={() => handleCreate()}>
                                Create
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}
export default CreateProduct;