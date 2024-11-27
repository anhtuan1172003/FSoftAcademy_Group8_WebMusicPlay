
import { Col, Container, Row, Card, ListGroup } from "react-bootstrap";
import Headerhomepage from "../HomePage/Header";

import './Album.css';
const albums = [
  { title: 'Tên Album 1', cover: './images/image1.jpg' },
  { title: 'Tên Album 2', cover: './images/image2.jpg' },
  { title: 'Tên Album 3', cover: './images/image3.jpg' },
  { title: 'Tên Album 4', cover: './images/image4.jpg' },
  { title: 'Tên Album 5', cover: './images/image1.jpg' },
  { title: 'Tên Album 6', cover: './images/image2.jpg' },
  { title: 'Tên Album 7', cover: './images/image3.jpg' },
  { title: 'Tên Album 8', cover: './images/image4.jpg' }
];
export default function BXHAlbum({ albums }) {
  return (
    <Container>
      <Row>
        <Headerhomepage></Headerhomepage>
      </Row>
      <Row>
        <Card.Img variant="top" src="./images/image2.jpg" className="album-card-img" />
      </Row>
      <Row style={{ margin: "20px auto" }}>
        <Row style={{ textAlign: "center" }}><h3>BXH Album</h3></Row>
        <Row>
          <ListGroup>
            {albums.map((item, index) => (
              <ListGroup.Item key={index} variant={index === 0 ? 'danger' : index === 1 ? 'warning' : index === 2 ? 'success' : ''}>
                {index + 1}. {item.title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Row>
      </Row>
    </Container>
  );
}
