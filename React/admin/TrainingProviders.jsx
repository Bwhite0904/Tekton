import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { MdSchool } from 'react-icons/md'

import PropTypes from 'prop-types';

const TrainingProviders = (props) => { 
    return (
        <>
            <Col className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3'>
                <Card className="mt-2 shadow-0">
                    <Card.Body className="text-center">
                        <Row className='align-items-center'>
                            <Col className='text-center'>
                                <Row>
                                    <h4>Training Providers</h4>
                                    <h3>{props.count}</h3>
                                </Row>
                                <Row className='invisible'>
                                    <Col>
                                        <div
                                            type='button'
                                            className={'btn-secondary'}>
                                            PLACEHOLDER
                                        </div>
                                    </Col>
                                    <Col>
                                        <div
                                            type='button'
                                            className={'btn-secondary'}>
                                            PLACEHOLDER
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className='text-center col-3'>
                                <MdSchool className='admin-icons'></MdSchool>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}

TrainingProviders.propTypes = {
    count: PropTypes.number.isRequired
}

export default TrainingProviders;