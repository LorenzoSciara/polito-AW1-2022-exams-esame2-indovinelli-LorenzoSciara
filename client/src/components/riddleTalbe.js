import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Table, Collapse } from "react-bootstrap";
import { useState } from 'react';
import { AnswerToRiddleForm } from "./answerToRiddleForm";
import { Timer } from "./timer";

function HomePageRiddleListTable(props) {
    return (
        <>
            <Container fluid>
                {props.riddles.length !== 0 ?
                    <Row>
                        <Col>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Question</th>
                                        <th>Difficulty</th>
                                        <th>State</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        props.riddles.map((riddle) => <HomePageTableRow riddle={riddle} key={riddle.riddleid} loggedIn={props.loggedIn} />)
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    : <p>The list is empty</p>}
            </Container>
        </>
    );
}

function HomePageTableRow(props) {
    return (
        <>
            <HomePageTableData riddle={props.riddle} loggedIn={props.loggedIn} />
        </>
    );
}

function HomePageTableData(props) {
    return (
        <>
            <tr>
                <td>{props.riddle.question}</td>
                <td>{props.riddle.difficulty}</td>
                <td>{props.riddle.state}</td>
            </tr>
        </>
    );
}

function CloseRiddleListTable(props) {
    return (
        <>
            <Container fluid>
                {props.riddles.length !== 0 ?
                    <Row>
                        <Col>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Question</th>
                                        <th>Difficulty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        props.riddles.map((riddle) => <CloseTableRow riddle={riddle} key={riddle.riddleid} loggedIn={props.loggedIn}
                                            answers={props.answers} />)
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    : <p>The list is empty</p>}
            </Container>
        </>
    );
}

function CloseTableRow(props) {
    return (
        <>
            <CloseTableData riddle={props.riddle} loggedIn={props.loggedIn}
                answers={props.answers} />
        </>
    );
}

function CloseTableData(props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <tr onClick={() => setOpen(!open)} aria-controls="riddle-description" aria-expanded={open}>
                <td>
                    {props.riddle.question}
                </td>
                <td>
                    {props.riddle.difficulty}
                </td>
                <td>
                    {open ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                </td>
            </tr>
            <Collapse in={open}>
                <tr>
                    <td colSpan={6} className='p-3 mb-2 bg-light text-dark'>
                        <div id="riddle-description">
                            <h6>All answers to the selected question are:</h6>
                            {props.answers.filter(answer => answer.riddleid === props.riddle.riddleid).map(answer => answer.answer).join(", ")}
                            <ul></ul>
                            <h6>The correct answer is:</h6>
                            {props.riddle.correctAnswer}
                            <ul></ul>
                            {props.riddle.winner !== null ?
                                <div>
                                    <h6>The winner is:</h6>
                                    {props.riddle.winner}
                                </div>
                                :
                                <h6>There is no winner</h6>
                            }
                        </div>
                    </td>
                </tr>
            </Collapse>
        </>
    );
}

function OpenRiddleListTable(props) {
    return (
        <>
            <Container fluid>
                {props.riddles.length !== 0 ?
                    <Row>
                        <Col>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Question</th>
                                        <th>Difficulty</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        props.riddles.map((riddle) => <OpenTableRow riddle={riddle} key={riddle.riddleid} loggedIn={props.loggedIn}
                                            user={props.user}
                                            answers={props.answers}
                                            addAnswer={props.addAnswer}
                                        />)
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    : <p>The list is empty</p>}
            </Container>
        </>
    );
}

function OpenTableRow(props) {
    return (
        <>
            <OpenTableData riddle={props.riddle} loggedIn={props.loggedIn}
                user={props.user}
                answers={props.answers} addAnswer={props.addAnswer}
            />
        </>
    );
}

function OpenTableData(props) {
    // const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    return (
        <>
            <tr onClick={() => setOpen(!open)} aria-controls="course-description" aria-expanded={open}>
                {/* <tr onClick={() => { navigate("/answerToRiddle"); }} > */}
                <td>
                    {props.riddle.question}
                </td>
                <td>
                    {props.riddle.difficulty}
                </td>
                <td>
                    {open ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                    {/* <Button onClick={() => { navigate("/answerToRiddle"); }} variant="success">Answer to Riddle</Button> */}
                </td>
            </tr>
            <Collapse in={open}>
                <tr>
                    <td colSpan={6} className='p-3 mb-2 bg-light text-dark'>
                        <div id="course-description">
                            <AnswerToRiddleForm riddle={props.riddle}
                                open={open} setOpen={setOpen}
                                user={props.user}
                                answer={props.answers.find(answer => (answer.userid === props.user.userid && answer.riddleid === props.riddle.riddleid))}
                                addAnswer={props.addAnswer}
                            />
                        </div>
                    </td>
                </tr>
            </Collapse>
        </>
    );
}

function OwnRiddleListTable(props) {
    return (
        <>
            <Container fluid>
                {props.riddles.length !== 0 ?
                    <Row>
                        <Col>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Question</th>
                                        <th>Difficulty</th>
                                        <th>State</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        props.riddles.map((riddle) => <OwnTableRow riddle={riddle} key={riddle.riddleid} loggedIn={props.loggedIn}
                                            answers={props.answers} />)
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    : <p>The list is empty</p>}
            </Container>
        </>
    );
}

function OwnTableRow(props) {
    return (
        <>
            <OwnTableData riddle={props.riddle} loggedIn={props.loggedIn}
                answers={props.answers} />
        </>
    );
}

function OwnTableData(props) {

    const [open, setOpen] = useState(false);
    return (
        <>
            <tr onClick={() => setOpen(!open)} aria-controls="riddle-description" aria-expanded={open}>
                <td>
                    {props.riddle.question}
                </td>
                <td>
                    {props.riddle.difficulty}
                </td>
                <td>
                    {props.riddle.state}
                </td>
                <td>
                    {open ? <i className="bi bi-chevron-up"></i> : <i className="bi bi-chevron-down"></i>}
                </td>
            </tr>
            <Collapse in={open}>
                <tr>
                    <td colSpan={6} className='p-3 mb-2 bg-light text-dark'>
                        {
                            props.riddle.state === "close" ?
                                <div id="riddle-description">
                                    <h6>All answers to the selected question are:</h6>
                                    {props.answers.filter(answer => answer.riddleid === props.riddle.riddleid).map(answer => answer.answer).join(", ")}
                                    <ul></ul>
                                    <h6>The correct answer is:</h6>
                                    {props.riddle.correctAnswer}
                                    <ul></ul>
                                    {props.riddle.winner !== null ?
                                        <div>
                                            <h6>The winner is:</h6>
                                            {props.riddle.winner}
                                        </div>
                                        :
                                        <h6>There is no winner</h6>
                                    }
                                </div>
                                :
                                props.answers.filter(answer => answer.riddleid === props.riddle.riddleid).length !== 0 ?
                                    <div id="riddle-description">
                                        <Row>
                                            <Col>
                                                <h6>All answers to question:{' '}{props.riddle.question}{' '}are:</h6>
                                                {props.answers.filter(answer => answer.riddleid === props.riddle.riddleid).map(answer => answer.answer).join(", ")}
                                            </Col>
                                            <Col>
                                                <Timer time={props.riddle.remainingTime} />
                                            </Col>
                                        </Row>
                                    </div>
                                    :
                                    <p>There are no answers to this question yet</p>
                        }

                    </td>
                </tr>
            </Collapse>
        </>
    );
}

export { HomePageRiddleListTable, CloseRiddleListTable, OpenRiddleListTable, OwnRiddleListTable }