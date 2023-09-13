import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container } from "react-bootstrap";
import { Loading } from "./loading";

function Timer (props) {
    return (
        <>
            <Container>
                <h6>Remaining time:</h6>
                { props.time<0 ? <Loading/> : <h5>{props.time}{' '}seconds</h5> }
            </Container>
        </>
    );
}

export { Timer }