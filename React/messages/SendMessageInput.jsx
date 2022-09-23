import React, { useState } from "react";
import { FormikProvider, Form, Field, useFormik } from "formik"
import {Link} from "react-router-dom"
import PropTypes from "prop-types";
import messagingSchema from "../../schemas/messagesValidation";
import { MdSend, MdAttachFile } from "react-icons/md"
import { Modal, Button } from "react-bootstrap"
import FileUploader from "../../components/files/FileUploader";
import Swal from "sweetalert2";

const SendMessageInput = ({ sendMessage }) => {

    const [messageInput] = useState({
        input: ''
    })
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(!show);
    const handleSubmit = (values, { resetForm }) => {
        sendMessage(values.input)
        resetForm({values: ''})
    }
    const formik = useFormik({
        initialValues: messageInput,
        validationSchema: messagingSchema.messageValidationSchema,
        enableReinitialize: true,
        onSubmit: handleSubmit
    })
    const getAwsResponse = (res) => {
        const response = res?.data?.items[0]?.url
        if (response !== undefined) {
            formik.setFieldValue('input', response);
            setShow();
            Swal.fire({
                text: 'File Uploaded Successfully',
                icon: 'success',
                confirmButtonText: 'Okay'
            })
        }
    };
    return (
        <>
            <FormikProvider
                value={formik}>
                    <Form>
                    <div className="row message-input-container">
                        <div className="form-group col-9">
                            <Field className="form-control" type='text' name='input' placeholder='enter a message...' />
                        </div>
                        <Link to="#" className="btn btn-light col-1" onClick={handleShow}>
                            <MdAttachFile/>
                        </Link>
                        <button type="submit" className="btn btn-success float-end col-1"><MdSend/></button>
                        </div>
                        <Modal
                            show={show}
                            onHide={handleShow}
                            size="lg"
                            aria-labelledby="contained-modal-title-vcenter"
                            centered>
                                <Modal.Body>
                                    <label htmlFor="input" className=" mb-1">Upload a File Below</label>
                                    <FileUploader
                                        getAwsResponse={getAwsResponse}
                                        isMultipleFiles={false}
                                        className="form-control"
                                        name="fileUrl"></FileUploader>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={handleShow}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                        </Modal>
                    </Form>
            </FormikProvider>
        </>
    )
}

SendMessageInput.propTypes = {
    sendMessage: PropTypes.func
}

export default SendMessageInput
