import React, { useState } from 'react';
import { withFormik, Field, ErrorMessage } from 'formik';
import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
import projectSchema from '../../schemas/projectSchema';
import locationService from '../../services/locationService';
import toastr from 'toastr';
import debug from 'tekton-debug';
import './projects.css';
import LocationAutoComplete from '../../components/locations/LocationAutoComplete';

const _logger = debug.extend('ProjectInfo');

const ProjectInfo = (props) => {
    const { isSubmitting, handleBlur, handleChange, handleSubmit, backLabel, nextLabel, values } = props;
    const [address, setAddress] = useState({
        lineOne: null,
        city: null,
        stateId: null,
        zip: null,
    });
    const [locationSet, updateLocationSet] = useState(false);
    const handleBack = () => {
        props.onBack(values);
    };
    const locationTypes = props.locations || [];
    const mapLocationTypeId = (locationType, index) => {
        return (
            <option value={locationType.id} key={`locationTypeId_${locationType.id}_${index}`}>
                {locationType.name}
            </option>
        );
    };
    const stateTypes = props.states || [];
    const mapStateTypeId = (stateType, index) => {
        return (
            <option value={stateType.id} key={`locationTypeId_${stateType.id}_${index}`}>
                {stateType.name}
            </option>
        );
    };
    const autoChange = (address) => {
        const stateIndex = stateTypes.findIndex((state) => {
            return state.name === address.state;
        });
        const state = stateTypes[stateIndex];
        const fs = { ...address };
        fs.stateId = state.id;
        fs.locationTypeId = values.locationTypeId;
        props.setValues((prevState) => {
            const location = { ...prevState };
            location.lineOne = fs.lineOne;
            location.city = fs.city;
            location.state = fs.state;
            location.stateId = fs.stateId;
            location.zip = fs.zip;
            return location;
        });
        setAddress((prevState) => {
            const newAddress = {
                ...prevState,
            };
            if (fs.lineOne !== undefined || fs.lineOne !== 'undefined') {
                newAddress.lineOne = fs.lineOne;
            }
            if (fs.city !== undefined || fs.city !== 'undefined') {
                newAddress.city = fs.city;
            }
            if (fs.stateId !== undefined || fs.stateId !== 'undefined') {
                newAddress.stateId = fs.stateId;
            }
            if (fs.zip !== undefined || fs.zip !== 'undefined') {
                newAddress.zip = fs.zip;
            }

            return newAddress;
        });
    };

    const onAddLocation = (e) => {
        e.preventDefault();
        const payload = {
            locationTypeId: values.locationTypeId,
            lineOne: values.lineOne,
            city: values.city,
            zip: values.zip,
            stateId: values.stateId,
            latitude: values.latitude,
            longitude: values.longitude,
        };
        locationService.addLocation(payload).then(onAddLocationSuccess).catch(onAddLocationError);
    };

    const onAddLocationSuccess = (data) => {
        toastr.success('Location Added');
        props.setValues((prevState) => {
            const values = { ...prevState };
            values.locationId = data.item;
            return values;
        });
        updateLocationSet(!locationSet);
    };
    const onAddLocationError = (e) => {
        _logger(e);
        toastr.error('Unable to add location');
    };
    return (
        <>
            <Row className="mt-2">
                <Col className="text-center">
                    <h3>Enter your project information</h3>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col className="text-left">
                    <form onSubmit={handleSubmit}>
                        <Row className="mt-2">
                            <Col>
                                <Row>
                                    <Col>
                                        <label htmlFor="name">Project Name</label>
                                    </Col>
                                    <Col>
                                        <ErrorMessage name="name" className="error-message float-end" component="div" />
                                    </Col>
                                </Row>
                                <Field type="text" className="form-control" name="name" onBlur={handleBlur} />
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col>
                                <Row>
                                    <Col>
                                        <label htmlFor="dateStart">Estimated Start Date</label>
                                    </Col>
                                    <Col>
                                        <ErrorMessage
                                            name="dateStart"
                                            className="error-message float-end"
                                            component="div"
                                        />
                                    </Col>
                                </Row>
                                <Field type="date" className="form-control" name="dateStart" onBlur={handleBlur} />
                            </Col>
                        </Row>
                        <Row className="mt-2">
                            <Col>
                                <Row>
                                    <Col>
                                        <label htmlFor="locationId">Location</label>
                                    </Col>
                                    <Col>
                                        <Field name="locationId" className="d-none" onBlur={handleBlur} />
                                        <ErrorMessage
                                            name="locationId"
                                            className="error-message float-end"
                                            component="div"
                                        />
                                    </Col>
                                </Row>
                                <LocationAutoComplete handleChange={autoChange} />
                            </Col>
                        </Row>
                        {address.lineOne || props.formData.lineOne !== '' ? (
                            <Row className="mt-2">
                                <Col>
                                    <Row>
                                        <Col>
                                            <label htmlFor="lineOne">Address Line One</label>
                                        </Col>
                                        <Col>
                                            <ErrorMessage
                                                name="lineOne"
                                                className="error-message float-end"
                                                component="div"
                                            />
                                        </Col>
                                    </Row>
                                    <Field
                                        placeholder="Line One"
                                        type="text"
                                        className="form-control"
                                        name="lineOne"
                                        onBlur={handleBlur}
                                        disabled
                                    />
                                </Col>
                            </Row>
                        ) : null}
                        {address.city || props.formData.city !== '' ? (
                            <Row className="mt-2">
                                <Col>
                                    <Row>
                                        <Col>
                                            <label htmlFor="city">City</label>
                                        </Col>
                                        <Col>
                                            <ErrorMessage
                                                name="city"
                                                className="error-message float-end"
                                                component="div"
                                            />
                                        </Col>
                                    </Row>
                                    <Field
                                        placeholder="City"
                                        type="text"
                                        disabled
                                        className="form-control"
                                        name="city"
                                        onBlur={handleBlur}
                                    />
                                </Col>
                            </Row>
                        ) : null}
                        {address.stateId || props.formData.stateId !== 0 ? (
                            <Row className="mt-2">
                                <Col>
                                    <Row>
                                        <Col>
                                            <label htmlFor="state">State</label>
                                        </Col>
                                        <Col>
                                            <ErrorMessage
                                                name="state"
                                                className="error-message float-end"
                                                component="div"
                                            />
                                        </Col>
                                    </Row>
                                    <select
                                        className="form-control"
                                        name="stateId"
                                        disabled
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.stateId}>
                                        <option value="">State</option>
                                        {stateTypes.map(mapStateTypeId)}
                                    </select>
                                </Col>
                            </Row>
                        ) : null}
                        {address.zip || props.formData.zip !== '' ? (
                            <Row className="mt-2">
                                <Col>
                                    <Row>
                                        <Col>
                                            <label htmlFor="zip">Zip</label>
                                        </Col>
                                        <Col>
                                            <ErrorMessage
                                                name="zip"
                                                className="error-message float-end"
                                                component="div"
                                            />
                                        </Col>
                                    </Row>
                                    <Field
                                        placeholder="Zip Code"
                                        type="text"
                                        className="form-control"
                                        name="zip"
                                        onBlur={handleBlur}
                                        disabled
                                    />
                                </Col>
                            </Row>
                        ) : null}
                        <Row className="mt-2">
                            <Col>
                                <Row>
                                    <Col>
                                        <label htmlFor="city">Location Type</label>
                                    </Col>
                                    <Col>
                                        <ErrorMessage
                                            name="locationTypeId"
                                            className="error-message float-end"
                                            component="div"
                                        />
                                    </Col>
                                </Row>
                                <select
                                    name="locationTypeId"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className="form-control"
                                    value={values.locationTypeId}>
                                    <option value="">Please select a Location Type</option>
                                    {locationTypes.map(mapLocationTypeId)}
                                </select>
                            </Col>
                        </Row>
                        {address.lineOne !== '' && props.values.locationTypeId !== '' ? (
                            <Row className="mt-2">
                                <Col>
                                    <button
                                        type="button"
                                        className="btn btn-warning float-end"
                                        onClick={onAddLocation}
                                        disabled={locationSet}>
                                        Add Location
                                    </button>
                                </Col>
                            </Row>
                        ) : null}
                        <Row className="mt-2">
                            <Col>
                                <Row>
                                    <Col>
                                        <label htmlFor="description">Project Description</label>
                                    </Col>
                                    <Col>
                                        <ErrorMessage
                                            name="description"
                                            className="error-message float-end"
                                            component="div"
                                        />
                                    </Col>
                                </Row>
                                <Field
                                    as="textarea"
                                    className="form-control"
                                    type="text"
                                    name="description"
                                    rows="10"
                                    onBlur={handleBlur}
                                />
                            </Col>
                        </Row>
                        <Row className="mt-3 align-items-center">
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
                                    className="btn btn-primary float-end col-6"
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

ProjectInfo.propTypes = {
    formData: PropTypes.shape({
        lineOne: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        stateId: PropTypes.number.isRequired,
        zip: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        dateStart: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        locationTypeId: PropTypes.string.isRequired,
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        locationId: PropTypes.number.isRequired,
    }).isRequired,
    values: PropTypes.shape({
        name: PropTypes.string.isRequired,
        dateStart: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        locationTypeId: PropTypes.string.isRequired,
        lineOne: PropTypes.string.isRequired,
        lineTwo: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        stateId: PropTypes.number.isRequired,
        zip: PropTypes.string.isRequired,
        latitude: PropTypes.number.isRequired,
        longitude: PropTypes.number.isRequired,
        locationId: PropTypes.number.isRequired,
    }),
    touched: PropTypes.shape({}),
    errors: PropTypes.shape({
        name: PropTypes.string,
        dateStart: PropTypes.string,
        description: PropTypes.string,
        locationTypeId: PropTypes.string,
        lineOne: PropTypes.string,
        lineTwo: PropTypes.string,
        city: PropTypes.string,
        stateId: PropTypes.string,
        zip: PropTypes.string,
        latitude: PropTypes.string,
        longitude: PropTypes.string,
        locationId: PropTypes.string,
    }),
    isSubmitting: PropTypes.bool,
    handleBlur: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    backLabel: PropTypes.string.isRequired,
    setValues: PropTypes.func,
    nextLabel: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    locations: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
        })
    ),
    states: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number,
            name: PropTypes.string,
        })
    ),
};

export default withFormik({
    mapPropsToValues: (props) => ({
        name: props.formData.name,
        dateStart: props.formData.dateStart,
        description: props.formData.description,
        locationTypeId: props?.formData?.locationTypeId || '',
        lineOne: props.formData.lineOne,
        lineTwo: props.formData.lineTwo,
        city: props.formData.city,
        stateId: props.formData.stateId,
        zip: props.formData.zip,
        latitude: props.formData.latitude,
        longitude: props.formData.longitude,
        locationId: props.formData.locationId,
    }),

    validationSchema: projectSchema.projectInfoSchema,

    handleSubmit: (values, { props }) => {
        props.onNext(values);
    },
})(ProjectInfo);
