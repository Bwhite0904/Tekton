import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const RecentBlog = (props) => {
    const formattedText = props.blog?.content?.slice(0, 600);
    const formattedDate = new Date(props.blog.datePublished).toLocaleDateString();
    return (
        <>
            <Col className="text-center col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <Card className="mt-2 shadow-0">
                    <Card.Body>
                        <Row>
                            <Col className="text-center">
                                <h3>Recent Blog Post</h3>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-center col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                <h4>{props.blog.title}</h4>
                                <img className="admin-recent-img" src={props.blog.imageUrl} alt="..." />
                            </Col>
                            <Col className="col-12 col-sm-12 col-md-12 col-lg-12 col-xl-6">
                                <p className="mt-2">{props.blog.content !== undefined ? `${formattedText}...` : ''}</p>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-center">
                                <strong>{`Date Published: ${formattedDate}`}</strong>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-center mt-1">
                                <Link type="button" className="btn btn-primary col-4" to="/blogs" target="_blank">
                                    View Blogs
                                </Link>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        </>
    );
};

RecentBlog.propTypes = {
    blog: PropTypes.shape({
        id: PropTypes.number,
        title: PropTypes.string,
        content: PropTypes.string,
        imageUrl: PropTypes.string,
        datePublished: PropTypes.string,
    }).isRequired,
};

export default RecentBlog;
