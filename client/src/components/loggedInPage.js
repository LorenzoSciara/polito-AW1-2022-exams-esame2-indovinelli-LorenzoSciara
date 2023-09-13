import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { LogoutButton } from './LoginComponents';
import { Container, Row, Col, Navbar, Button } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import { SideBar } from './sideBar';
import { Ranking } from './ranking';
import { CloseRiddleListTable, OpenRiddleListTable, OwnRiddleListTable } from './riddleTalbe';
import { Loading } from './loading';

function LoggedInPage(props) {
    const { filter } = useParams();
    const navigate = useNavigate();
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
                                        {props.loggedIn ? <LogoutButton logout={props.doLogOut} user={props.user} /> : false}
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
                        {filter === "riddles" ?
                            <Container>
                                <Row>
                                    <Col xs={10} md={10} >
                                        <h2>All Own Riddles</h2>
                                    </Col>
                                    <Col>
                                        <Button onClick={() => { navigate("/addRiddle"); }} variant="success"><i className="bi bi-plus-lg"></i>{' '}Create new Riddle</Button>
                                    </Col>
                                    {props.loadingRiddles ?
                                        <Loading />
                                        :
                                        <OwnRiddleListTable riddles={props.riddles.filter(riddle => riddle.userid === props.user.userid)}
                                            user={props.user}
                                            answers={props.answers} />
                                    }
                                </Row>
                                <ul></ul>
                                <Row>
                                    <Col>
                                        <Row>
                                            <h2>All Open Riddles</h2>
                                            {props.loadingRiddles ?
                                                <Loading />
                                                :
                                                <OpenRiddleListTable riddles={props.riddles.filter(riddle => (riddle.state === "open" && riddle.userid !== props.user.userid))}
                                                    user={props.user}
                                                    answers={props.answers} addAnswer={props.addAnswer}
                                                />
                                            }
                                        </Row>
                                    </Col>
                                    <Col>
                                        <Row>
                                            <h2>All Close Riddles</h2>
                                            {props.loadingRiddles ?
                                                <Loading />
                                                :
                                                <CloseRiddleListTable riddles={props.riddles.filter(riddle => (riddle.state === "close" && riddle.userid !== props.user.userid))}
                                                    user={props.user}
                                                    answers={props.answers}
                                                />
                                            }
                                        </Row>
                                    </Col>
                                </Row>
                            </Container>
                            : 
                            <Row>
                                <h2>Ranking</h2>
                                {props.loadingRanking ?
                                    <Loading/>
                                    :
                                    <Ranking ranking={props.ranking} />
                                }
                            </Row>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export { LoggedInPage };