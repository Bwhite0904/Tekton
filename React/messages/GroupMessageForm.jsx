import React, { useState } from "react"
import { Formik, Form, Field } from "formik"
import PropTypes from "prop-types"
import messagingSchema from "../../schemas/messagesValidation"



const GroupMessageForm = (props) => { 
    const [groupFormData] = useState({
        name: ""
    })

    const handleSubmit = (values) => {
        props.onClick(values.name)
    }
    return (
        <>
            <Formik
                enableReinitialize={true}
                initialValues={groupFormData}
                onSubmit={handleSubmit}
                value={groupFormData}
                validationSchema={messagingSchema.createGroupSchema}>
                {({isValid, dirty}) => (
                <Form>
                    <div className="row">
                        <label htmlFor="name">Group Name</label>
                        <div className="form-group col-9">
                            <Field
                                className="form-control"
                                type="text"
                                name="name"
                                placeholder="Please enter a group name..."/>
                        </div>
                            <button
                                type="submit"
                                className="btn btn-success float-ende col-3"
                                disabled={!isValid || !dirty}
                        >Create</button>
                    </div>
                </Form>
                )}
            </Formik>
        </>
    )
}

GroupMessageForm.propTypes = {
    onClick: PropTypes.func.isRequired
}

export default GroupMessageForm;