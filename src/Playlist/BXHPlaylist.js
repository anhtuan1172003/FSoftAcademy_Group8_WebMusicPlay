import { Row, Col, Card, Container,Image, ListGroup } from 'react-bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css';
import './BXHPlaylist.css';

export default function BXHPlaylist({ playlist }) {
  return (
    <Container>
      <Row style={{ margin: "20px auto" }}>
        <Row style={{ textAlign: "center" }}>
          <h3>BXH PlayList</h3>
        </Row>
        <Row>
          <ListGroup>
            {playlist.map((item, index) => (
              <ListGroup.Item key={index} variant={index === 0 ? 'danger' : index === 1 ? 'secondary ' : index === 2 ? 'success' : ''}>
                <Row className="align-items-center"> 
                  <Col>
                  <Row>
                    {index + 1}. <Col className='bxh-img' md={2}><Image  src={item.img} rounded fluid /></Col> {item.name}
                    </Row>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Row>
      </Row>
    </Container>
  );
}
