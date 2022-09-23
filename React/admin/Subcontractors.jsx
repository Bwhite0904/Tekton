import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FaHardHat } from 'react-icons/fa';

import PropTypes from 'prop-types'

const Subcontractors = (props) => {
    const [activeSelected, updateActiveSelected] = useState(true);
    const [inactiveSelected, updateInactiveSelected] = useState(false);
    const [active, updateActive] = useState();
    const [inactive, updateInactive] = useState();

    useEffect(() => { 
        updateActive(props.activeSubs + props.inactiveSubs);
        updateInactive(props.inactiveSubs)
    },[props.activeSubs, props.inactiveSubs])

    const onSelection = () => { 
        updateActiveSelected(!activeSelected);
        updateInactiveSelected(!inactiveSelected)
    }
    return (
        <>
            <Col className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3'>
                <Card className="mt-2 shadow-0">
                    <Card.Body className="text-center">
                        <Row className='align-items-center'>
                            <Col className='text-center'>
                                <Row>
                                    <h4>Subcontractors</h4>
                                    <h3>{activeSelected === true ? active : inactive }</h3>
                                </Row>
                                <Row>
                                    <Col>
                                        <div
                                            type='button'
                                            className={activeSelected === true ? 'btn-success' : 'btn-secondary'}
                                            onClick={onSelection}>
                                            Total
                                        </div>
                                    </Col>
                                    <Col>
                                        <div
                                            type='button'
                                            className={inactiveSelected === true ? 'btn-success' : 'btn-secondary'}
                                            onClick={onSelection}>
                                            Inactive
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className='text-center col-3'>
                                <FaHardHat className='admin-icons'></FaHardHat>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}

Subcontractors.propTypes = {
    activeSubs: PropTypes.number.isRequired,
    inactiveSubs: PropTypes.number.isRequired
}

export default Subcontractors;