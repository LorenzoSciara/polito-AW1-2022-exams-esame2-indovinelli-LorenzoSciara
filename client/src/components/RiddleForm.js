import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';

function RiddleForm(props) {
    
    const [question, setQuestion] = useState('');
    const [difficulty, setDifficulty] = useState('easy');
    const [duration, setDuration] = useState(30);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [suggestion1, setSuggestion1] = useState('');
    const [suggestion2, setSuggestion2] = useState('');

    const [errorMsg, setErrorMsg] = useState('');  // stringa vuota '' = non c'e' errore

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        let check = true;

        if (question === undefined || question === '' || question === null) {
            setErrorMsg('Error! No question has been entered.');
            check = false;
        }

        else if (difficulty !== "easy" && difficulty !== "medium" && difficulty!=="hard") {
            setErrorMsg('Error! Wrong difficulty.');
            check = false;
        }

        else if (duration< 30 || duration> 600) {
            setErrorMsg('Error! duration; the duration must be between 30 and 600.');
            check = false;
        }

        else if (correctAnswer === undefined || correctAnswer === '' || correctAnswer === null) {
            setErrorMsg('Error! No correct answer has been entered.');
            check = false;
        }

        else if (suggestion1 === undefined || suggestion1 === '' || suggestion1 === null) {
            setErrorMsg('Error! The first suggestion has not been entered.');
            check = false;
        }

        else if (suggestion2 === undefined || suggestion2 === '' || suggestion2 === null) {
            setErrorMsg('Error! The second suggestion has not been entered.');
            check = false;
        }
        //ADD
        if (check && question !== undefined ) {

            const newRiddle = {
                question: question, difficulty: difficulty, duration: duration, correctAnswer: correctAnswer, suggestion1: suggestion1, suggestion2: suggestion2,
            };
            props.addRiddle(newRiddle);
            setQuestion('');
            setCorrectAnswer('');
            setSuggestion1('');
            setSuggestion2('');
            setErrorMsg('');
            navigate('/loggedInPage/riddles');
        }
    }

    return (
        <>
            <Container>
                <Row>
                    <h2>Form to add new Riddle:</h2>
                </Row>
                <Row>
                    <Col>
                    {errorMsg ? <Alert variant='danger' onClose={() => setErrorMsg('')} dismissible>{errorMsg}</Alert> : false}
                        <Form>
                            <Form.Group>
                                <Form.Label>Question:</Form.Label>
                                <Form.Control required={true} value={question} onChange={ev => setQuestion(ev.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Select difficulty:</Form.Label>
                                <Form.Select required={true} value={difficulty} onChange={ev => setDifficulty(ev.target.value)}>
                                    <option>easy</option>
                                    <option>medium</option>
                                    <option>hard</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Duration (s):</Form.Label>
                                <Form.Control required={true} type='number' min={30} max={600} value={duration} onChange={ev => setDuration(ev.target.value)} />
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Correct answer:</Form.Label>
                                <Form.Control required={true} value={correctAnswer} onChange={ev => setCorrectAnswer(ev.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>First suggestion:</Form.Label>
                                <Form.Control required={true} value={suggestion1} onChange={ev => setSuggestion1(ev.target.value)}></Form.Control>
                            </Form.Group>

                            <Form.Group>
                                <Form.Label>Second suggestion:</Form.Label>
                                <Form.Control required={true} value={suggestion2} onChange={ev => setSuggestion2(ev.target.value)}></Form.Control>
                            </Form.Group>
                            <ul></ul>
                            <div>
                                <Button variant="danger" onClick={() => {
                                    navigate(`/loggedInPage/riddles`); 
                                    setErrorMsg('');
                                }}>Cancel</Button>{" "}

                                <Button variant="success" onClick={handleSubmit}>Save</Button>
                            </div>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export { RiddleForm }