import { Col, Container, Row, Button } from 'react-bootstrap'
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react';

const EditProduct = () => {
    const navigate = useNavigate();
    const defaultProduct = {
        id: 0,
        title: "",
        description: "",
        category: "",
        image: "",
        rating: {},
    };
    const { ProductID } = useParams();
    const [Product, setProduct] = useState(defaultProduct);
    const [Category, setCategory] = useState([]);
    const name = useRef();
    const description = useRef();
    const price = useRef();
    const image = useRef();
    const rate = useRef();
    const count = useRef();
    const [img, setImg] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(""); // New state to handle selected category

    const updateImage = (e) => {
        const link = e.target.value;
        const links = link.split("\\");
        const linkname = selectedCategory; // Use selected category
        setImg(`../../images/Product/${linkname}/${links.pop()}`);
    };

    const handleProduct = async () => {
        if (name.current.value === "") {
            alert("Nhập đầy đủ thông tin");
        } else {
            const newproduct = {
                id: ProductID,
                title: name.current.value,
                category: selectedCategory, // Use selected category
                price: parseFloat(price.current.value),
                description: description.current.value,
                image: image.current.value,
                rating: {
                    rate: parseFloat(rate.current.value),
                    count: parseFloat(count.current.value),
                },
            };
            try {
                await fetch(`http://localhost:9999/products/${ProductID}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newproduct),
                });
                alert("Change Successfully");
                // navigate("/dashboard");
            } catch (error) {
                console.error("Error updating product:", error);
            }
        }
    };

    useEffect(() => {
        fetch(`http://localhost:9999/products/${ProductID}`)
            .then((res) => res.json())
            .then((currentProduct) => {
                setProduct(currentProduct);
                setImg(currentProduct.image);
                setSelectedCategory(currentProduct.category); // Set the category to the current product's category
            });
    }, [ProductID]);

    useEffect(() => {
        fetch("http://localhost:9999/products")
            .then((res) => res.json())
            .then((result) => {
                const uniqueCategories = result
                    .map((product) => product.category)
                    .filter((category, index, self) => self.indexOf(category) === index);
                setCategory(uniqueCategories);
            });
    }, []);

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col md={10} style={{ padding: "0" }}>
                        <div className="topbar">
                            <h1 className="admin-title">Edit Product</h1>
                        </div>
                        <div className="admin-content">
                            <Row>
                                <Col md={4}>
                                    <div className="form-group">
                                        <label htmlFor="ID">ID:</label>
                                        <input type="text" className="form-control" id="ID" defaultValue={ProductID} readOnly />
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="form-group">
                                        <label htmlFor="category">Category:</label>
                                        <select
                                            className="form-control"
                                            id="category"
                                            value={selectedCategory} // Use value instead of defaultValue
                                            onChange={(e) => setSelectedCategory(e.target.value)} // Update selected category
                                        >
                                            {Category.map((c) => (
                                                <option key={c} value={c}>
                                                    {c}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className="form-group">
                                        <label htmlFor="rate">Rate:</label>
                                        <input type="number" className="form-control" id="rate" defaultValue={Product.rating.rate} ref={rate} />
                                    </div>
                                </Col>
                                <Col md={2}>
                                    <div className="form-group">
                                        <label htmlFor="count">Count:</label>
                                        <input type="number" className="form-control" id="count" defaultValue={Product.rating.count} ref={count} />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="form-group">
                                        <label htmlFor="name">Name:</label>
                                        <input type="text" className="form-control" id="name" defaultValue={Product.title} ref={name} />
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="form-group">
                                        <label htmlFor="price">Price:</label>
                                        <input type="number" className="form-control" id="price" defaultValue={Product.price} ref={price} />
                                    </div>
                                </Col>
                                <Col md={12}>
                                    <div className="form-group">
                                        <label htmlFor="description">Description:</label>
                                        <input type="text" className="form-control" id="description" defaultValue={Product.description} ref={description} />
                                    </div>
                                </Col>

                                <Col md={6}>
                                    <img src={img} style={{ width: "100%" }} alt="Product" />
                                    <div className="form-group">
                                        <label htmlFor="image">Image:</label>
                                        <input type="text" className="form-control" id="image" defaultValue={Product.image} ref={image} placeholder="Enter image URL" />
                                    </div>
                                </Col>
                            </Row>
                            <Button
                                style={{
                                    marginTop: "50px",
                                    height: "70px",
                                    width: "150px",
                                    fontSize: "30px",
                                    fontWeight: "600",
                                }}
                                onClick={handleProduct}
                            >
                                Save
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default EditProduct;
