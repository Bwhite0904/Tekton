import React, { useState, useEffect } from 'react';
import Loki from 'react-loki';
import { Card, Col, Container, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import toastr from 'toastr';
import debug from 'sabio-debug';

import { FaPlay } from 'react-icons/fa';
import { BsListCheck } from 'react-icons/bs';
import { TbCheckbox } from 'react-icons/tb';
import { MdCreate } from 'react-icons/md';

import ProjectInfo from './ProjectInfo';
import ProjectTasks from './ProjectTasks';
import ProjectPreview from './ProjectPreview';
import ProjectFormStart from './ProjectFormStart';

import jobsService from '../../services/jobsService';
import locationService from '../../services/locationService';
import organizationService from '../../services/organizationService';

import './projects.css';

const _logger = debug.extend('ProjectForm');

const ProjectForm = (props) => {
    const [formData, setFormData] = useState({
        name: '',
        dateStart: '',
        description: '',
        organization: '',
        tasks: [
            {
                taskType: '',
                taskName: '',
                taskDescription: '',
                taskDateStart: '',
                taskDateEnd: '',
                taskContactName: '',
                taskContactPhone: '',
                taskContactEmail: '',
                awardedTo: '',
            },
        ],
        locationTypeId: '',
        locationId: 0,
        lineOne: '',
        lineTwo: '',
        city: '',
        zip: '',
        stateId: 0,
        latitude: 0,
        longitude: 0,
        state: '',
    });
    const [locationTypes, setLocationTypes] = useState([]);
    const [stateTypes, setStateTypes] = useState([]);
    const [org, setOrgs] = useState({});
    const tableNameL = ['LocationTypes'];
    useEffect(() => {
        if (locationTypes.length === 0) {
            jobsService.getAllLocationTypes(tableNameL).then(onGetAllLocationTypesSuccess).catch(onAxiosError);
        }
        if (stateTypes.length === 0) {
            locationService.getStates().then(onGetAllStatesTypesSuccess).catch(onAxiosError);
        }
        organizationService.getOrganizationByUserId(props.currentUser.id).then(onGetOrgSuccess).catch(onAxiosError);
    }, []);

    const mergeValues = (values) => {
        setFormData((prevState) => {
            const projectData = { ...prevState, ...values };
            return projectData;
        });
    };
    const onGetAllLocationTypesSuccess = (response) => {
        const array = response.item.locationTypes;
        const locationTypes = [];

        for (let i = 0; i < array.length; i++) {
            const locationType = array[i];
            locationTypes.push(locationType);
        }
        setLocationTypes(locationTypes);
    };
    const onGetAllStatesTypesSuccess = (response) => {
        const array = response.items;
        const types = [];
        for (let i = 0; i < array.length; i++) {
            const stateType = array[i];
            types.push(stateType);
        }
        setStateTypes(types);
    };
    const onGetOrgSuccess = (data) => {
        setOrgs(data.item);
    };
    const onAxiosError = (e) => {
        _logger(e);
        toastr.error(e);
    };

    const complexSteps = [
        {
            label: 'Step 0',
            icon: <FaPlay className="mt-3" />,
            component: <ProjectFormStart formData={formData} org={org} />,
        },
        {
            label: 'Step 1',
            icon: <MdCreate className="mt-3" />,
            component: <ProjectInfo formData={formData} locations={locationTypes} states={stateTypes} />,
        },
        {
            label: 'Step 2',
            icon: <BsListCheck className="mt-3" />,
            component: <ProjectTasks formData={formData} />,
        },
        {
            label: 'Step 3',
            icon: <TbCheckbox className="mt-3" />,
            component: <ProjectPreview formData={formData} org={org} user={props.currentUser} />,
        },
    ];

    return (
        <Container className="mt-4">
            <h1 className="mb-4">Create a Project</h1>
            <Row>
                <Col>
                    <Card className="col-sm-12 col-lg-12">
                        <Card.Body className="project-form-content">
                            <div className="project-loki">
                                <Loki
                                    steps={complexSteps}
                                    onNext={mergeValues}
                                    onBack={mergeValues}
                                    noActions
                                    onFinish={mergeValues}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

ProjectForm.propTypes = {
    currentUser: PropTypes.shape({
        email: PropTypes.string,
        id: PropTypes.number,
        isLoggedIn: PropTypes.bool,
        roles: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
};

export default ProjectForm;
