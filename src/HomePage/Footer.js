import { Row, Col} from 'react-bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Footer.css'

export default function Footer() {
    return (
        <Row className='footer'>
            <Col md={1}></Col>
            <Col md={2}>
            <h3>Công Ty</h3>
            <a href=''><h6>Giới Thiệu</h6></a>
            <a href=''><h6>Việc làm</h6></a>
            </Col>
            <Col md={2}>
            <h3>Cộng đồng</h3>
            <a href=''><h6>Nhà Phát Triển</h6></a>
            <a href=''><h6>Quảng Cáo</h6></a>
            <a href=''><h6>Nhà đầu tư</h6></a>
            <a href=''><h6>Nhà cung cấp</h6></a>

            </Col>
            <Col md={2}>
            <h3>Liên kết hữu ích</h3>
            <a href=''><h6>Hỗ trợ</h6></a>
            <a href=''><h6>Ứng dụng di động miễn phí</h6></a>
            </Col>
            <Col md={5}>
                <i class="bi bi-youtube icon"></i>
                <i class="bi bi-facebook icon"></i>
                <i class="bi bi-instagram icon"></i>
            </Col>

        </Row>
    )
}