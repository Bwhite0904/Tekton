import React, { useState, useEffect } from "react";

import UserProfile from "./UserProfile";

import PropTypes from "prop-types"

import debug from "sabio-debug"

const _logger = debug.extend("Messages/UserListItem")

const UserListItem = (props) => {
    const [userProfile, setUserProfile] = useState()
    false && _logger()
    useEffect(() => {
        setUserProfile(() => { 
            const userProf = <UserProfile
                key={`user_profile_${props.user.id}`}
                user={props.user}
                closeProfile={props.closeProfile}
                newMessage={props.newMessage}
                addUserToGroup={props.addUserToGroup} />
            return userProf
        })
    },[props.user])
    const onUserClicked = () => {
        props.userClicked(userProfile, props.user)
    }
    return (
        <>
            <div className="row user-row align-items-center" onClick={onUserClicked}>
                <img src={props.user.avatarUrl} className="user-list-image" alt="" />
                <p className="mb-0 user-list-item">{`${props.user.firstName} ${props.user.lastName}`}</p>
            </div> 
        </>
    )
}

UserListItem.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.number,
        userId: PropTypes.number.isRequired,
        firstName: PropTypes.string.isRequired,
        lastName: PropTypes.string.isRequired,
        mi: PropTypes.string,
        avatarUrl: PropTypes.string
    }),
    userClicked: PropTypes.func.isRequired,
    closeProfile: PropTypes.func.isRequired,
    newMessage: PropTypes.func.isRequired,
    addUserToGroup: PropTypes.func.isRequired
}

export default UserListItem;