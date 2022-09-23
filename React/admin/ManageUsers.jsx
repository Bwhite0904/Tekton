import React, { useEffect, useState } from 'react';
import { Col, Row, Dropdown } from 'react-bootstrap';
import Pagination from 'rc-pagination';
import { Link } from 'react-router-dom';
import toastr from 'toastr';
import debug from 'tekton-debug';
import Swal from 'sweetalert2';

import './admindashboard.css';
import 'rc-pagination/assets/index.css';

import userService from '../../../services/userService';
import UserDetails from './UserDetails';
import UserList from './UserList';

const _logger = debug.extend('ManageUsers');
const ManageUsers = () => {
    const [users, updateUsers] = useState([]);
    const [paginationData, setPaginationData] = useState({
        totalCount: 0,
        current: 1,
        pageSize: 10,
    });
    const [filterSelection, setFilterSelection] = useState('');
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [userDetails, setUserDetails] = useState();
    useEffect(() => {
        if (filterSelection === '') {
            userService
                .getUsersDetailed(paginationData.current - 1, paginationData.pageSize)
                .then(onGetUsersSuccess)
                .catch(onGetUsersError);
        } else {
            userService
                .searchUsersByRoleDetailed(paginationData.current - 1, paginationData.pageSize, filterSelection)
                .then(onGetUsersSuccess)
                .catch(onAxiosError);
        }
    }, [paginationData.current, paginationData.pageSize]);

    const onGetUsersSuccess = (data) => {
        _logger(data.item);
        setPaginationData((prevState) => {
            const pd = { ...prevState };
            pd.totalCount = data.item.totalCount;
            return pd;
        });
        const mappedDataNew = data.item.pagedItems.map(mapUsersToTable);
        updateUsers(mappedDataNew);
    };
    const onGetUsersError = (e) => {
        _logger(e);
        toastr.error(e);
    };

    const mapUsersToTable = (data) => {
        const formattedDate = new Date(data.userProfile.dateCreated).toLocaleDateString();
        let userRoles = '';
        if (data.roles !== null && data.roles.length > 1) {
            for (let i = 0; i < data.roles.length; i++) {
                const role = data.roles[i];
                if (i < data.roles.length - 1) {
                    userRoles = userRoles + `${role.name}, `;
                } else {
                    userRoles = userRoles + role.name;
                }
            }
        } else if (data.roles !== null) {
            userRoles = data.roles[0].name;
        }
        let userStatus = data.status;
        const onEmailClicked = () => {
            window.open(`mailto:${data.email}`);
        };
        const onActiveSuccess = async () => {
            await Swal.fire({
                icon: 'success',
                text: `${data.userProfile.firstName} ${data.userProfile.lastName}'s status set to Active`,
                showConfirmButton: true,
                confirmButtonText: 'Okay',
            });
            userService
                .getUsersDetailed(paginationData.current - 1, paginationData.pageSize)
                .then(onGetUsersSuccess)
                .catch(onGetUsersError);
        };
        const onInactiveSuccess = async () => {
            await Swal.fire({
                icon: 'success',
                text: `${data.userProfile.firstName} ${data.userProfile.lastName}'s status set to Inactive`,
                showConfirmButton: true,
                confirmButtonText: 'Okay',
            });
            userService
                .getUsersDetailed(paginationData.current - 1, paginationData.pageSize)
                .then(onGetUsersSuccess)
                .catch(onGetUsersError);
        };
        const onSetInactiveClicked = async () => {
            const result = await Swal.fire({
                icon: 'warning',
                text: `Are you sure you want to set ${data.userProfile.firstName} ${data.userProfile.lastName}'s status to Inactive?`,
                showConfirmButton: true,
                confirmButtonColor: 'red',
                confirmButtonText: 'Confirm',
                showCancelButton: true,
                cancelButtonColor: 'grey',
            });
            if (result.isConfirmed === true) {
                const payload = {
                    id: data.userProfile.userId,
                    statusId: 2,
                };
                userService.updateUserStatus(payload).then(onInactiveSuccess).catch(onAxiosError);
            }
        };
        const onSetActiveClicked = async () => {
            const result = await Swal.fire({
                icon: 'warning',
                text: `Are you sure you want to set ${data.userProfile.firstName} ${data.userProfile.lastName}'s status to Active?`,
                showConfirmButton: true,
                confirmButtonColor: 'red',
                confirmButtonText: 'Confirm',
                showCancelButton: true,
                cancelButtonColor: 'grey',
            });
            if (result.isConfirmed === true) {
                const payload = {
                    id: data.userProfile.userId,
                    statusId: 1,
                };
                userService.updateUserStatus(payload).then(onActiveSuccess).catch(onAxiosError);
            }
        };
        const onDetailsClicked = () => {
            const user = <UserDetails data={data} formattedDate={formattedDate} userRoles={userRoles} />;
            setUserDetails(user);
            setShowUserDetails(true);
        };
        return (
            <UserList
                key={`user_${data.userProfile.userId}`}
                userStatus={userStatus}
                userRoles={userRoles}
                onSetActiveClicked={onSetActiveClicked}
                onEmailClicked={onEmailClicked}
                onSetInactiveClicked={onSetInactiveClicked}
                onDetailsClicked={onDetailsClicked}
                data={data}
            />
        );
    };
    const onPaginationChange = (page) => {
        setPaginationData((prevState) => {
            const pd = { ...prevState };
            pd.current = page;
            return pd;
        });
    };

    const onAxiosError = (e) => {
        _logger(e);
        toastr.error(e);
    };

    const onSearchInput = (e) => {
        const query = e.target.value;
        if (e.target.value === '') {
            userService
                .getUsersDetailed(paginationData.current - 1, paginationData.pageSize)
                .then(onGetUsersSuccess)
                .catch(onGetUsersError);
        } else {
            userService
                .searchUsersDetailed(paginationData.current - 1, paginationData.pageSize, query)
                .then(onGetUsersSuccess)
                .catch(onUserSearchError);
        }
        setFilterSelection('');
    };
    const onUserSearchError = (e) => {
        _logger(e);
    };
    const onPageSizeClicked = (e) => {
        const value = e.target.attributes[0].value;
        switch (value) {
            case '10':
                setPaginationData((prevState) => {
                    const pd = { ...prevState };
                    pd.pageSize = 10;
                    return pd;
                });
                break;
            case '50':
                setPaginationData((prevState) => {
                    const pd = { ...prevState };
                    pd.pageSize = 50;
                    return pd;
                });
                break;
            case '100':
                setPaginationData((prevState) => {
                    const pd = { ...prevState };
                    pd.pageSize = 100;
                    return pd;
                });
                break;
            default:
                break;
        }
    };
    const onFilterSelected = (e) => {
        const value = e.target.attributes[0].value;
        switch (value) {
            case '1':
                setFilterSelection('User');
                userService
                    .searchUsersByRoleDetailed(0, paginationData.pageSize, 'User')
                    .then(onGetUsersSuccess)
                    .catch(onAxiosError);
                break;
            case '2':
                setFilterSelection('Subcontractor');
                userService
                    .searchUsersByRoleDetailed(0, paginationData.pageSize, 'Subcontractor')
                    .then(onGetUsersSuccess)
                    .catch(onAxiosError);
                break;
            case '3':
                setFilterSelection('Employee');
                userService
                    .searchUsersByRoleDetailed(0, paginationData.pageSize, 'Employee')
                    .then(onGetUsersSuccess)
                    .catch(onAxiosError);
                break;
            case '4':
                setFilterSelection('Organization');
                userService
                    .searchUsersByRoleDetailed(0, paginationData.pageSize, 'Organization')
                    .then(onGetUsersSuccess)
                    .catch(onAxiosError);
                break;
            case '5':
                setFilterSelection('OrgAdmin');
                userService
                    .searchUsersByRoleDetailed(0, paginationData.pageSize, 'OrgAdmin')
                    .then(onGetUsersSuccess)
                    .catch(onAxiosError);
                break;
            case '6':
                setFilterSelection('Admin');
                userService
                    .searchUsersByRoleDetailed(0, paginationData.pageSize, 'Admin')
                    .then(onGetUsersSuccess)
                    .catch(onAxiosError);
                break;
            default:
                break;
        }
    };
    const onGoBackClicked = () => {
        setShowUserDetails(false);
    };
    return (
        <>
            <Row className="mt-2 align-items-center">
                <Col>
                    <h1>Manage Users</h1>
                </Col>
            </Row>
            <Row className="align-items-center mb-2">
                {!showUserDetails ? (
                    <Col className="mb-2 mt-2 col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1">
                        <Link to="/dashboard/admin" className="btn btn-primary">
                            Dashboard
                        </Link>
                    </Col>
                ) : (
                    <Col>
                        <button type="button" onClick={onGoBackClicked} className="btn btn-secondary">
                            Go Back
                        </button>
                    </Col>
                )}
                {!showUserDetails && (
                    <>
                        <Col className="mb-2 mt-2 col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1">
                            <Dropdown>
                                <Dropdown.Toggle variant="secondary">{`Page Size (${paginationData.pageSize})`}</Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={onPageSizeClicked} value={10}>
                                        10
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={onPageSizeClicked} value={50}>
                                        50
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={onPageSizeClicked} value={100}>
                                        100
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col className="mb-2 mt-2 col-12 col-sm-12 col-md-12 col-lg-4 col-xl-4">
                            <Pagination
                                current={paginationData.current}
                                pageSize={paginationData.pageSize}
                                total={paginationData.totalCount}
                                onChange={onPaginationChange}
                            />
                        </Col>
                        <Col className="mb-2 mt-2 col-12 col-sm-12 col-md-12 col-lg-1 col-xl-1">
                            <Dropdown className="float-end">
                                <Dropdown.Toggle variant="secondary">
                                    {filterSelection === '' ? 'Filter Role' : filterSelection}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={onFilterSelected} value={1}>
                                        User
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={onFilterSelected} value={2}>
                                        Subcontractor
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={onFilterSelected} value={3}>
                                        Employee
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={onFilterSelected} value={4}>
                                        Organization
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={onFilterSelected} value={5}>
                                        OrgAdmin
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={onFilterSelected} value={6}>
                                        Admin
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </Col>
                        <Col className="mb-2 mt-2 col-12 col-sm-12 col-md-12 col-lg-5 col-xl-5">
                            <input
                                type="text"
                                className="form-control float-end"
                                placeholder="Search by first name, last name or email"
                                onChange={onSearchInput}
                            />
                        </Col>
                    </>
                )}
            </Row>
            {!showUserDetails ? (
                <>
                    <Row className="manage-users-header-container">
                        <Col className="manage-users-header text-center">
                            <Row className="align-items-center">
                                <Col>
                                    <img src="..." alt="..." className="invisible manage-users-img" />
                                </Col>
                                <Col>
                                    <h4>First Name</h4>
                                </Col>
                                <Col>
                                    <h4>Last Name</h4>
                                </Col>
                            </Row>
                        </Col>
                        <Col className="manage-users-header">
                            <h4>Email</h4>
                        </Col>
                        <Col className="manage-users-header">
                            <h4>Roles</h4>
                        </Col>
                        <Col>
                            <Row>
                                <Col className="manage-users-header">
                                    <h4>Status</h4>
                                </Col>
                                <Col className="manage-users-header">
                                    <h4 className="float-end">Actions</h4>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col className="manage-users-container">{users}</Col>
                    </Row>
                </>
            ) : (
                <>
                    <Row>{userDetails}</Row>
                </>
            )}
        </>
    );
};

export default ManageUsers;
