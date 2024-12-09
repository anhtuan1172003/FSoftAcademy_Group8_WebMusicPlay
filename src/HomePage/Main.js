import { Col, Row, Card, Container } from "react-bootstrap";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './Card.css';

// export default function Main() {
//   const [songs, setSong] = useState([]);
//   const [categories, setCategories] = useState([]);

//   useEffect(() => {
//     fetch(`https://dsqkll-8090.csb.app/listsongs`)
//       .then(res => res.json())
//       .then(data => {
//         setSong(data);
//       })
//       .catch(e => console.log(e));
//   }, []);

//   useEffect(() => {
//     fetch(`https://dsqkll-8090.csb.app/categories`)
//       .then(res => res.json())
//       .then(data => {
//         setCategories(data);
//       })
//       .catch(e => console.log(e));
//   }, []);

//   return (
//     <Container style={{ marginBottom: "30px" }}>
//       {categories.map((category) => (
//         <React.Fragment key={category.id}>
//           <h2>{category.name}</h2>
//           <Row>
//             {songs
//               .filter(song => Number(song.categoryId) === Number(category.id) && song.accept === 'yes')
//               .map((song) => (
//                 <Col key={song.id} xs={3}>
//                   <Card>
//                     <Card.Img variant="top" src={song.imgSrc} style={{ width: "190px" }} />
//                     <Card.Body>
//                       <Card.Title>
//                         <Link to={`/song/${song.id}`}><p>{song.title}</p></Link>
//                       </Card.Title>
//                     </Card.Body>
//                   </Card>
//                 </Col>
//               ))}
//           </Row>
//         </React.Fragment>
//       ))}
//     </Container>
//   );
// }
export default function Main() {
  const [songs, setSongs] = useState([]); // State cho danh sách bài hát
  const [categories, setCategories] = useState([]); // State cho danh sách thể loại

  useEffect(() => {
    // Fetch danh sách bài hát từ API
    fetch(`https://dsqkll-8090.csb.app/listsongs`)
      .then(res => res.json())
      .then(data => {
        setSongs(data); // Cập nhật state danh sách bài hát
      })
      .catch(e => console.log(e)); // Log lỗi nếu có
  }, []);

  useEffect(() => {
    // Fetch danh sách thể loại từ API
    fetch(`https://dsqkll-8090.csb.app/categories`)
      .then(res => res.json())
      .then(data => {
        setCategories(data); // Cập nhật state danh sách thể loại
      })
      .catch(e => console.log(e)); // Log lỗi nếu có
  }, []);

  return (
    <Container style={{ marginBottom: "30px" }}>
      {categories.map((category) => (
        <React.Fragment key={category.id}>
          <h2>{category.name}</h2> {/* Hiển thị tên thể loại */}
          <Row>
            {songs
              .filter(song => Number(song.categoryId) === Number(category.id)) // Lọc bài hát theo thể loại
              .sort((a, b) => b.plays - a.plays).slice(0, 5) // Sắp xếp bài hát theo số lượt nghe giảm dần
              .map((song) => (
                <Col key={song.id} sm={4} md={2}>
                  <Card>
                    <Card.Img variant="top" src={song.imgSrc} /> 
                    <Card.Body>
                      <Card.Title>
                        <Link to={`/song/${song.id}`}><p>{song.title}</p></Link> {/* Liên kết tới chi tiết bài hát */}
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