import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const RecentJob = (props) => {
    const description = props.job?.requirements?.slice(0, 600);
    const dateAdded = new Date(props.job.dateCreated).toLocaleDateString();
    return (
        <>
            <Col className="text-center col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <Card className="mt-2 shadow-0">
                    <Card.Body>
                        <Row>
                            <Col>
                                <h3>Recent Job Post</h3>
                            </Col>
                        </Row>
                        <Row className="mt-1">
                            <Col className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                <h4>{props.job.organization?.name}</h4>
                                <img className="admin-recent-img" src={props.job.organization?.logo} alt="" />
                            </Col>
                            <Col className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                <p>{`${description}...`}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <strong>{`Date Added: ${dateAdded}`}</strong>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="mt-1">
                                <Link type="button" className="btn btn-primary col-4" to="/jobs" target="_blank">
                                    View Jobs
                                </Link>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </>
    );
};

RecentJob.propTypes = {
    job: PropTypes.shape({
        organization: PropTypes.shape({
            name: PropTypes.string,
            logo: PropTypes.string,
        }),
        requirements: PropTypes.string,
        dateCreated: PropTypes.string,
    }).isRequired,
};

export default RecentJob;
