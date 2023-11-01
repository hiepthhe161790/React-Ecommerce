import { Col, Container, Row, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

const EditProduct = () => {
    const navigate = useNavigate();
    const defaultProduct = {
        id: 0,
        title: "",
        price: 0,
        description: "",
        category: "",
        image: "",
        rating: {
            rate: 4.5,
            count: 100
        }
    }
    const { ProductID } = useParams();
    const [Product, setProduct] = useState(defaultProduct);
    const [Category, setCategory] = useState([]);
    const name = useRef();
    const description = useRef();
    const category = useRef();
    const price = useRef();
    const image = useRef();
    const rating = useRef();
    const img = useRef();

    const updateImage = (e) => {
        const link = e.target.value;
        const links = link.split("\\");
        const linkname = category.current.value;
        img.current = `../../images/Product/${linkname}/${links.pop()}`;
    }

    const handleProduct = async () => {
        if (name.current.value === "" || category.current.value === "" || price.current.value === "" || image.current.value === "") {
            alert("Nhập đầy đủ thông tin");
        } else {
            const newProduct = {
                id: ProductID,
                title: name.current.value,
                category: category.current.value,
                price: parseFloat(price.current.value),
                image: img,
                rating: {
                    rate: parseFloat(rating.current.value),
                    count: Product.rating.count
                }
            };
            try {
                await fetch(`http://localhost:9999/products/${ProductID}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newProduct),
                });
                alert("Chỉnh sửa sản phẩm thành công");
                navigate("/");
            } catch (error) {
                console.error("Lỗi khi cập nhật sản phẩm:", error);
            }
        }
    }

    useEffect(() => {
        fetch("http://localhost:9999/products")
            .then((res) => res.json())
            .then((result) => {
                const currentProduct = result.find((r) => r.id == ProductID);
                setProduct(currentProduct);
                img.current = currentProduct.image;
            });
    }, [ProductID]);

    useEffect(() => {
        fetch("http://localhost:9999/products")
            .then((res) => res.json())
            .then((result) => {
                setCategory(result);
            });
    }, []);

    return (
        <div>
            <Container fluid>
                <Row>
                    <Col md={10} style={{ padding: "0" }}>
                        <div className="topbar">
                            <h1 className="admin-title">Chỉnh sửa sản phẩm</h1>
                        </div>
                        <div className='admin-content'>
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
                                        <select className="form-control" id="product" ref={category}>
                                            {Category.map((c) => (
                                                <option
                                                    key={c.id}
                                                    value={c.id}
                                                >
                                                    {c.category}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </Col>
                                <Col md={4}>
                                    <div className="form-group">
                                        <label htmlFor="rating">Rate:</label>
                                        <input type="number" className="form-control" id="rating" defaultValue={Product.rating.rate} ref={rating} />
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
                                    <img src={img.current} style={{ width: "100%" }} />
                                    <div className="form-group">
                                        <label htmlFor="image">Image:</label>
                                        <input type="file" className="form-control" id="image" ref={image} onChange={(e) => updateImage(e)} />
                                    </div>
                                </Col>
                            </Row>
                            <Button
                                style={{
                                    marginTop: "50px",
                                    height: "70px",
                                    width: "150px",
                                    fontSize: "30px",
                                    fontWeight: "600"
                                }}
                                onClick={handleProduct}
                            >
                                Lưu
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default EditProduct;
