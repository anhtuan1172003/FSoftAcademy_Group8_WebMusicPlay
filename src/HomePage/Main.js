import { Col, Row, Card, Container } from "react-bootstrap";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Card.css';

export default function Main() {
  const [songs, setSong] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`https://yvkjyc-8080.csb.app/listsongs`)
      .then(res => res.json())
      .then(data => {
        setSong(data);
      })
      .catch(e => console.log(e));
  }, []);

  useEffect(() => {
    fetch(`https://yvkjyc-8080.csb.app/categories`)
      .then(res => res.json())
      .then(data => {
        setCategories(data);
      })
      .catch(e => console.log(e));
  }, []);

  return (
    <Container style={{ marginBottom: "30px" }}>
      {categories.map((category) => (
        <React.Fragment key={category.id}>
          <h2>{category.name}</h2>
          <Row>
            {songs
              .filter(song => Number(song.categoryId) === Number(category.id) && song.accept === 'yes')
              .map((song) => (
                <Col key={song.id} xs={3}>
                  <Card>
                    <Card.Img variant="top" src={song.imgSrc} style={{ width: "210px" }} />
                    <Card.Body>
                      <Card.Title>
                        <Link to={`/song/${song.id}`}><p>{song.title}</p></Link>
                      </Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </React.Fragment>
      ))}
    </Container>
  );
}
