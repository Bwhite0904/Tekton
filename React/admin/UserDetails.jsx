import React, { useEffect, useState } from 'react';
import debug from 'sabio-debug';
import { Card, Col, Row } from 'react-bootstrap';
import licenseService from '../../../services/anotherLicenseService';
import employeesService from '../../../services/employeeService';

import PropTypes from 'prop-types';

const _logger = debug.extend('UserDetails');

const UserDetails = (props) => {
    const [licenses, updateLicenses] = useState(null);
    const [employeeInfo, updateEmployeeInfo] = useState(null);
    const [organization, setOrganization] = useState('None');
    useEffect(() => {
        licenseService
            .getByUserProfileId(props.data.userProfile.id, 0, 4)
            .then(onGetLicensesSuccess)
            .catch(onAxiosError);
        if (props.userRoles.includes('Employee')) {
            employeesService
                .getByUserProfile(props.data.userProfile.id)
                .then(onGetEmployeeInfoSuccess)
                .catch(onAxiosError);
        }
    }, []);
    const onGetLicensesSuccess = (data) => {
        const lic = data.item.pagedItems.map((license) => {
            const formattedDate = new Date(license.dateCreated).toLocaleDateString();
            _logger(license);
            return (
                <div key={`license_${license.id}`}>
                    <Row className="license-info mb-2">
                        <Col>
                            <h5>{`Date Submitted: ${formattedDate}`}</h5>
                        </Col>
                        <Col>
                            <h5>{`Type: ${license.licenseType.name}`}</h5>
                        </Col>
                        <Col>
                            <h5>{`State: ${license.stateType.name}`}</h5>
                        </Col>
                        <Col>
                            <h5>{`Status: ${license.validationType.name}`}</h5>
                        </Col>
                        <Col>
                            {license.rejectMessage !== null ? <h5>{`Reason: ${license.rejectMessage}`}</h5> : <></>}
                        </Col>
                    </Row>
                </div>
            );
        });
        updateLicenses(lic);
    };
    const onGetEmployeeInfoSuccess = (data) => {
        const empInfo = (
            <Row>
                <Col>
                    <h5>{`Organization: ${data.item.organizationName}`}</h5>
                </Col>
                <Col>
                    <h5>{`Position: ${data.item.position}`}</h5>
                </Col>
            </Row>
        );
        setOrganization(data.item.organizationName);
        updateEmployeeInfo(empInfo);
    };
    const onAxiosError = (e) => {
        _logger(e);
    };
    return (
        <>
            <div key={`user_${props.data.userProfile.userId}`}>
                <Row className="mt-2">
                    <Col className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-4">
                        <Card className="user-info-card">
                            <Card.Header className="user-info-card-header text-center align-items-center">
                                <h2>User Info</h2>
                            </Card.Header>
                            <Card.Body>
                                <Row className="mb-4">
                                    <Col className="text-center">
                                        <img
                                            className="manage-users-details-img"
                                            src={props.data.userProfile.avatarUrl}
                                            alt=""
                                        />
                                    </Col>
                                </Row>
                                <Row className="user-details mt-2">
                                    <h4>{`Name: ${props.data.userProfile.firstName} ${props.data.userProfile.lastName}`}</h4>
                                </Row>
                                <Row className="user-details">
                                    <h4>{`Email: ${props.data.email}`}</h4>
                                </Row>
                                <Row className="user-details">
                                    <h4>{`Status: ${props.data.status}`}</h4>
                                </Row>
                                <Row className="user-details">
                                    <h4>{`Roles: ${props.userRoles}`}</h4>
                                </Row>
                                <Row className="user-details">
                                    <h4>{`Date Joined: ${props.formattedDate}`}</h4>
                                </Row>
                                <Row className="user-details">
                                    <h4>{`Organization: ${organization}`}</h4>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-8">
                        <Card className="user-info-card">
                            <Card.Header className="user-info-card-header text-center align-items-center">
                                <h2>Activity</h2>
                            </Card.Header>
                            <Card.Body>
                                {!props.userRoles.includes('Employee') ? (
                                    <Row>
                                        <Col>
                                            <Card>
                                                <Card.Body>
                                                    <h3>Jobs</h3>
                                                    <p>User has no Recent Jobs</p>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                ) : (
                                    <Row>
                                        <Col>
                                            <Card>
                                                <Card.Body>
                                                    <h3 className="license-info">Employee Information</h3>
                                                    {employeeInfo === null ? <p>Employee has no info</p> : employeeInfo}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                )}
                                <Row>
                                    <Col>
                                        <Card>
                                            <Card.Body>
                                                <h3 className="license-info">Recent Licenses</h3>
                                                {licenses === null ? <p>User has no Recent Licenses</p> : licenses}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </>
    );
};

UserDetails.propTypes = {
    data: PropTypes.shape({
        email: PropTypes.string.isRequired,
        status: PropTypes.string.isRequired,
        userProfile: PropTypes.shape({
            id: PropTypes.number,
            userId: PropTypes.number,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            avatarUrl: PropTypes.string,
        }).isRequired,
    }),
    formattedDate: PropTypes.string.isRequired,
    userRoles: PropTypes.string.isRequired,
};

export default UserDetails;
