import React from 'react';
import { Carousel, Navbar, Nav, Container, Button, Card, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap styles are included
import './css/home.css';

// Import images from the img folder
import samsungImage from './img/samsung.png';
import iphoneImage from './img/iphone.png'; 
import redmiImage from './img/redmi.png'; // Adjust the filename if needed

const Homes = () => {
  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <Navbar bg="light" expand="lg" className="navbar fixed-top">
        <Container>
          <Navbar.Brand href="/" className="logo">THE PHONE SHOP</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/catalog">Catalog</Nav.Link>
              <Nav.Link href="/trade-in">Trade-In</Nav.Link>
              <Nav.Link href="/contact">Contact</Nav.Link>
              <Nav.Link href="/login">Login</Nav.Link>
              <Nav.Link href="/register">Register</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Promotional Carousel */}
      <Carousel className="promo-carousel">
        <Carousel.Item>
          <div className="carousel-content">
            <img
              className="product-image"
              src={samsungImage}
              alt="Samsung Product"
            />
            <div className="promo-text">
              <h2 className="product-title">Product 1</h2>
              <p className="product-subtitle">Innovative design for your style</p>
              <button className="learn-more-button">Learn More</button>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div className="carousel-content">
            <img
              className="product-image"
              src={iphoneImage}
              alt="iPhone Product"
            />
            <div className="promo-text">
              <h2 className="product-title">Product 2</h2>
              <p className="product-subtitle">Experience technology like never before</p>
              <button className="learn-more-button">Learn More</button>
            </div>
          </div>
        </Carousel.Item>

        <Carousel.Item>
          <div className="carousel-content">
            <img
              className="product-image"
              src={redmiImage}
              alt="Redmi Product"
            />
            <div className="promo-text">
              <h2 className="product-title">Product 3</h2>
              <p className="product-subtitle">Experience technology like never before</p>
              <button className="learn-more-button">Learn More</button>
            </div>
          </div>
        </Carousel.Item>
      </Carousel>

      {/* Redmi Product Section */}
      <Container className="redmi-product-section mt-5">
        <Row>
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={redmiImage} />
              <Card.Body>
                <Card.Title>Redmi 13C 5G</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={redmiImage} />
              <Card.Body>
                <Card.Title>Redmi 13</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={redmiImage} />
              <Card.Body>
                <Card.Title>Redmi A3x</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card>
              <Card.Img variant="top" src={redmiImage} />
              <Card.Body>
                <Card.Title>Redmi A3</Card.Title>
                <Button variant="primary" className="me-2">Learn More</Button>
                <Button variant="success">Add to Cart</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Homes;
