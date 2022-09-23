import React from "react";

import { MdOutlineGroupAdd } from "react-icons/md";
import { BiMessageAdd } from "react-icons/bi"

import PropTypes from "prop-types"

const UserProfile = (props) => {
    const onCloseClicked = () => { 
        props.closeProfile();
    }
    const onMessageClicked = () => { 
        props.newMessage(props.user)
    }
    const addUserRequested = () => {
        props.addUserToGroup(props.user)
     }

    return (
        <>
            <div className="card user-profile">
                <div className="card-body">
                    <div className="row mb-2">
                        <div className="col">
                            <button type="close" className="btn-close float-end" onClick={onCloseClicked}/>
                        </div>
                    </div>
                    <div className="col text-center">
                        <img src={props.user.avatarUrl} alt="..." className="user-profile-image"/>
                    </div>
                    <div className="row">
                        <div className="col text-center mt-3">
                            <h3>{`${props.user.firstName} ${props.user.lastName}`}</h3>
                            <h4>Email:</h4>
                            <p></p>
                            <h4>Title:</h4>
                            <p></p>
                        </div>
                    </div>
                    <div className="row user-info-buttons">
                        <button type="button" className="btn btn-secondary col-3" onClick={onMessageClicked}><BiMessageAdd className="user-info-icons"/></button>
                        <button type="button" className="btn btn-secondary col-3 float-end" onClick={addUserRequested}><MdOutlineGroupAdd className="user-info-icons col-1" /></button>
                    </div>
                </div>
            </div>
        </>
    )
}

UserProfile.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number,
        userId: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        mi: PropTypes.string,
        avatarUrl: PropTypes.string.isRequired
    }),
    closeProfile: PropTypes.func.isRequired,
    newMessage: PropTypes.func.isRequired,
    addUserToGroup : PropTypes.func.isRequired
}

export default React.memo(UserProfile);