import { Button, Container, Form, Nav, Navbar, Col, Row, Image, Carousel, NavDropdown, InputGroup } from 'react-bootstrap'
import React, { useEffect, useState } from 'react';
import Headerhomepage from './Header';
import Main from './Main';
import Footer from './Footer';
import BXH from './BXH';
import MusicPlayer from '../MusicPlayer';
import Carousel1 from './Carousel';

  
  
export default function HomePage() {
  const [selectedSong, setSelectedSong] = useState(null);

  useEffect(() => {
      const localSong = localStorage.getItem('selectedSong');
      console.log(localSong);
      if (localSong) {
          setSelectedSong(JSON.parse(localSong));
      }
  }, []);
    return (
      <div>
        <Container>
        <Row>
            <Headerhomepage/>
        </Row>
        <Row>
          <Carousel1></Carousel1>
        </Row>
            <Container style={{ marginTop:"50px"}}>
            <Row>
              <Col md={9}>
            <Main/>

            </Col>
            <Col md={3}>
            <BXH></BXH>
            </Col>
            </Row>
            </Container>
            <Row>
                <Footer></Footer>
             </Row>
             
            </Container>
ư            </div>
    );}