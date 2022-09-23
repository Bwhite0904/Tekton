import React, { useState, useEffect, useRef} from "react";
import ChatMessage from "./ChatMessage";
import PropTypes from "prop-types"
import SendMessageInput from "./SendMessageInput";
import debug from "sabio-debug";
import { Dropdown } from "react-bootstrap";

const _logger = debug.extend("Messages/ChatWindow");

const ChatWindow = (props) => {
    const messageRef = useRef();
    const [chatWindowData, setChatWindowData] = useState({ messages: false, chatMessages: [] })
    const [targetData, updateTargetUserData] = useState()
    const [userAvatars, updateUserAvatars] = useState()
    false && _logger()
    useEffect(() => {
        if (props.currentMessages?.messages) {
            setChatWindowData((prevState) => {
            const newData = { ...prevState };
             newData.messages = props.currentMessages.messages;
             if (Array.isArray(newData.messages)) {
                 newData.chatMessages = newData.messages.map(mapConversations);
            }
            return newData;
            })
        }
    }, [props.currentMessages])
    useEffect(() => { 
        messageRef?.current.scrollIntoView({
            behavior: "smooth"
        });
    }, [chatWindowData])
    useEffect(() => {
        if (props.targetData?.users !== undefined)
        {
            updateTargetUserData(props.targetData)
            const avatars = mapAvatars(props.targetData?.users)
            updateUserAvatars(avatars)
        }        
    },[props.targetData])
    const mapConversations = (messageObj) =>
    {
        if (messageObj.dateRead === "0001-01-01T00:00:00")
        {
            props.connection.invoke("UpdateMessage", messageObj.id)
        }
        return (
            <ChatMessage message={messageObj} key={`message_${messageObj.id}`} user={props.user} />
        )
    }
    const mapAvatars = (users) => {
        let avatars = [];
        for (let index = 0; index < users?.length; index++) {
            const currentAvatar = (
                <span className="messaging-avatar" key={`userAvatar_${users[index].userId}`}>
                    <img src={users[index]?.avatarUrl} alt="..." className="chat-image"/>
                </span>
            )
            avatars.push(currentAvatar)
        }
        return avatars;
    }
    const onAddUserClicked = () => {
        props.onAddUser(props.targetData);
    }
    const onRemoveUserClicked = () => { 
        props.removeUser(props.targetData.users)
    }
    const onLeaveGroupClicked = () => { 
        props.leaveGroup()
    }
    return (
        <>
            <div className="col">
                <div className="card messages">
                    <div className="card-body chat-window">
                        {chatWindowData.messages &&  
                            <div className="row align-items-center mb-3 conversation-start">
                                <Dropdown className="messaging-users-dropdown">
                                    <Dropdown.Toggle variant="link" className="messaging-avatars card-drop arrow-none p-0 shadow-none">
                                        { userAvatars }
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {props.selectedChat === "GroupMessages" && props.user.id === props.targetData.createdById ? <Dropdown.Item onClick={onAddUserClicked}>Add User</Dropdown.Item> : <></>}
                                        {props.selectedChat === "GroupMessages" && props.user.id === props.targetData.createdById ? <Dropdown.Item onClick={onRemoveUserClicked}>Remove User</Dropdown.Item> : <></>}
                                        {props.selectedChat === "GroupMessages" && props.user.id !== props.targetData.createdById ? <Dropdown.Item onClick={onLeaveGroupClicked}>Leave Group</Dropdown.Item> : <></>}
                                    </Dropdown.Menu>
                                </Dropdown>
                            <div className="col">
                                <h4 className={targetData?.id === undefined ? "d-none" : ""}>{ targetData?.name}</h4>
                                </div>
                        </div>}
                        <div className="chat overflow-auto">
                            {chatWindowData.messages && chatWindowData?.chatMessages}
                            <div ref={messageRef}/>
                        </div>
                        <div className="card-footer message-input">
                            <div className="row">
                            <SendMessageInput sendMessage={props.sendMessage}/>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

ChatWindow.propTypes = {
    currentMessages: PropTypes.shape({
        id: PropTypes.number,
        messages: PropTypes.arrayOf(PropTypes.shape({
        message: PropTypes.string,
        dateSent: PropTypes.string.isRequired,
        sender: PropTypes.shape({
            id: PropTypes.number,
            userId: PropTypes.number,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            mi: PropTypes.string,
            avatarUrl: PropTypes.string,
        }).isRequired
        }))
    }).isRequired,
    user: PropTypes.shape({
        id: PropTypes.number,
        email: PropTypes.string,
        isLoggedIn: PropTypes.bool,
        roles: PropTypes.arrayOf(PropTypes.string)
    }).isRequired,
    sendMessage: PropTypes.func.isRequired,
    connection: PropTypes.shape({
        invoke: PropTypes.func
    }),
    targetData: PropTypes.shape({
        createdById: PropTypes.number,
        id: PropTypes.number,
        name: PropTypes.string,
        users: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number,
            userId: PropTypes.number,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            mi: PropTypes.string,
            avatarUrl: PropTypes.string
        }))
    }),
    selectedChat: PropTypes.string.isRequired,
    onAddUser: PropTypes.func.isRequired,
    leaveGroup: PropTypes.func.isRequired,
    removeUser: PropTypes.func.isRequired
}
 
export default React.memo(ChatWindow)