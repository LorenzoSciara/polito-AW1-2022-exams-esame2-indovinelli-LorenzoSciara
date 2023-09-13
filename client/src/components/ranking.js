import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Container, Row, Col, Table } from "react-bootstrap";

function Ranking(props) {
    return (
        <>
            <Container fluid>
                {props.ranking.length !== 0 ?
                    <Row>
                        <Col>
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Position</th>
                                        <th>Name</th>
                                        <th>Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        props.ranking.map((row) => <RankingTableRow row={row} key={row.id} />)
                                    }
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    : <p>The list is empty</p>
                }
            </Container>
        </>
    );
}

function RankingTableRow(props) {
    return (
        <>
            <RankingTableData row={props.row} />
        </>
    );
}

function RankingTableData(props) {
    return (
        <>
            <tr>
                <td>{props.row.position}</td>
                <td>{props.row.name}</td>
                <td>{props.row.points}</td>
            </tr>
        </>
    );
}


export { Ranking }