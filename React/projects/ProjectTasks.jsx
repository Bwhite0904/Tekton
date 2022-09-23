import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { withFormik, Field, FieldArray, ErrorMessage } from 'formik';
import PropTypes from 'prop-types';
import debug from 'tekton-debug';
import projectSchema from '../../schemas/projectSchema';
import jobsService from '../../services/jobsService';
import './projects.css';

const _logger = debug.extend('ProjectTasks');

const ProjectTasks = (props) => {
    const [typeOptions, setTypeOptions] = useState([]);
    const { values, isSubmitting, handleBlur, handleSubmit, handleChange, backLabel, nextLabel, onBack, errors } =
        props;
    useEffect(() => {
        jobsService.getAllJobTypes(['JobTypes']).then(onGetJobTypesSuccess).catch(onGetJobTypesError);
    }, []);
    const handleBack = () => {
        onBack(values);
    };
    const onGetJobTypesSuccess = (data) => {
        const mappedTypes = data.item.jobTypes.map((type) => {
            return (
                <option key={type.id} value={type.id}>
                    {type.name}
                </option>
            );
        });
        setTypeOptions(mappedTypes);
    };
    const onGetJobTypesError = (e) => {
        _logger(e);
    };
    const mapTasks = (remove, push) => {
        const mapATask = (task, index) => {
            return (
                <div key={`task_${index}`}>
                    <Row className="mt-4">
                        <Col>
                            <Row>
                                <Col>
                                    <label htmlFor="taskType">Task Type</label>
                                </Col>
                                <Col>
                                    <ErrorMessage name={`tasks.${index}.taskType`}>
                                        {(msg) => <div className="error-message float-end">{msg}</div>}
                                    </ErrorMessage>
                                </Col>
                            </Row>
                            <select
                                name={`tasks.${index}.taskType`}
                                className="form-control"
                                onChange={handleChange}
                                onBlur={handleBlur}>
                                <option>Please select a task type</option>
                                {typeOptions}
                            </select>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <label htmlFor="taskName">Task Name</label>
                                </Col>
                                <Col>
                                    <ErrorMessage name={`tasks.${index}.taskName`}>
                                        {(msg) => <div className="error-message float-end">{msg}</div>}
                                    </ErrorMessage>
                                </Col>
                            </Row>
                            <Field
                                type="text"
                                onBlur={handleBlur}
                                name={`tasks.${index}.taskName`}
                                className="form-control"
                            />
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col>
                            <Row>
                                <Col>
                                    <label htmlFor="taskContactName">Contact Name</label>
                                </Col>
                                <Col>
                                    <ErrorMessage name={`tasks.${index}.taskContactName`}>
                                        {(msg) => <div className="error-message float-end">{msg}</div>}
                                    </ErrorMessage>
                                </Col>
                            </Row>
                            <Field
                                type="text"
                                onBlur={handleBlur}
                                name={`tasks.${index}.taskContactName`}
                                className="form-control"
                            />
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <label htmlFor="taskContactPhone">{`Contact Phone (optional)`}</label>
                                </Col>
                                <Col>
                                    <ErrorMessage name={`tasks.${index}.taskContactPhone`}>
                                        {(msg) => <div className="error-message float-end">{msg}</div>}
                                    </ErrorMessage>
                                </Col>
                            </Row>
                            <Field
                                type="text"
                                onBlur={handleBlur}
                                name={`tasks.${index}.taskContactPhone`}
                                className="form-control"
                            />
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <label htmlFor="taskContactEmail">{`Contact Email (optional)`}</label>
                                </Col>
                                <Col>
                                    <ErrorMessage name={`tasks.${index}.taskContactEmail`}>
                                        {(msg) => <div className="error-message float-end">{msg}</div>}
                                    </ErrorMessage>
                                </Col>
                            </Row>
                            <Field
                                type="email"
                                onBlur={handleBlur}
                                name={`tasks.${index}.taskContactEmail`}
                                className="form-control"
                            />
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col>
                            <Row>
                                <Col>
                                    <label htmlFor="taskDateStart">Estimated Start Date</label>
                                </Col>
                                <Col>
                                    <ErrorMessage name={`tasks.${index}.taskDateStart`}>
                                        {(msg) => <div className="error-message float-end">{msg}</div>}
                                    </ErrorMessage>
                                </Col>
                            </Row>
                            <Field
                                type="date"
                                className="form-control"
                                name={`tasks.${index}.taskDateStart`}
                                onBlur={handleBlur}
                            />
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <label htmlFor="taskDateEnd">Estimated End Date</label>
                                </Col>
                                <Col>
                                    <ErrorMessage name={`tasks.${index}.taskDateEnd`}>
                                        {(msg) => <div className="error-message float-end">{msg}</div>}
                                    </ErrorMessage>
                                </Col>
                            </Row>
                            <Field
                                type="date"
                                className="form-control"
                                name={`tasks.${index}.taskDateEnd`}
                                onBlur={handleBlur}
                            />
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <label htmlFor="awardedTo">{`Awarded to (optional)`}</label>
                                </Col>
                                <Col>
                                    <ErrorMessage name={`tasks.${index}.awardedTo`}>
                                        {(msg) => <div className="error-message float-end">{msg}</div>}
                                    </ErrorMessage>
                                </Col>
                            </Row>
                            <select
                                name={`tasks.${index}.awardedTo`}
                                className="form-control"
                                onChange={handleChange}
                                onBlur={handleBlur}>
                                <option>Please select an Organization</option>
                                <option value="Tekton">Tekton</option>
                            </select>
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col>
                            <Row>
                                <Col>
                                    <label htmlFor="taskDescription">Task Description</label>
                                </Col>
                                <Col>
                                    <ErrorMessage name={`tasks.${index}.taskDescription`}>
                                        {(msg) => <div className="error-message float-end">{msg}</div>}
                                    </ErrorMessage>
                                </Col>
                            </Row>
                            <Field
                                as="textarea"
                                rows="8"
                                type="text"
                                onBlur={handleBlur}
                                name={`tasks.${index}.taskDescription`}
                                className="form-control"
                            />
                        </Col>
                    </Row>
                    <Row className="mt-2">
                        <Col>
                            {props.values.tasks.length > 1 && (
                                <button type="button" className="btn btn-secondary" onClick={() => remove(index)}>
                                    Remove Task
                                </button>
                            )}
                        </Col>
                        <Col>
                            <button
                                type="button"
                                className="btn btn-warning float-end"
                                disabled={!errors}
                                onClick={() =>
                                    push({
                                        taskType: '',
                                        taskName: '',
                                        taskContactName: '',
                                        taskContactPhone: '',
                                        taskContactEmail: '',
                                        taskDateStart: '',
                                        taskDateEnd: '',
                                        awardedTo: '',
                                        taskDescription: '',
                                    })
                                }>
                                Add another Task
                            </button>
                        </Col>
                    </Row>
                </div>
            );
        };
        return props.values.tasks.map(mapATask);
    };

    return (
        <>
            <Row className="mt-2">
                <Col className="text-center">
                    <h3>{`Add tasks to your project (optional)`}</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <form onSubmit={handleSubmit}>
                        <FieldArray name="tasks">
                            {({ remove, push }) => (
                                <div>{props.values.tasks?.length > 0 && mapTasks(remove, push)}</div>
                            )}
                        </FieldArray>
                        <Row className="mt-3">
                            <Col>
                                <button
                                    type="submit"
                                    className="btn btn-secondary col-6"
                                    onClick={handleBack}
                                    disabled={isSubmitting}>
                                    {backLabel}
                                </button>
                            </Col>
                            <Col>
                                <button
                                    type="submit"
                                    className="btn btn-primary col-6 float-end"
                                    disabled={isSubmitting}>
                                    {nextLabel}
                                </button>
                            </Col>
                        </Row>
                    </form>
                </Col>
            </Row>
        </>
    );
};

