import React from 'react';
import { withFormik } from 'formik';
import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import projectSchema from '../../schemas/projectSchema';

const ProjectFormStart = (props) => {
    const { isSubmitting, handleBlur, handleChange, handleSubmit } = props;
    return (
        <>
            <Row className="mt-2">
                <Col className="text-center">
                    <h3>Please select an organization to start</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <form onSubmit={handleSubmit}>
                        <Row className="mt-2">
                            <Col>
                                <label htmlFor="organization">Organization</label>
                                <select
                                    name="organization"
                                    className="form-control"
                                    onChange={handleChange}
                                    onBlur={handleBlur}>
                                    <option>Please select an organization</option>
                                    <option value={props.org.id}>{props.org.name}</option>
                                </select>
                            </Col>
                        </Row>
                        <Row className="mt-3 align-items-center">
                            <Col>
                                <button
                                    type="submit"
                                    className="btn btn-success float-end col-3"
                                    disabled={isSubmitting}>
                                    Start
                                </button>
                            </Col>
                        </Row>
                    </form>
                </Col>
            </Row>
        </>
    );
};

ProjectFormStart.propTypes = {
    values: PropTypes.shape({
        organization: PropTypes.string.isRequired,
    }),
    org: PropTypes.shape({
        businessPhone: PropTypes.string,
        id: PropTypes.number,
        logo: PropTypes.string,
        name: PropTypes.string,
    }).isRequired,
    touched: PropTypes.shape({}),
    errors: PropTypes.shape({
        organization: PropTypes.string,
    }),
    isSubmitting: PropTypes.bool,
    handleBlur: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    nextLabel: PropTypes.string.isRequired,
    onNext: PropTypes.func.isRequired,
};

export default withFormik({
    mapPropsToValues: (props) => ({
        organization: props.formData.organization,
    }),

    validationSchema: projectSchema.projectStartSchema,

    handleSubmit: (values, { props }) => {
        props.onNext(values);
    },
})(ProjectFormStart);
