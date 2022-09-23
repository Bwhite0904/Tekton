import React, { useEffect, useState } from 'react';

import toastr from 'toastr';

import { Formik, Form, Field } from 'formik';
import messagingSchema from '../../schemas/messagesValidation';

import userProfiles from '../../services/userProfileService';
import UserListItem from './UserListItem';

import PropTypes from 'prop-types';

const UsersList = (props) => {
    const [users, updateUsers] = useState([])
    const [searchData] = useState({
        input: '',
    });
    const [userList, updateUserList] = useState([]);
    const [currentUserProfile, updateCurrentUserProfile] = useState({});
    const [renderData, updateRenderData] = useState('userList');
    useEffect(() => {
        userProfiles.getUsers(0, 1).then(onGetUsersSuccess).catch();
    }, []);
    const onGetUsersSuccess = (data) => {
        if (data.item.totalCount > 4) {
            userProfiles.getUsers(0, data.item.totalCount).then(onGetAllSuccess).catch(onGetAllError);
        }
    };

    const onGetAllSuccess = (data) => {
        updateUsers(data.item.pagedItems);
        const mappedUsers = data.item.pagedItems.map(mapUsersToList);
        updateUserList(mappedUsers);
    };
    const onGetAllError = (e) => {
        toastr.error(e)
    }
    const onUserClicked = (user) => {
        updateCurrentUserProfile(user)
        updateRenderData("userProfile")
    }
    const onCloseProfileClicked = () => { 
        updateRenderData("userList")
    }
    const addUserToGroup = (userData) => {
        props.addUserToGroup(userData)
     }
    const mapUsersToList = (user) => {
        if (user.firstName !== null && user.lastName !== null && user.avatarUrl !== null) {
            return (
                <UserListItem
                    user={user}
                    key={`user_${user.id}`}
                    userClicked={onUserClicked}
                    closeProfile={onCloseProfileClicked}
                    newMessage={props.newMessage}
                    addUserToGroup={addUserToGroup} />
            )
        }
        else { return; }
        
    }
    const handleChange = (e) => {
        const inputValue = e.target.value.toLowerCase();
        let usersList = users
            const filter = usersList.filter((user) => {
                let result = false
                if (user.firstName !== null && user.lastName !== null) {
                    if (user.firstName.toLowerCase().includes(inputValue)) { result = true }
                    else if (user.lastName.toLowerCase().includes(inputValue)) { result = true }
                 }
                return result;
            })
            if (filter.length > 0) {
                const newList = filter.map(mapUsersToList)
                updateUserList(newList)
            }
        }
    const handleSubmit = ({ resetForm}) => {
        resetForm({values: ''})
    }
    const onCloseClicked = () => {
        props.closeUserList()
     }
    return (
        <>
            <div className="col-3">
                <div className="row mb-3">
                    <div className="col">
                        <h3>Users</h3>
                    </div>
                    <div className="col">
                        <button type="close" className="btn-close float-end" onClick={onCloseClicked}/>
                    </div>
                </div>
                <div className="row mb-3">
                    <Formik
                        enableReinitialize={true}
                        initialValues={searchData}
                        onSubmit={handleSubmit}
                        value={searchData}
                        validationSchema={messagingSchema.messageValidationSchema}>
                        {({ isValid, dirty }) => (
                            <Form onChange={handleChange}>
                                <div className="row">
                                    <div className="form-group col-9">
                                        <Field className="form-control" type='text' name='input' placeholder='search users' />
                                    </div>
                                    <button type="submit" className="btn btn-primary float-end col-3" disabled={!isValid || !dirty}>Search</button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
                <div className="users-container text-center">
                    {renderData === "userList" && userList}
                    { renderData === "userProfile" && currentUserProfile }
                </div>
            </div>
        </>
    )
}

UsersList.propTypes = {
    currentUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
    }),
    newMessage: PropTypes.func.isRequired,
    closeUserList: PropTypes.func.isRequired,
    addUserToGroup: PropTypes.func.isRequired
};
export default UsersList;
