import React, { useState} from "react";
import { Row, Col } from 'react-bootstrap';
import AccountLayout from "./AccountLayout";
import { MdOutlineTextsms } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi"
import "./account.css";
import { Formik, Form, Field, ErrorMessage } from "formik"
import debug from "tekton-debug"
import twoFactorAuthSchema from "../../schemas/twoFactorAuthSchema";
import * as authService from "../../services/twoFactorAuthService";
import toastr from "toastr"
import Swal from "sweetalert2";
import PropTypes from "prop-types"

const _logger = debug.extend("TwoFactorAuth")
const TwoFactorAuth = (props) => {
    const [selectedMethod, updateSelectedMethod] = useState("")
    const [displayError, updateDisplayError] = useState(false)
    const [authCode] = useState({
        phone: "",
        verificationCode: ""
    })
    const [codeSent, updateCodeSent] = useState(false)
    const [userNumber, updateUserNumnber] = useState("")
    const [formattedUserNumber, updateFormattedUserNumber] = useState("")
    const handleSubmit = (values) => {
        updateDisplayError(false)
        if (codeSent === false) {
            if (selectedMethod === "") {
                updateDisplayError(!displayError)
            }
            else {
                const payload = {
                    "userNumber": `+1${values.phone}`
                }
                updateUserNumnber(`${values.phone}`)
                updateFormattedUserNumber(() => {
                    const number = values.phone.replaceAll('-', '')
                    const areaCode = number.slice(0, 3)
                    const firstThree = number.slice(3, 6)
                    const lastFour = number.slice(6)
                    return `(${areaCode})${firstThree}-${lastFour}`
                 })
                authService.getAuthCode(payload).then(onGetAuthCodeSuccess).catch(onAxiosError)
            }
        }
        else if (codeSent === true) { 
            const payload = {
                userNumber: `+1${userNumber}`,
                verificationCode: `${values.verificationCode}`
            }
            authService.verifyAuthCode(payload).then(onAuthVerificationResponse).catch(onAxiosError)
        }
    }
    const onGetAuthCodeSuccess = async (response) => {
        if (response.item.status === "pending") {
            updateCodeSent(true);
            await Swal.fire({
            icon: 'success',
            text: "Verification code sent!",
            confirmButtonText: 'Okay',
            })
         }
        
    }
    const onAuthVerificationResponse = async (response) => {
        if (response.item.status !== "approved") {
            updateDisplayError(true)
            
        }
        else if (response.item.status === "approved") {
            props.loginSuccess();
        }
    }
    
    const onAxiosError = (err) => {
        toastr.error(err)
        _logger(err)
     }
    const BottomLink = () => {
        return (<></>
        );
    };

    const onTextSelection = () => {
        if (selectedMethod === "text") {
            updateSelectedMethod("")
        }
        else { 
            updateSelectedMethod("text")
            updateDisplayError(false)
        }
    }
    const onResendClicked = async (e) => { 
        e.preventDefault()
        const payload = {
            userNumber : `+1${userNumber}`
        }
        await authService.getAuthCode(payload).then(onGetAuthCodeSuccess).catch(onAxiosError)
        updateCodeSent(true);
            await Swal.fire({
            icon: 'success',
            text: "Verification code sent!",
            confirmButtonText: 'Okay',
            })
    }
    const onGoBackClicked = (e) => {
        e.preventDefault();
        updateCodeSent(false)
    };
    const onSkipClicked = (e) => {
        e.preventDefault()
        props.loginSuccess();
    }
    return (<>
            { !codeSent && <AccountLayout
            bottomLinks={<BottomLink/>}>
                <Row>
                    <div className="col-12 text-center">
                        <h3 className="mb-3">Complete your sign in</h3>
                    </div>
                </Row>
                <Row>
                    {displayError &&
                        <div className="align-items-center">
                            <div className="col text-center">
                                <div className="auth-method-error align-items-center">
                                    <h4>Please select an option to receive your verifiation code *</h4>
                                </div>
                            </div>
                        </div>}
                </Row>
            <Row>
                <div className="col-12 text-center">
                    <h4 className="text-muted mb-2">
                        Please select an option
                    </h4>
                </div>
            </Row>
                <div className="row auth-icons-row">
                <div
                    className={selectedMethod === "text" ?
                        "col-5 text-center auth-icon-conatiner auth-icon-conatiner-selected" :
                        "col-5 text-center auth-icon-conatiner"}
                    onClick={onTextSelection}>
                        <MdOutlineTextsms
                        className="auth-icons" />
                    <h4 className="mt-1">Text me</h4>
                    </div>
                     <div
                    className={selectedMethod === "call" ?
                        "col-5 text-center auth-icon-conatiner auth-icon-conatiner-selected" :
                        "col-5 text-center auth-icon-conatiner-call"}>
                        <FiPhoneCall
                        className="auth-icons-call" />
                    <h4 className="mt-1">Call me</h4>
                </div>
                </div>
                <Row className="mt-2">
                    <p>Enter your phone number below to receive a verification code</p>
                </Row>
                <Row>
                    <Formik
                        enableReinitialize={true}
                        onSubmit={handleSubmit}
                        initialValues={authCode}
                    validationSchema={twoFactorAuthSchema.twoFactorPhoneSchema}>
                    {({ errors, touched }) => (
                        <Form>
                            <Row>
                                <div className="col-12">
                                    <label htmlFor="phone" className="text-muted">Ex: 1112223333</label>
                                    <Field
                                        className="form-control"
                                        type="text"
                                    name="phone" />
                                    {errors.phone && touched.phone ? null : (<div className="row">
                                        <div className="error-message-placeholder">Error message palceholder</div>
                                    </div>)}
                                    <ErrorMessage name="phone" component="div" className="has-error"/>
                                </div>
                            </Row>
                            <Row>
                                <Col>
                                    <a href="/login">Return to Login</a>
                                </Col>
                                <Col>
                                    <a href="" onClick={onSkipClicked}>Skip Authentication</a>
                                </Col>
                            </Row>
                            <Row>
                                <div className="col-12 mt-2">
                                    <button type="submit" className="btn btn-primary col-12">Continue</button>
                                </div>
                            </Row>
                        </Form>
                        )}
                    </Formik>
                </Row>
        </AccountLayout>}

         { codeSent && <AccountLayout
            bottomLinks={<BottomLink/>}>
                <Row>
                    <div className="col-12 text-center">
                        <h3 className="mb-3">Complete your sign in</h3>
                    </div>
            </Row>
            <Row>
                    {displayError &&
                        <div className="align-items-center">
                            <div className="col text-center">
                                <div className="auth-method-error align-items-center">
                                    <p>Verifcation code invalid. Please re-enter your code</p>
                                </div>
                            </div>
                        </div>}
                </Row>
            <Row>
                <div className="col text-center">
                    <div className="row">
                        <h4 className="text-muted">{`A verification code was sent to`}</h4>
                    </div>
                    <div className="row">
                        <h4 className="text-muted">{`${formattedUserNumber}`}</h4>
                    </div>
                </div>
            </Row>
                <Row>
                    <Formik
                        enableReinitialize={true}
                        onSubmit={handleSubmit}
                        initialValues={authCode}
                    validationSchema={twoFactorAuthSchema.twoFactorAuthCodeSchema}>
                    {({ errors, touched }) => (
                        <Form>
                            <Row>
                                <div className="col-12">
                                    <label htmlFor="phone" className="text-muted">Enter your verification code</label>
                                    <Field
                                        className="form-control"
                                        type="text"
                                        name="verificationCode" />
                                    {errors.verificationCode && touched.verificationCode ? null : (<div className="row">
                                        <div className="error-message-placeholder">Error message palceholder</div>
                                    </div>)}
                                    <ErrorMessage name="verificationCode" component="div" className="has-error"/>
                                </div>
                            </Row>
                            <Row>
                                <div className="auth-links">{`Didn't receive a code?`} <a href="" className="auth-links" onClick={onResendClicked}>Re-send verification code</a></div>
                            </Row>
                            <Row>
                                <a href="" className="auth-links" onClick={onGoBackClicked}>Go back</a>
                            </Row>
                            <Row>
                                <div className="col-12 mt-2">
                                    <button type="submit" className="btn btn-primary col-12">Continue</button>
                                </div>
                            </Row>
                        </Form>
                        )}
                    </Formik>
                </Row>
        </AccountLayout>}
        
    </>)
}

TwoFactorAuth.propTypes = {
    loginSuccess: PropTypes.func.isRequired
}

export default TwoFactorAuth;
