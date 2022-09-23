import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import toastr from 'toastr';

import debug from 'tekton-debug';

import Users from './Users';
import Subcontractors from './Subcontractors';
import Organizations from './Organizations';
import TrainingProviders from './TrainingProviders';
import AdminDashboardChart from './AdminDashboardChart';
import RecentOrganizations from './RecentOrganizations';
import RecentBlog from './RecentBlog';
import RecentJob from './RecentJob';

import adminDataService from '../../../services/adminDataService';
import blogsService from '../../../services/blogsService';
import jobsService from '../../../services/jobsService';

import './admindashboard.css';

const _logger = debug.extend('AdminDashboard');

const AdminDashboard = () => {
    const [adminData, updateAdminData] = useState({
        activeUsers: 0,
        inactiveUsers: 0,
        totalUsers: 0,
        activeSubcontractors: 0,
        inactiveSubcontractors: 0,
        organizationCount: 0,
        trainingProviderCount: 0,
        recentOrganizations: [],
    });
    const [recentBlog, updateRecentBlog] = useState({});
    const [recentJob, updateRecentJob] = useState({});

    useEffect(() => {
        const payload = {
            fromDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        };
        adminDataService.getAdminData(payload).then(onGetAdminDataSuccess).catch(onAxiosError);
        blogsService.getLast().then(onGetLastBlogSuccess).catch(onAxiosError);
        jobsService.newest().then(onGetJobSuccess).catch(onAxiosError);
    }, []);
    const onGetAdminDataSuccess = (data) => {
        updateAdminData(data.item);
    };
    const onGetLastBlogSuccess = (data) => {
        updateRecentBlog(data.item);
    };
    const onGetJobSuccess = (data) => {
        updateRecentJob(data.items[0]);
    };
    const onAxiosError = (e) => {
        _logger(e);
        toastr.error(e);
    };
    return (
        <>
            <Row className="mt-2 align-items-center">
                <h1>Dashboard</h1>
            </Row>
            <Row>
                <Col>
                    <Link to="/dashboard/admin/manageusers" type="button" className="btn btn-primary m-1">
                        Manage Users
                    </Link>
                </Col>
            </Row>
            <Row>
                <Users
                    activeUsers={adminData.activeUsers}
                    inactiveUsers={adminData.inactiveUsers}
                    totalUsers={adminData.totalUsers}
                />
                <Subcontractors
                    activeSubs={adminData.activeSubcontractors}
                    inactiveSubs={adminData.inactiveSubcontractors}
                />
                <Organizations count={adminData.organizationCount} />
                <TrainingProviders count={adminData.trainingProviderCount} />
            </Row>
            <AdminDashboardChart />
            <Row>
                <RecentOrganizations orgs={adminData.recentOrganizations} />
                <RecentBlog blog={recentBlog} />
                <RecentJob job={recentJob} />
            </Row>
        </>
    );
};

export default AdminDashboard;
