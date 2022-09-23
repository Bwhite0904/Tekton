import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'

const GroupInboxMessage = (props) => {
    const [currentMessage, updateCurrentMessage] = useState("");
    useEffect(() => { 
        if (props.message.message !== undefined) {
            updateCurrentMessage(() => {
                let msg = props.message.message;
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
        }
    },[props.message])
    const onGroupMessageClicked = () => {
        props.onClick(props.message.groupId)
    }
    return (
        <div className={props.group.createdById === props.currentUserId ? "card card-chat-owner" : "card card-chat"} onClick={onGroupMessageClicked}>
            <div className="row align-items-center">
                <div className="col-2 text-left">
                    <img src={props?.message?.sender?.avatarUrl} className={props.message.sender !== undefined ? "chat-image" : "d-none"} alt="..." />
                </div>
                <div className="col mx-2">
                    <strong className="row">{props.group.name}</strong>
                    <div className="row">{currentMessage?.length >= 65 ? `${currentMessage}...` : currentMessage}</div>
                </div>
            </div>
        </div>
    )
}

GroupInboxMessage.propTypes = {
    message: PropTypes.shape({
        sender: PropTypes.shape({
            id: PropTypes.number,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            avatarUrl: PropTypes.string
        }),
        message: PropTypes.string,
        groupId: PropTypes.number
    }).isRequired,
    onClick: PropTypes.func.isRequired,
    group: PropTypes.PropTypes.shape({
        createdById: PropTypes.number,
        id: PropTypes.number,
        name: PropTypes.string,
        users: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            avatarUrl: PropTypes.string
        }))
    }).isRequired,
    currentUserId : PropTypes.number.isRequired
}

export default React.memo(GroupInboxMessage);