ProjectTasks.propTypes = {
    values: PropTypes.shape({
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
    }),
    touched: PropTypes.shape({}),
    errors: PropTypes.shape({
        tasks: PropTypes.arrayOf(
            PropTypes.shape({
                taskType: PropTypes.string,
                taskName: PropTypes.string,
                taskDescription: PropTypes.string,
                taskDateStart: PropTypes.string,
                taskDateEnd: PropTypes.string,
                taskContactName: PropTypes.string,
                taskContactPhone: PropTypes.string,
                taskContactEmail: PropTypes.string,
                awardedTo: PropTypes.string,
            }).isRequired
        ),
    }).isRequired,
    isSubmitting: PropTypes.bool,
    handleBlur: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    backLabel: PropTypes.string.isRequired,
    nextLabel: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
};

export default withFormik({
    mapPropsToValues: (props) => ({
        tasks: [
            {
                taskName: props.formData.tasks[0].taskName,
                taskType: props.formData.tasks[0].taskType,
                taskDescription: props.formData.tasks[0].taskDescription,
                taskDateStart: props.formData.tasks[0].taskDateStart,
                taskDateEnd: props.formData.tasks[0].taskDateEnd,
                taskContactName: props.formData.tasks[0].taskContactName,
                taskContactPhone: props.formData.tasks[0].taskContactPhone,
                taskContactEmail: props.formData.tasks[0].taskContactEmail,
                awardedTo: props.formData.tasks[0].awardedTo,
            },
        ],
    }),

    validationSchema: projectSchema.projectTaskSchema,

    handleSubmit: (values, { props }) => {
        props.onNext(values);
    },
})(ProjectTasks);
