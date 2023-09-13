import 'bootstrap/dist/css/bootstrap.min.css';
import { ListGroup } from "react-bootstrap";
import { useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';

function SideBar(props) {

    const { filter } = useParams();
    let f;
    if(filter !== undefined) { //considera il caso in cui mi trovo in "/" invece di "/homePage" o "/loggedInPage"
        f=filter;
    }
    else {
        f="riddles"
    }
    const [selectedFilter, setSelectedFilter] = useState(f);
    const navigate = useNavigate();

    return (
        props.loggedIn ?
            <ListGroup variant="flush">
                {selectedFilter === "riddles" ? <ListGroup.Item className="bg-secondary text-white" active><h5>Riddles</h5></ListGroup.Item> : <ListGroup.Item action onClick={() => { setSelectedFilter("riddles"); navigate(`/loggedInPage/riddles`) }}><h5>Riddles</h5></ListGroup.Item>}
                {selectedFilter === "ranking" ? <ListGroup.Item className="bg-secondary text-white" active><h5>Ranking</h5></ListGroup.Item> : <ListGroup.Item action onClick={() => { setSelectedFilter("ranking"); navigate(`/loggedInPage/ranking`) }}><h5>Ranking</h5></ListGroup.Item>}
            </ListGroup>
            : <ListGroup variant="flush">
                {selectedFilter === "riddles" ? <ListGroup.Item className="bg-secondary text-white" active><h5>Riddles</h5></ListGroup.Item> : <ListGroup.Item action onClick={() => { setSelectedFilter("riddles"); navigate(`/homePage/riddles`) }}><h5>Riddles</h5></ListGroup.Item>}
                {selectedFilter === "ranking" ? <ListGroup.Item className="bg-secondary text-white" active><h5>Ranking</h5></ListGroup.Item> : <ListGroup.Item action onClick={() => { setSelectedFilter("ranking"); navigate(`/homePage/ranking`) }}><h5>Ranking</h5></ListGroup.Item>}
            </ListGroup>
    );
}

export { SideBar };