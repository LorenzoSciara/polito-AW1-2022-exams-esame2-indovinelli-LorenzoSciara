import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useState } from "react";
import { Timer } from "./timer";

function AnswerToRiddleForm(props) {
    const [answer, setAnswer] = useState('');

    const [errorMsg, setErrorMsg] = useState('');  // stringa vuota ('') = non c'e' errore

    const handleSubmit = (event) => {
        event.preventDefault();
        let check = true;

        if (answer === undefined || answer === '' || answer === null) {
            setErrorMsg('Error! No answer has been entered.');
            check = false;
        }
        //ADD
        if (check && answer !== undefined) {
            const newAnswer = { answer: answer, userid: props.user.userid, riddleid: props.riddle.riddleid, };
            props.addAnswer(newAnswer);
            setErrorMsg('');
        }
    }

    const handleCancel = (event) => {
        event.preventDefault();
        setAnswer('');
        setErrorMsg('');
        props.setOpen(false);
    }
    return (
        <>
            {
                props.answer ?
                    <Container>
                        <Row>
                            <h5>Your answer to the selected riddle:<p>is:{' '}{props.answer.answer}</p></h5>
                        </Row>
                        <Row>
                            <Col>
                                <Form>

                                    <ul></ul>
                                    <div>
                                        <Button variant="danger" onClick={handleCancel}>Cancel</Button>
                                    </div>
                                </Form>
                            </Col>
                        </Row>
                    </Container>
                    :
                    <Container>
                        <Row>
                            <Col>
                                <h5>Answer to the selected riddle</h5>
                            </Col>
                            {props.riddle.remainingTime !== null ?
                                <Col>
                                    <Timer time={props.riddle.remainingTime} />
                                </Col>
                                : false
                            }
                        </Row>
                        <Row>
                            {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Form.Group>
                                        <Form.Label>Answer:</Form.Label>
                                        <Form.Control required={true} value={answer} onChange={ev => setAnswer(ev.target.value)}></Form.Control>
                                    </Form.Group>
                                </Row>
                                <ul></ul>
                                {props.riddle.remainingTime !== null && props.riddle.remainingTime < (props.riddle.duration / 2000) ?
                                    <div>
                                        <Row>
                                            <p>First suggestion: {props.riddle.suggestion1}</p>
                                        </Row>
                                        {props.riddle.remainingTime !== null && props.riddle.remainingTime < (props.riddle.duration / 4000) ?
                                        <Row>
                                            <p>Second suggestion: {props.riddle.suggestion2}</p>
                                        </Row>
                                        : false
                                        }
                                    </div>
                                    : false
                                }
                                <ul></ul>
                                <Button variant="danger" onClick={handleCancel}>Cancel</Button>{" "}
                                <Button variant="success" onClick={handleSubmit}>Save</Button>
                            </Form>
                        </Row>
                    </Container>
            }
        </>
    );
}

export { AnswerToRiddleForm }