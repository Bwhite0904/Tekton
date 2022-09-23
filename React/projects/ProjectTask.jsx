import React from 'react';
import PropTypes from 'prop-types';
import { Accordion, Col, Row } from 'react-bootstrap';

const ProjectTask = (props) => {
    return (
        <Accordion.Item eventKey={`task_${props.index}`}>
            <Accordion.Header>{props.task.taskName}</Accordion.Header>
            <Accordion.Body>
                <Row className="align-items-center mt-1 project-preview-row">
                    <Col>
                        <h4>Task Type</h4>
                    </Col>
                    <Col>
                        <h4>{props.task.taskType}</h4>
                    </Col>
                </Row>
                <Row className="align-items-center mt-1 project-preview-row">
                    <Col>
                        <h4>Contact Name</h4>
                    </Col>
                    <Col>
                        <h4>{props.task.taskContactName}</h4>
                    </Col>
                </Row>
                <Row className="align-items-center mt-1 project-preview-row">
                    <Col>
                        <h4>Contact Phone</h4>
                    </Col>
                    <Col>
                        <h4>{props.task.taskContactPhone}</h4>
                    </Col>
                </Row>
                <Row className="align-items-center mt-1 project-preview-row">
                    <Col>
                        <h4>Contact Email</h4>
                    </Col>
                    <Col>
                        <h4>{props.task.taskContactEmail}</h4>
                    </Col>
                </Row>
                <Row className="align-items-center mt-1 project-preview-row">
                    <Col>
                        <h4>Estimated Start Date</h4>
                    </Col>
                    <Col>
                        <h4>{props.task.taskDateStart}</h4>
                    </Col>
                </Row>
                <Row className="align-items-center mt-1 project-preview-row">
                    <Col>
                        <h4>Estimated End Date</h4>
                    </Col>
                    <Col>
                        <h4>{props.task.taskDateEnd}</h4>
                    </Col>
                </Row>
                <Row className="align-items-center mt-1 project-preview-row">
                    <Col>
                        <h4>Awarded To</h4>
                    </Col>
                    <Col>
                        <h4>{props.task.awardedTo}</h4>
                    </Col>
                </Row>
                <Row className="align-items-center mt-1 project-preview-row">
                    <Col>
                        <h4>Description</h4>
                        <p>{props.task.taskDescription}</p>
                    </Col>
                </Row>
            </Accordion.Body>
        </Accordion.Item>
    );
};

ProjectTask.propTypes = {
    task: PropTypes.shape({
        taskType: PropTypes.string.isRequired,
        taskName: PropTypes.string.isRequired,
        taskDescription: PropTypes.string.isRequired,
        taskDateStart: PropTypes.string.isRequired,
        taskDateEnd: PropTypes.string.isRequired,
        taskContactName: PropTypes.string.isRequired,
        taskContactPhone: PropTypes.string.isRequired,
        taskContactEmail: PropTypes.string.isRequired,
        awardedTo: PropTypes.string.isRequired,
    }),
    index: PropTypes.number,
};

export default ProjectTask;
