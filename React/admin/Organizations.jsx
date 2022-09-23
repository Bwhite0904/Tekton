import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { VscOrganization } from 'react-icons/vsc'

import PropTypes from 'prop-types';

const Organizations = (props) => { 
    return (
        <>
            <Col className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3'>
                <Card className="mt-2 shadow-0">
                    <Card.Body className="text-center">
                        <Row className='align-items-center'>
                            <Col className='text-center'>
                                <Row>
                                    <h4>Organizations</h4>
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
                                <VscOrganization className='admin-icons'></VscOrganization>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}

Organizations.propTypes = {
    count: PropTypes.number.isRequired
}

export default Organizations;