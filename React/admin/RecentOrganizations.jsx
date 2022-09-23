import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Dropdown } from 'react-bootstrap';

import './admindashboard.css';

import { MdMoreVert } from 'react-icons/md';

import PropTypes from 'prop-types';

import debug from 'sabio-debug';

const _logger = debug.extend('RecentOrganizations');

const RecentOrganizations = (props) => {
    const [recentOrgs, updateRecentOrgs] = useState([]);

    useEffect(() => {
        const mappedOrgs = props.orgs.map(mapRecentOrgs);
        updateRecentOrgs(mappedOrgs);
    }, [props.orgs]);
    const mapRecentOrgs = (org) => {
        _logger(org);
        const formattedDate = new Date(org.dateCreated).toLocaleDateString();
        return (
            <div key={`org_${org.id}`}>
                <Row>
                    <Col className="text-center">
                        <p className="recent-orgs-data">{org.name}</p>
                    </Col>
                    <Col className="text-center">
                        <p className="recent-orgs-data">{org.employeesNumber}</p>
                    </Col>
                    <Col className="text-center">
                        <p className="recent-orgs-data">{formattedDate}</p>
                    </Col>
                    <Col className="col-1">
                        <Dropdown className="float-end">
                            <Dropdown.Toggle
                                variant="light"
                                className="dropdown-users-manage bg-transparent border-0 p-0"
                                id="dropdown-users-manage">
                                <MdMoreVert className="float-end manage-users-icons" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                <Dropdown.Item>Approve</Dropdown.Item>
                                <Dropdown.Item>Details</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Row>
            </div>
        );
    };
    return (
        <>
            <Col className="col-12 text-center">
                <Card className="col mt-2 shadow-0">
                    <Card.Body>
                        <Row>
                            <h4>Recent Organizations</h4>
                        </Row>
                        <Row className="mt-1">
                            <ul>
                                <Row className="admin-recent-orgs align-items-center mb-1">
                                    <Col className="text-center">
                                        <strong>Company Name</strong>
                                    </Col>
                                    <Col className="text-center">
                                        <strong>Employee Count</strong>
                                    </Col>
                                    <Col className="text-center">
                                        <strong>Date Joined</strong>
                                    </Col>
                                    <Col className="col-1">
                                        <strong className="invisible">PLACEHOLDER</strong>
                                    </Col>
                                </Row>
                                {recentOrgs}
                            </ul>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </>
    );
};

RecentOrganizations.propTypes = {
    orgs: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            logo: PropTypes.string,
            name: PropTypes.string,
            employeesNumber: PropTypes.number,
            dateCreated: PropTypes.string,
        })
    ).isRequired,
};

export default RecentOrganizations;
