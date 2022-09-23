import React, { useState, useEffect } from 'react'
import { Card, Row, Col } from 'react-bootstrap'
import { FaUserAlt } from 'react-icons/fa'

import PropTypes from 'prop-types'

const Users = (props) => {
    const [selection, updateSelection] = useState('Total')
    const [inactiveSelected, updateInactiveSelected] = useState(false)
    const [totalSelected, updateTotalSelected] = useState(true)
    const [inactive, updateInactive] = useState();
    const [total, updateTotal] = useState();

    useEffect(() => {
        updateInactive(props.inactiveUsers);
        updateTotal(props.totalUsers);
    }, [props.totalUsers, props.inactiveUsers]);

    const onInactiveSelection = () => { 
        updateSelection('Inactive');
        updateInactiveSelected(!inactiveSelected);
        updateTotalSelected(false);
    };const onTotalSelection = () => { 
        updateSelection('Total');
        updateTotalSelected(true);
        updateInactiveSelected(false);
    };
    return (
    <>
        <Col className='col-12 col-sm-12 col-md-6 col-lg-6 col-xl-3'>
            <Card className="mt-2 shadow-0">
                <Card.Body className="">
                    <Row className='align-items-center'>
                        <Col className='text-center col-9'>
                                <Row>
                                    <h4>Users</h4>
                                    {selection === 'Total' && <h3>{total}</h3>}
                                    {selection === 'Inactive' && <h3>{inactive}</h3>}
                                </Row>
                                <Row className='align-items-center'>
                                    <Col>
                                        <div
                                            type='button'
                                            className={totalSelected ? 'btn-success' : 'btn-secondary'}
                                            onClick={onTotalSelection}>
                                            Total
                                        </div>
                                    </Col>
                                    <Col>
                                        <div
                                            type='button'
                                            className={inactiveSelected ? 'btn-success' : 'btn-secondary'}
                                            onClick={onInactiveSelection}>
                                            Inactive
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col className='text-center col-3'>
                                <FaUserAlt className='admin-icons'></FaUserAlt>
                            </Col>
                        </Row>
                </Card.Body>
            </Card>
        </Col>
    </>
    )
}

Users.propTypes = {
    inactiveUsers: PropTypes.number.isRequired,
    totalUsers: PropTypes.number.isRequired
}

export default Users;