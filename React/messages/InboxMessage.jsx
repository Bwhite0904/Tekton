import React, { useState, useEffect } from "react";
import PropTypes from "prop-types"

const InboxMessage = (props) => {
    const [currentMessage, updateCurrentMessage] = useState('')
    const [unreadCount, updateUnreadCount] = useState("")
    const [targetUser, updateTargetUser] = useState({})
    useEffect(() => {
        updateCurrentMessage(() => {
            let msg = props.recMessage.body;
                if (msg.includes('https')) {
                    const fileSplit = msg.split("/")
                    let fileName = fileSplit[3].split("_")
                    fileName = fileName[1]
                    msg = fileName
                    return msg;
                }
                else { 
                    msg = msg.slice(0, 65)
                    return msg
                }
        })
        if (props.recMessage.senderId) {
            updateTargetUser(() => { 
                let user = {}
                if (props.recMessage.senderId === props.user.id) {
                    user = props.recMessage.recipient;
                    user.userId = props.recMessage.recipientId;
                }
                else { 
                    user = props.recMessage.sender;
                    user.userId = props.recMessage.senderId
                }
                return user;
            })
         }
    }, [props.recMessage, props.user, props.unreadCount])
    useEffect(() => {
        updateUnreadCount(props.unreadCount)
    }, [props.unreadCount])
    const onUserClicked = () => {
        updateUnreadCount("")
        props.onClick(targetUser)
    }
    return (
        <div className="card card-chat" onClick={onUserClicked}>
            <div className="row align-items-center">
                <div className="col-2 text-left">
                    <img src={targetUser.avatarUrl} alt="..." className="chat-image"/>
                </div>
                <div className="col mx-2">
                    <strong className="row">{targetUser.firstName && `${targetUser.firstName} ${targetUser.lastName}`}</strong>
                    <div className="row">{currentMessage.length >= 65 ? `${currentMessage}...` : currentMessage}</div>
                </div>
                <div className="col-2 align-items-center">
                    {unreadCount > 0 ? <div className="float-end chat-notification">{unreadCount}</div> : <></>}
                </div>
            </div>
        </div>
    )
}
InboxMessage.propTypes = {
    recMessage: PropTypes.shape({
        id: PropTypes.number.isRequired,
        body: PropTypes.string.isRequired,
        subject: PropTypes.string,
        recipientId: PropTypes.number.isRequired,
        senderId: PropTypes.number.isRequired,
        dateSent: PropTypes.string,
        dateRead: PropTypes.string,
        dateCreated: PropTypes.string,
        dateModified: PropTypes.string,
        sender: PropTypes.shape({
            id: PropTypes.number,
            userId: PropTypes.number,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            mi: PropTypes.string,
            avatarUrl: PropTypes.string,
        }),
        recipient: PropTypes.shape({
            id: PropTypes.number,
            userId: PropTypes.number,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            mi: PropTypes.string,
            avatarUrl: PropTypes.string,
        }),
    }),
    onClick: PropTypes.func.isRequired,
    user: PropTypes.shape({
        id: PropTypes.number,
        email: PropTypes.string,
        isLoggedIn: PropTypes.bool,
        roles: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
    unreadCount: PropTypes.number,
    targetData: PropTypes.shape({
        id: PropTypes.number,
        userId: PropTypes.number,
        firstName: PropTypes.string,
        lastName: PropTypes.string,
        mi: PropTypes.string,
        avatarUrl: PropTypes.string
    }).isRequired
}
 
export default React.memo(InboxMessage);