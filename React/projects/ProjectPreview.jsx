import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Accordion, Card, Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ProjectTask from './ProjectTask';
import debug from 'sabio-debug';
import toastr from 'toastr';
import './projects.css';
import projectService from '../../services/projectService';
import Swal from 'sweetalert2';

const _logger = debug.extend('ProjectPreview');

const ProjectPreview = (props) => {
    const [tasks, updateTasks] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        if (props.formData.tasks[0].taskType !== '') {
            const mappedTasks = props.formData.tasks.map((task, index) => {
                return <ProjectTask task={task} index={index} key={`task_${index}`} />;
            });
            updateTasks(mappedTasks);
        }
    }, []);
    const { onBack } = props;
    const handleBack = () => {
        onBack(props.formData);
    };
    const onSubmitClick = () => {
        const payload = {
            locationId: props.formData.locationId,
            organizationId: props.org.id,
            name: props.formData.name,
            estimatedStartDate: props.formData.dateStart,
            description: props.formData.description,
        };
        projectService.addProject(payload).then(onAddProjectSuccess).catch(onAddProjectError);
    };

    const onAddProjectSuccess = async (data) => {
        if (props.formData.tasks.length > 0) {
            const mappedTasks = props.formData.tasks.map((task) => {
                const formattedTask = {
                    projectId: data.item,
                    taskTypeId: parseInt(task.taskType, 10),
                    name: task.taskName,
                    description: task.taskDescription,
                    contactName: task.taskContactName,
                    contactPhone: task.taskContactPhone.length > 0 ? task.taskContactPhone : null,
                    contactEmail: task.taskContactEmail.length > 0 ? task.taskContactPhone : null,
                    estimatedStartDate: task.taskDateStart,
                    estimatedFinishDate: task.taskDateEnd.length > 0 ? task.taskDateEnd : null,
                    createdBy: props.user.id,
                    modifiedBy: null,
                    parentTaskId: null,
                    awardedOrgId: task.awardedTo.length > 0 ? task.awardedOrgId.parseInt() : null,
                };
                return formattedTask;
            });
            projectService.addProjectTasks(mappedTasks).then(onTasksAddSuccess).catch(onTasksAddError);
        } else {
            const result = await Swal.fire({
                icon: 'success',
                text: 'Project created!',
                confirmButtonText: 'Okay',
            });
            if (result.isDissmissed || result.isConfirmed) {
                navigate('/dashboard/organizations');
            }
        }
    };
    const onTasksAddSuccess = async () => {
        const result = await Swal.fire({
            icon: 'success',
            text: 'Project created!',
            confirmButtonText: 'Okay',
        });
        _logger(result);
        if (result.isDismissed || result.isConfirmed) {
            navigate('/dashboard/organizations');
        }
    };
    const onAddProjectError = (e) => {
        _logger(e);
        toastr.error('Unable to create project');
    };
    const onTasksAddError = (e) => {
        _logger(e);
        toastr.error('Unable to add project tasks');
    };
    return (
        <>
            <Row>
                <Col className="text-center">
                    <h3>Project Preview</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Row>
                                <Col className="text-center">
                                    <img src={props.org.logo} alt="..." />
                                    <h4>{props.org.name}</h4>
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <h3>Project Info</h3>
                            </Row>
                            <Row className="align-items-center mt-1 project-preview-row">
                                <Col>
                                    <h5>Project Name</h5>
                                </Col>
                                <Col>
                                    <strong>{props.formData.name}</strong>
                                </Col>
                            </Row>
                            <Row className="align-items-center mt-1 project-preview-row">
                                <Col>
                                    <h5>Projected Start Date</h5>
                                </Col>
                                <Col>
                                    <strong>{props.formData.dateStart}</strong>
                                </Col>
                            </Row>
                            <Row className="align-items-center mt-1 project-preview-row">
                                <Col>
                                    <h5>Project Description</h5>
                                </Col>
                                <Col>
                                    <strong>{props.formData.description}</strong>
                                </Col>
                            </Row>
                            <Row className="align-items-center mt-1 project-preview-row">
                                <Col>
                                    <h5>Project Loaction</h5>
                                </Col>
                                <Col>
                                    <Row>
                                        <strong>{props.formData.lineOne}</strong>
                                    </Row>
                                    <strong>
                                        {`${props.formData.city}, ${props.formData.state} 
                                        ${props.formData.zip}`}
                                    </strong>
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <h3>Tasks</h3>
                            </Row>
                            <Row>
                                <Accordion>{tasks}</Accordion>
                            </Row>
                            <Row className="mt-3">
                                <Col>
                                    <button type="submit" className="btn btn-secondary col-6" onClick={handleBack}>
                                        Back
                                    </button>
                                </Col>
                                <Col>
                                    <button
                                        type="submit"
                                        className="btn btn-success col-6 float-end"
                                        onClick={onSubmitClick}>
                                        Submit
                                    </button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

ProjectPreview.propTypes = {
    formData: PropTypes.shape({
        name: PropTypes.string.isRequired,
        dateStart: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        organization: PropTypes.string.isRequired,
        locationId: PropTypes.number.isRequired,
        tasks: PropTypes.arrayOf(
            PropTypes.shape({
                taskType: PropTypes.string.isRequired,
                taskName: PropTypes.string.isRequired,
                taskDescription: PropTypes.string.isRequired,
                taskDateStart: PropTypes.string.isRequired,
                taskDateEnd: PropTypes.string.isRequired,
                taskContactName: PropTypes.string.isRequired,
                taskContactPhone: PropTypes.string.isRequired,
                taskContactEmail: PropTypes.string.isRequired,
                awardedTo: PropTypes.string.isRequired,
            })
        ),
        lineOne: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        zip: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
    }),
    onBack: PropTypes.func,
    org: PropTypes.shape({
        businessPhone: PropTypes.string,
        id: PropTypes.number,
        logo: PropTypes.string,
        name: PropTypes.string,
    }),
    user: PropTypes.shape({
        email: PropTypes.string,
        id: PropTypes.number,
        isLoggedIn: PropTypes.bool,
        roles: PropTypes.arrayOf(PropTypes.string),
    }),
};

export default ProjectPreview;
