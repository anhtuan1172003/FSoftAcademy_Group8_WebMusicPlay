import { Button, Container, Form, Nav, Navbar, Col, Row, Image, Carousel, NavDropdown, InputGroup } from 'react-bootstrap'
import React, { useEffect, useState } from 'react';
import ManageArtists from './ManageArtist';
  
export default function Admin() {
    return (

        <Container>
        <Row>
            <ManageArtists/>
        </Row>
        </Container>

    );}