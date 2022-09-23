import React, { useState, useEffect } from "react";
import ReactTooltip from "react-tooltip";
import { API_HOST_PREFIX } from "../../services/serviceHelpers";

import debug from "tekton-debug";

import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import * as messageService from "../../services/messageService";
import userProfiles from "../../services/userProfileService"

import ChatWindow from "./ChatWindow";
import InboxMessage from "./InboxMessage";
import UsersList from "./UsersList";
import GroupInboxMessage from "./GroupInboxMessage";
import GroupMessageForm from "./GroupMessageForm";

import "./messages.css";

import PropTypes from "prop-types"

import toastr from "toastr"
import Swal from "sweetalert2";

import { MdGroups } from "react-icons/md"
import { FiMessageSquare } from "react-icons/fi"
import { BsPlusCircleFill } from "react-icons/bs"
import { Dropdown } from "react-bootstrap";

const _logger = debug.extend("Messages")

const Messages = (props) => {
    const [hubConnection, setHubConnection] = useState(null);
    const [currentUser, updateUser] = useState({});
    const [directMessages, updateDirectMessages] = useState([]);
    const [groupMessages, updateGroupMessages] = useState([]);
    const [inboxMessages, updateInbox] = useState([]);
    const [groupInboxMessages, updateGroupInboxMessages] = useState([]);
    const [currentConversation, updateCurrentConversation] = useState({ userId: 0, messages: [] })
    const [selectedChat, updateSelectedChat] = useState("DirectMessages")
    const [currentUserProfile, updateCurrentUserProfile] = useState({})
    const [targetData, updateTargetData] = useState({})
    const [currentGroupMessages, updateCurrentGroupMessages] = useState({})
    const [targetGroup, updateTargetGroup] = useState(null)
    const [targetDirectMessage, updateTargetDirectMessage] = useState(null)
    const [messagingGroups, updateMessagingGroups] = useState([])
    const [displayUserList, updateDisplayUserList] = useState(false)
    const [displayGroupUsers, updateDisplayGroupUsers] = useState(false)
    const [groupUsers, updateGroupUsers] = useState()
    false && _logger(directMessages, groupMessages)
    useEffect(() => {
        updateUser(props.currentUser)
        userProfiles.userById(props.currentUser.id).then(onGetUserProfileSuccess).catch(onAxiosError)
    }, [props.currentUser])
    useEffect(() => {
        if (currentUser.id) {
            startConnection(currentUser.id.toString())
        }
    }, [currentUser.id])
    useEffect(() => {
        let inboxCards = []
        const groups = messagingGroups;
        for (let index = 0; index < groupMessages?.length; index++) {
            const indexPos = groupMessages[index].length - 1;
            const newestMessage = groupMessages[index][indexPos]
            const inboxCard = <GroupInboxMessage
                message={newestMessage}
                key={`Group_${newestMessage.groupId}`}
                onClick={onGroupInboxClicked}
                group={groups[index]}
                currentUserId={props.currentUser.id} />
                inboxCards.push(inboxCard)
            }
            updateGroupInboxMessages(inboxCards)

    },[groupMessages, messagingGroups])
    const startConnection = async () => {
        try {
            const con = new HubConnectionBuilder()
                .withUrl(`${API_HOST_PREFIX}/messages`)
                .configureLogging(LogLevel.Information)
                .build();
            
            con.on("ReceiveMessage", async (message) => {
                let target = message.recipient;
                target.userId = message.recipientId
                let sender = message.sender;
                sender.userId = message.senderId
                await con.invoke("GetMessages", props.currentUser.id)
                if (message.senderId === props.currentUser.id) {
                    onInboxUserClicked(target)
                }
                onMessageReceive(message, sender);
            })
            con.on("ReceiveAllMessages", (messages) => {
                onGetConversationSuccess(messages)
            })
            con.on("ReceiveGroupMessages", (messages) => {
                onGetGroupMessagesSuccess(messages)
            })
            con.on("ReceiveGroupMessage", (message) => {
                const formattedMessage = {
                    message: message.message,
                    dateSent: message.dateSent,
                    sender: message.sender,
                    id: message.id
                }
                updateGroupMessages((prevState) => {
                    let convos = [...prevState]
                    let filteredConvos = convos.filter((convo) => {
                        let result = false;
                        if (convo[0].groupId === message.groupId) {
                            result = true;
                        }
                        return result;
                    })
                    if (filteredConvos.length > 0) {
                        filteredConvos[0].push(message)
                    }
                    else { 
                        convos.push([message])
                    }
                    return convos
                })
                updateCurrentGroupMessages((prevState) => {
                    let convos = { ...prevState }
                    if (convos.id === message.groupId) {
                        const filteredMessages = convos.messages.filter((msg) => {
                            let result = false
                            if (msg.id === message.id) {
                                result = true;
                            }
                            return result
                        })
                        if (filteredMessages.length <= 0) {
                            convos.messages.push(formattedMessage)
                        }
                    }
                    return convos;
                 })
            })
            con.on("ReceiveMessagingGroups", (groups) => {
                updateMessagingGroups(groups);
            })
            con.on("ReceiveMessagingGroup", (group) => { 
                updateTargetData(group);
                updateTargetGroup(group.id)
                updateMessagingGroups((prevState) => {
                    let groups = [...prevState];
                    const filteredGroups = groups.filter((grp) => {
                        let result = false;
                        if (grp.id === group.id) {
                            result = true;
                        }
                        return result;
                     })
                    if (filteredGroups.length <= 0) { 
                        groups.push(group)
                    }
                    return groups
                })
                updateCurrentGroupMessages((prevState) => {
                    let groupConvo = { ...prevState };
                    if (groupConvo.id !== group.id) {
                        const newConvo = {
                            id: group.id,
                            messages: []
                        }
                        return newConvo
                    }
                    else {
                        return groupConvo;
                     }
                 })
            })
            await con.start();
            await con.invoke("StartConnection", con.connection.connectionId, {
                connectionId: con.connection.connectionId
                , id: currentUser.id
                , name: `${currentUser.firstName} ${currentUser.lastName}`
            });
            await con.invoke("GetMessages", currentUser.id)
            setHubConnection(con)
            
         }
        catch (e) {
            _logger(e)
            messageService.getConversation(props.currentUser.id).then(onGetConversationSuccess).catch(onAxiosError);
            messageService.getMessageGroupsByUserId(currentUser.id).then(onGetMessageGroupsSuccess).catch(onAxiosError);
        }
    }
    const onGetUserProfileSuccess = (data) => {
        updateCurrentUserProfile(data.item)
    }
    const onGetConversationSuccess = (messages) => {
        let inboxUserIds = Array.from(new Set(messages.map((item) => {
            if (item.senderId !== props.currentUser.id) {
                return item.senderId
            }
            else {
                return item.recipientId
            }
        })));
        const mappedConversations = mapConversations(inboxUserIds, messages);
        const iboxCards = mapInbox(mappedConversations, inboxUserIds);
        updateInbox(iboxCards);
    }
    const mapConversations = (userIds, messages) => {
        let conversations = []
        for (let index = 0; index < userIds.length; index++)
        {
            const messageUserId = userIds[index];
            let mappedMessages = messages.filter((item) => {
                let result = false;
                if (item.senderId === messageUserId || item.recipientId === messageUserId) {
                    result = true;
                };
                return result;
            })
            conversations.push(mappedMessages)
        }
        return conversations;
    }    
    const mapInbox = (messages, inboxIds) => {
        let inboxCards = []
        let inboxConversations = []
        for (let index = 0; index < inboxIds.length; index++) {
            const message = messages[index];
            const count = messages[index].filter((msg) => {
                let result = false
                if ((msg.dateRead === "0001-01-01T00:00:00") &&
                    (msg.senderId !== props.currentUser.id)) {
                    result = true
                }
                return result;
            })
            messages[index] = messages[index].map((message) => {
                message.sender.userId = message.senderId
                const newMsgFormat = {
                    id: message.id,
                    message: message.body,
                    sender: message.sender,
                    dateSent: message.dateSent,
                    dateRead: message.dateRead
                }
                return newMsgFormat;
            })
            const conversation = { id: inboxIds[index], messages: messages[index], unreadCount: count.length }
            const newCard = <InboxMessage
                recMessage={message[message.length - 1]}
                unreadCount={count.length}
                key={`conversation_withUser_${inboxIds[index]}`}
                onClick={onInboxUserClicked}
                user={props.currentUser}
                targetData={targetData}/>
            inboxCards.push(newCard)
            inboxConversations.push(conversation)
            updateDirectMessages(inboxConversations)
        }
        return inboxCards;
    }
    const onInboxUserClicked = (userData) => {
        updateTargetDirectMessage(userData)
        updateTargetData(() => { 
            const targetInfo = {
                id: userData.userId,
                name: `${userData.firstName} ${userData.lastName}`,
                users: [userData]
            }
        return targetInfo
        })
        updateDirectMessages((prevState) => {
            const convos = [...prevState];
            updateCurrentConversation(() => {
                let currentConvo = convos.filter((item) => {
                    let result = false;
                    if (item.id === userData.userId) { 
                        result = true;
                    }
                    return result;
                })
                currentConvo = currentConvo[0]
                return currentConvo;
            })
            return convos;
        })
    }
    const onGroupInboxClicked = (groupId) => {
        const currentGroupMessages = groupMessages;
        updateTargetGroup(groupId)
        const groupInfo = messagingGroups.filter((group) => {
            let result = false
            if (group.id === groupId) {
                result = true;
            }
            return result;
        })
        updateTargetData(groupInfo[0])
        let currentMessages = currentGroupMessages.filter((messages) => {
            let result = false;
            if (messages[0].groupId === groupId) {
                result = true;
            }
            return result;
        })
        if (currentMessages[0].length > 0)
        {
            currentMessages = currentMessages[0].map((message) => {
                const formattedMessage = {
                    message: message.message,
                    dateSent: message.dateSent,
                    sender: message.sender,
                    id: message.id
                    }
                return formattedMessage
            })
        }
        const messagesForUpdate = { id: groupId, messages: currentMessages }
        updateCurrentGroupMessages(messagesForUpdate)
        }
    const sendMessage = async (newMessage) => {
        if (selectedChat === "DirectMessages") {
            const messageForTransport = {
                message: newMessage
                , recipientId: targetDirectMessage.userId
                , senderId: props.currentUser.id
                , subject: ""
                , dateSent: new Date()
            }
            if (hubConnection.connection._connectionStarted === true) {
                try {
                    await hubConnection.invoke("SendMessage"
                        , currentUser.id
                        , targetDirectMessage.userId, messageForTransport);
                }
                catch (e) {
                    toastr.error(e)
                }

            }
            else {
                const handler = onSendMessageSuccess(messageForTransport)
                messageService.addMessage(messageForTransport).then(handler).catch(onAxiosError)
            }
        }
        else if (selectedChat === "GroupMessages") {
            const messageForTransport = {
                message: newMessage,
                subject: "",
                groupId: targetGroup,
                senderId: props.currentUser.id
            }
            if (hubConnection.connection._connectionStarted === true) {
                try {
                    await hubConnection.invoke("SendGroupMessage"
                        , targetGroup.toString(), messageForTransport);
                }
                catch (e) {
                    toastr.error(e)
                }
            }
            else {
                const handler = onSendGroupMessageSuccess(messageForTransport)
                messageService.addGroupMessage(messageForTransport).then(handler).catch(onAxiosError)
            }
         }
    }
    const onSendGroupMessageSuccess = (msg) => { 
        updateCurrentGroupMessages((prevState) => {
            let newMessages = { ...prevState };
            newMessages.messages.push(msg)
            return newMessages;
         })
    }
    const onSendMessageSuccess = (message) => {
        return () => {
            updateCurrentConversation((prevState) => {
                let newMessages = { ...prevState };
                newMessages.messages.push(message)
                return newMessages;
            })
        };
    }
    const onMessageReceive = (message, sender) => {
        updateTargetData((prevState) => {
            const newTargetData = { ...prevState }
            if (message.senderId === newTargetData.userId) {
                onInboxUserClicked(sender)
            }
            return newTargetData
        })
     }
    const onDirMessageClicked = () => { 
        updateSelectedChat("DirectMessages")
        if (targetDirectMessage !== null) {
            onInboxUserClicked(targetDirectMessage)
         }
    }
    const onGroupMessageClicked = () => {
        updateSelectedChat("GroupMessages")
        if (targetGroup !== null)
        {
            onGroupInboxClicked(targetGroup)
        }
    }
    const onGetMessageGroupsSuccess = (data) => {
        for (let index = 0; index < data.length; index++) {
            const groupId = data[index].id
            messageService.getGroupMessagesByGroupId(groupId, 0, 4).then(onGetGroupMessagesSuccess).catch(onAxiosError)
        }
    }
    const onGetGroupMessagesSuccess = (data) => {
        if (data.pagedItems !== null) {
            updateGroupMessages((prevState) => { 
            let messages = [...prevState]
            let filteredMessages = messages.filter((convo) => {
                let result = false;
                if (convo[0].groupId === data.pagedItems[0].groupId) { 
                    result = true;
                }
                return result
            })
                if (filteredMessages.length <= 0) {
                messages.push(data.pagedItems)
                } 
            return messages;
            }) 
        } 
    }
    const onNewMessage = (userData) => {
        updateDisplayUserList(false)
        updateSelectedChat("DirectMessages")
        const userInfo = {
                id: userData.userId,
                name: `${userData.firstName} ${userData.lastName}`,
                users: [userData]
                }
        updateDirectMessages((prevState) => {
            const convos = [...prevState];
            const convoCheck = convos.filter((c) => {
                let result = false;
                if (c.id === userData.userId) { 
                    result = true;
                }
                return result;
            })
            if (convoCheck.length > 0) {
                updateTargetData(userInfo)
                updateTargetDirectMessage(userData)
                onInboxUserClicked(userData)
            }
            else {
                updateTargetDirectMessage(userData)
                updateTargetData(userInfo)
                updateCurrentConversation((prevState) => {
                    const newConv = { ...prevState };
                    newConv.userId = userData.userId;
                    newConv.messages = []
                    return newConv;
                })
            }
            return convos;
        })
    }
    const onNewGroupClicked = () => { 
        updateSelectedChat("GroupMessageForm")
    }
    const onCreateGroupClick = async (name) => {
        const group = {
            name: name,
            createdById: props.currentUser.id
        }
        try {
            await hubConnection.invoke("CreateMessagingGroup", hubConnection.connection.connectionId, group)
            updateSelectedChat("GroupMessages")
         }
        catch (e) {
            toastr.error(e)
            messageService.createMessageGroup(group).then(onCreateGroupSuccess).catch(onAxiosError)
        }
    }
    const onAddUserRequest = (groupInfo) => {
        updateTargetGroup(groupInfo.id)
        updateDisplayUserList(true)
    }
    const addUserToGroup = (userData) => {
        const modelForAdd = {
            addedById: props.currentUser.id,
            groupId: targetData.id,
            userId: userData.userId
        }
        try {
            hubConnection.invoke("AddUserToMessagingGroup", modelForAdd)
            updateDisplayUserList(false)
            updateTargetData((prevState) => {
            const target = { ...prevState }
            const filteredUsers = target.users.filter((user) => {
                let result = false;
                if (user.userId === userData.userId) {
                    result = true
                }
                return result;
            })
            if (filteredUsers.length <= 0) {
                target.users.push(userData)
            }
            return target;
         })
         }
        catch (e) {
            const handler = onAddUserSuccess(userData)
            messageService.addUserToMessageGroup(modelForAdd).then(handler).catch(onAxiosError)
         }
    }
    const onAddUserSuccess = (userInfo) => { 
        return () => {
            updateDisplayUserList(false)
            updateTargetData((prevState) => {
            const target = { ...prevState }
            const filteredUsers = target.users.filter((user) => {
                let result = false;
                if (user.userId === userInfo.userId) {
                    result = true
                }
                return result;
            })
            if (filteredUsers.length <= 0) {
                target.users.push(userInfo)
            }
            return target;
            })
        }
    }
    const closeUserList = () => { 
        updateDisplayUserList(false);
    }
    const onNewDmClicked = () => {
        updateDisplayUserList(true)
    }
    const onCreateGroupSuccess = (response) => { 
        updateCurrentGroupMessages({
            id: response.item,
            messages: []
        })
    }
    const onRemoveUserRequest = (users) => { 
        const groupUsers = users.map((user) => {
            if (user.userId !== props.currentUser.id) {
                return (<div key={`group_user_${user.userId}`}>
                    <div className="row user-row align-items-center" onClick={() => { onUserSelectedForRemoval(user) }}>
                        <img src={user.avatarUrl} className="user-list-image" alt="" />
                        <p className="mb-0 user-list-item">{`${user.firstName} ${user.lastName}`}</p>
                    </div>
                </div>
                )
            }
            else { 
                return null;
            }
        })
        updateGroupUsers(groupUsers)
        updateDisplayGroupUsers(true)
    }
    const onUserSelectedForRemoval = async (user) => { 
        const result = await Swal.fire({
            icon: 'warning',
            text: `Are you sure you want to remove ${user.firstName} ${user.lastName} from ${targetData.name}`,
            confirmButtonText: 'Remove',
            confirmButtonColor: '#FF0000',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
        })
        if (result.isConfirmed === true) {
             try { 
                 await hubConnection.invoke("RemoveUserFromMessagingGroup", user.userId, targetData.id)
                 updateTargetData((prevState) => {
                     const targetInfo = { ...prevState };
                     const newUsers = targetInfo.users.filter((userInfo) => {
                         let result = false;
                         if (userInfo.userId !== user.userId) { 
                             result = true;
                         }
                         return result;
                     })
                     targetInfo.users = newUsers;
                     return targetInfo;
                  })
                Swal.fire({
                    text: `${user.firstName} ${user.lastName} was removed from ${targetData.name}.`,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Okay',
                })
            }
            catch (e) {
                _logger(e)
                toastr.error(e)
                messageService.removeUserFromMessageGroup(user.userId, targetData.id).then(onUserRemovedSuccess).catch(onAxiosError)
             }
         }
        updateDisplayGroupUsers(false)
    }
    const leaveGroupRequest = async () => { 
        const result = await Swal.fire({
            text: `Are you sure you want to leave ${targetData.name}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Leave',
            confirmButtonColor: '#FF0000',
            cancelButtonText: 'Cancel'
        })
        if (result.isConfirmed === true) {
            try { 
                hubConnection.invoke("RemoveUserFromMessagingGroup", props.currentUser.id, targetData.id)
                updateGroupMessages((prevState) => {
                    let convos = [...prevState];
                    const filteredConvos = convos.filter((convo) => {
                        let result = false;
                        if (convo[0].groupId !== targetData.id)
                        {
                            result = true;
                        }
                        return result;
                    })
                    convos = filteredConvos;
                    return convos;
                })
                Swal.fire({
                    text: `Left ${targetData.name}?`,
                    icon: 'success',
                    showCancelButton: true,
                    confirmButtonText: 'Okay',
                })
            }
            catch (e) {
                _logger(e)
                toastr.error(e)
                messageService.removeUserFromMessageGroup(props.currentUser.id, targetData.id).then(onUserRemovedSuccess).catch(onAxiosError)
             }
         }
    }
    const onUserRemovedSuccess = () => { 
        updateGroupMessages((prevState) => {
                    let convos = [...prevState];
                    const filteredConvos = convos.filter((convo) => {
                        let result = false;
                        if (convo[0].groupId !== targetData.id)
                        {
                            result = true;
                        }
                        return result;
                    })
                    convos = filteredConvos;
                    return convos;
        })
        Swal.fire({
            text: `Left ${targetData.name}?`,
            icon: 'success',
            showCancelButton: true,
            confirmButtonText: 'Okay',
        })
    }
    const onCloseGroupUsersClicked = () => { 
        updateDisplayGroupUsers(false)
    }
    const onAxiosError = (e) => {
        _logger(e)
        toastr.error(e)
     }
    return (
        <>
            <div className="card messages-card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-3">
                            <div className="row mb-2">
                                <div className="col">
                                    <h3>Inbox</h3>
                                </div>
                                <div className="col">
                                    <img src={currentUserProfile?.avatarUrl} alt=""  className="user-image float-end"/>
                                </div>
                            </div>
                            <div className="row mb-2 align-items-center messages-icons border-top border-bottom">
                                <FiMessageSquare
                                    type="button"
                                    className="messages-icon"
                                    onClick={onDirMessageClicked}
                                    data-tip
                                    data-for="dmTip" />
                                <MdGroups
                                    className="messages-icon"
                                    onClick={onGroupMessageClicked}
                                    data-tip
                                    data-for="gmTip"/>
                                <Dropdown className="float-end messaging-add" align="end">
                                    <Dropdown.Toggle variant="link" className="arrow-none card-drop p-0 shadow-none">
                                        <BsPlusCircleFill className="messaging-add-icon"/>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={onNewDmClicked}>New Message</Dropdown.Item>
                                        <Dropdown.Item onClick={onNewGroupClicked}>Create Group</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                            <div className="row">
                                <div className="message-inbox">
                                    { selectedChat === "DirectMessages" && inboxMessages }
                                    {selectedChat === 'GroupMessages' && groupInboxMessages}
                                    {selectedChat === "GroupMessageForm" && <GroupMessageForm onClick={onCreateGroupClick} />}
                                </div>
                            </div>
                        </div>
                        <ChatWindow
                            currentMessages={selectedChat === 'DirectMessages' ? currentConversation : currentGroupMessages}
                            user={props.currentUser}
                            sendMessage={sendMessage}
                            connection={hubConnection}
                            targetData={targetData}
                            selectedChat={selectedChat}
                            onAddUser={onAddUserRequest}
                            leaveGroup={leaveGroupRequest}
                            removeUser={onRemoveUserRequest} />
                        {displayUserList && <UsersList
                            currentUser={props.currentUser}
                            newMessage={onNewMessage}
                            closeUserList={closeUserList}
                            addUserToGroup={addUserToGroup} />}
                        {displayGroupUsers &&
                            <div className="col-3">
                                <div className="row mb-3">
                                    <div className="col">
                                        <h3>Group Members</h3>
                                    </div>
                                    <div className="col">
                                        <button type="close" className="btn-close float-end" onClick={onCloseGroupUsersClicked}/>
                                    </div>
                                </div>
                                <div className="users-container text-center">
                                    {groupUsers}
                                </div>
                            </div>
                            }
                    </div>
                </div>
            </div>
            <ReactTooltip id="dmTip" place="bottom" effect="solid" type="dark">Direct Messages</ReactTooltip>
            <ReactTooltip id="gmTip" place="bottom" effect="solid" type="dark">Group Messages</ReactTooltip>
    </>
    )
}

Messages.propTypes = {
    currentUser: PropTypes.shape({
        email: PropTypes.string,
        id: PropTypes.number,
        isLoggedIn: PropTypes.bool,
        roles: PropTypes.arrayOf(PropTypes.string)
    })
}
 
export default Messages;
