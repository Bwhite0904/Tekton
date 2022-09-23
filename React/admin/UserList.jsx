import React from 'react';
import { Col, Dropdown, Row } from 'react-bootstrap';
import { MdMoreVert, MdOutlineToggleOff, MdOutlineMail } from 'react-icons/md';
import { FaUserAlt } from 'react-icons/fa';

import PropTypes from 'prop-types';

const UserList = (props) => {
    return (
        <>
            <Row className="align-items-center manage-users-content-container">
                <Col className="manage-users-content text-center">
                    <Row className="align-items-center">
                        <Col>
                            <img
                                className="manage-users-img"
                                src={
                                    props.data?.userProfile.avatarUrl !== null
                                        ? props.data.userProfile.avatarUrl
                                        : '...'
                                }
                                alt="..."></img>
                        </Col>
                        <Col>
                            <h4>{props.data?.userProfile?.firstName}</h4>
                        </Col>
                        <Col>
                            <h4>{props.data?.userProfile?.lastName}</h4>
                        </Col>
                    </Row>
                </Col>
                <Col className="manage-users-content">
                    <h4>{props.data?.email}</h4>
                </Col>
                <Col className="manage-users-content">
                    <h4>{props.userRoles}</h4>
                </Col>
                <Col className="manage-users-content">
                    <Row className="align-items-center">
                        <Col>
                            <h4>{props.userStatus}</h4>
                        </Col>
                        <Col>
                            <Dropdown className="float-end">
                                <Dropdown.Toggle
                                    variant="light"
                                    className="dropdown-users-manage bg-transparent border-0 p-0"
                                    id="dropdown-users-manage">
                                    <MdMoreVert className="manage-users-icons" />
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={props.onEmailClicked}>
                                        <MdOutlineMail /> Email
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={props.onSetActiveClicked}
                                        className={
                                            props.data.status === 'Pending' || props.data.status === 'Inactive'
                                                ? ''
                                                : 'd-none'
                                        }>
                                        <MdOutlineToggleOff /> Set Active
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                        onClick={props.onSetInactiveClicked}
                                        className={
                                            props.data.status === 'Pending' || props.data.status === 'Active'
                                                ? ''
                                                : 'd-none'
                                        }>
                                        <MdOutlineToggleOff /> Set Inactive
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={props.onDetailsClicked}>
                                        <FaUserAlt /> Details
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </>
    );
};

UserList.propTypes = {
    data: PropTypes.shape({
        email: PropTypes.string,
        status: PropTypes.string,
        userProfile: PropTypes.shape({
            userId: PropTypes.number,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            avatarUrl: PropTypes.string,
        }).isRequired,
    }).isRequired,
    onEmailClicked: PropTypes.func.isRequired,
    onSetActiveClicked: PropTypes.func.isRequired,
    onSetInactiveClicked: PropTypes.func.isRequired,
    onDetailsClicked: PropTypes.func.isRequired,
    userRoles: PropTypes.string.isRequired,
    userStatus: PropTypes.string.isRequired,
};

export default UserList;
