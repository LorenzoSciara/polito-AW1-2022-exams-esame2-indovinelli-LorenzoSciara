import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Spinner } from 'react-bootstrap';

function Loading() {
    return (
        <Container fluid>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>        
        </Container>
    );
}

export { Loading }
