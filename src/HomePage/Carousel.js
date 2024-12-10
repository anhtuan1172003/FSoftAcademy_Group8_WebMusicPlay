import { Button, Container, Form, Nav, Navbar, Col, Row, Image, Carousel, NavDropdown, InputGroup, Dropdown  } from 'react-bootstrap';
export default function Carousel1() {
return(
                <Carousel>
                    <Carousel.Item>
                        <Image src="/image/image1.jpg" className='carousel-image'></Image>
                        <Carousel.Caption>

                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image src="/image/image2.jpg" className='carousel-image'></Image>
                        <Carousel.Caption>

                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <Image src="/image/image3.jpg" className='carousel-image'></Image>
                        <Carousel.Caption>

                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
);
            }