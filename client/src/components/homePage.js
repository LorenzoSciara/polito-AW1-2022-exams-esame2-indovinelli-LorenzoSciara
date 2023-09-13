import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Button, Navbar } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import { SideBar } from "./sideBar";
import { Ranking } from "./ranking";
import { HomePageRiddleListTable } from "./riddleTalbe";
import { Loading } from "./loading";

function HomePage(props) {

    const navigate = useNavigate();
    const { filter } = useParams();
    return (
        <>
            <Container fluid>
                <Row>
                    <Navbar expand="lg" bg="secondary" variant="dark">
                        <Container fluid>
                            <Navbar.Brand>
                                <h2><i className="bi bi-controller"></i>{" "}Indovinelli</h2>
                            </Navbar.Brand>
                            <div>
                                <Row>
                                    <Col>
                                        <Button onClick={() => { navigate('/login') }} variant='success'><i className="bi bi-box-arrow-in-right"></i> Log-In {" "}</Button>
                                    </Col>
                                </Row>
                            </div>
                        </Container>
                    </Navbar>
                </Row>
                <ul></ul>
                <Row>
                    <Col xs={2} md={2}>
                        <SideBar loggedIn={props.loggedIn} />
                    </Col>
                    <Col>
                        {filter === "ranking" ?
                            <Row>
                                <h2>Ranking</h2>
                                <ul></ul>
                                {props.loadingRanking ?
                                    <Loading/>
                                    :
                                    <Ranking ranking={props.ranking} />
                                }
                            </Row>
                            : <Row>
                                <h2>All Riddles</h2>
                                <ul></ul>
                                {props.loadingRiddles ?
                                    <Loading />
                                    :
                                    <HomePageRiddleListTable loggedIn={props.loggedIn}
                                        riddles={props.riddles} />
                                }
                            </Row>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export { HomePage };