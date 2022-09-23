import axios from "axios";
import { API_HOST_PREFIX, onGlobalError, onGlobalSuccess } from "./serviceHelpers";
const directMessages = API_HOST_PREFIX + '/api/messages'
const groupMessages = API_HOST_PREFIX + '/api/messages/group'
const messagingGroups = API_HOST_PREFIX + '/api/messages/groups'

//#region -------Direct Messages---------
//---All calls related to direct messages---
const addMessage = (payload) => {
    const config =
    {
        method: "POST",
        url: directMessages,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    };
    
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const deleteMessageById = (messageId) => {
    const config =
    {
        method: "DELETE",
        url: `${directMessages}/${messageId}`,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    };
    
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getConversation = (senderId) => {
    const config = {

        method: "GET",
        url: `${directMessages}/conversation/${senderId}`,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    };

    return axios(config).then(onGlobalSuccess).then(r => r.item).catch(onGlobalError);

};
 
const getMessagesByRecipient = (recipientId, pageIndex, pageSize) => {
    const config = {

        method: "GET",
        url: `${directMessages}/recipient/${recipientId}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);

};

const getMessageBySender = (senderId, pageIndex, pageSize) => {
    const config = {

        method: "GET",
        url: `${directMessages}/sender/${senderId}?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    };

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);

};

const updateMessage = (messageId, payload) => {
    const config =
    {
        method: "PUT",
        url: `${directMessages}/${messageId}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { 'Content-Type': 'application/json' },
    };
    
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

//#endregion
 
//#region -------Group Messages----------
//All calls related to group messages
const addGroupMessage = (payload) =>
{
    const config =
    {
        method: "POST",
        url: groupMessages,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const getGroupMessagesByGroupId = (id, pageIndex, pageSize) =>
{
    const config =
    {
        method: "GET",
        url: `${groupMessages}/${id}/paginate?pageIndex=${pageIndex}&pageSize=${pageSize}`,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError).then(r=>r.item);
}
 
const getGroupMessageById = (id) => {
    
    const config =
    {
        method: "GET",
        url: `${groupMessages}/${id}`,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}
 
const updateGroupMessage = (id, payload) => { 
    const config =
    {
        method: "PUT",
        url: `${groupMessages}/${id}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const deleteGroupMessageById = (id) => { 
    const config =
    {
        method: "DELETE",
        url: `${groupMessages}/${id}`,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    }
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}
//#endregion
 
//#region -------Message Groups----------
//All calls related to managing groups in messaging
const createMessageGroup = (payload) => { 
    const config =
    { 
        method: "POST",
        url: messagingGroups,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    }

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const getMessageGroupById = (id) => {
    const config =
    {
        method: "GET",
        url: `${messagingGroups}/${id}`,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }  
    }
    
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const getMessageGroupsByUserId = (userId) => { 
    const config =
    {
        method: "GET",
        url: `${messagingGroups}/user/${userId}`,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" } 
    }

    return axios(config).then(onGlobalSuccess).catch(onGlobalError).then(r => r.item);
}

const updateMessageGroup = (id, payload) => {
    const config =
    {
        method: "PUT",
        url: `${messagingGroups}/${id}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" } 
    }

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}
 
const deleteMessageGroup = (id) => { 
    const config =
    {
        method: "DELETE",
        url: `${messagingGroups}/${id}`,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" } 
    }

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}

const addUserToMessageGroup = (payload) => {
    const config =
    { 
        method: "POST",
        url: `${messagingGroups}/users`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" }
    }
    
    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}
 
const removeUserFromMessageGroup = (id, payload) => { 
    const config =
    {
        method: "DELETE",
        url: `${messagingGroups}/users/${id}`,
        data: payload,
        withCredentials: true,
        crossdomain: true,
        headers: { "Content-Type": "application/json" } 
    }

    return axios(config).then(onGlobalSuccess).catch(onGlobalError);
}
//#endregion

export {
    addMessage
    , getMessageBySender
    , getMessagesByRecipient
    , getConversation
    , deleteMessageById
    , updateMessage
    , addGroupMessage
    , getGroupMessagesByGroupId
    , getGroupMessageById
    , updateGroupMessage
    , deleteGroupMessageById
    , createMessageGroup
    , getMessageGroupById
    , getMessageGroupsByUserId
    , updateMessageGroup
    , deleteMessageGroup
    , addUserToMessageGroup
    , removeUserFromMessageGroup
};