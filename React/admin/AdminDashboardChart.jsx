import React, { useState, useEffect } from 'react';
import { Row, Col, Dropdown, Card } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import adminDataService from '../../../services/adminDataService';
import toastr from 'toastr';
import debug from 'tekton-debug';

const _logger = debug.extend('AdminDashboardChart');

const AdminDashboardChart = () => {
    const [data, setData] = useState({
        usersStart: 0,
        totalUsers: 0,
        subsStart: 0,
        totalSubs: 0,
        orgsStart: 0,
        totalOrgs: 0,
    });
    const [selection, setSelection] = useState('Users');
    const [period, setPeriod] = useState('Last 7 Days');
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        onWeekClicked();
    }, []);
    useEffect(() => {
        if (selection === 'Users') {
            setChartData([data.usersStart, data.totalUsers]);
        } else if (selection === 'Subcontractors') {
            setChartData([data.subsStart, data.totalSubs]);
        } else {
            setChartData([data.orgsStart, data.totalOrgs]);
        }
    }, [data]);
    const onUsersClicked = (e) => {
        e.preventDefault();
        setSelection('Users');
        setChartData([data.usersStart, data.totalUsers]);
    };
    const onSubsClicked = (e) => {
        e.preventDefault();
        setSelection('Subcontractors');
        setChartData([data.subsStart, data.totalSubs]);
    };
    const onOrgsClicked = (e) => {
        e.preventDefault();
        setSelection('Organizations');
        setChartData([data.orgsStart, data.totalOrgs]);
    };
    const onWeekClicked = async () => {
        setPeriod('Last 7 Days');
        const payload = {
            fromDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        };
        await adminDataService.getAdminData(payload).then(onGetDataSuccess).catch(onGetDataError);
    };
    const onMonthClicked = async () => {
        setPeriod('Last 30 Days');
        const payload = {
            fromDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        };
        await adminDataService.getAdminData(payload).then(onGetDataSuccess).catch(onGetDataError);
    };
    const onYearClicked = async () => {
        setPeriod('Last 365 Days');
        const payload = {
            fromDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        };
        await adminDataService.getAdminData(payload).then(onGetDataSuccess).catch(onGetDataError);
    };
    const onGetDataSuccess = (res) => {
        setData((prevState) => {
            const newData = { ...prevState };
            newData.usersStart = res.item.totalUsers - res.item.usersJoined;
            newData.subsStart = res.item.totalSubcontractors - res.item.subcontractorsJoined;
            newData.orgsStart = res.item.organizationCount - res.item.organizationsJoined;
            newData.totalUsers = res.item.totalUsers;
            newData.totalSubs = res.item.totalSubcontractors;
            newData.totalOrgs = res.item.organizationCount;
            return newData;
        });
    };
    const onGetDataError = (e) => {
        _logger(e);
        toastr.error(e);
    };
    const series = [
        //data on the y-axis
        {
            name: `${selection}`,
            data: chartData,
        },
    ];
    const options = {
        //data on the x-axis
        chart: { id: 'bar-chart' },
        xaxis: {
            categories: [],
        },
        stroke: {
            curve: 'smooth',
        },
    };
    return (
        <>
            <Row className="mb-2 align-items-center">
                <Col className="d-flex col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <Dropdown className="m-1">
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            {period !== 'Last 7 Days' ? period : 'Last 7 Days'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item value={1} key={'weekly'} onClick={onWeekClicked}>
                                {'Last 7 Days'}
                            </Dropdown.Item>
                            <Dropdown.Item key={'monthly'} onClick={onMonthClicked}>
                                {'Las 30 Days'}
                            </Dropdown.Item>
                            <Dropdown.Item key={'yearly'} onClick={onYearClicked}>
                                {'Last 365 Days'}
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <h3>{`${selection} Joined (${period})`}</h3>
                </Col>
                <Col className="col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <Dropdown className="float-end">
                        <Dropdown.Toggle variant="primary" id="dropdown-basic">
                            {selection !== 'Users' ? selection : 'Users'}
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item value={1} key={'users_chart'} onClick={onUsersClicked}>
                                {'Users'}
                            </Dropdown.Item>
                            <Dropdown.Item key={'subs_chart'} onClick={onSubsClicked}>
                                {'Subcontractors'}
                            </Dropdown.Item>
                            <Dropdown.Item key={'orgs_chart'} onClick={onOrgsClicked}>
                                {'Organizations'}
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Chart series={series} options={options} height={400} className="admin-chart" />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default AdminDashboardChart;
