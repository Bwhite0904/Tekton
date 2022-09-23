import React from 'react';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { ImFilePdf } from 'react-icons/im';
import { RiFolderZipLine } from 'react-icons/ri';
import debug from 'sabio-debug';

const _logger = debug.extend('ChatMessage');

const ChatMessage = (props) => {
    false && _logger();
    if (props.message.message.includes('https')) {
        const fileSplit = props.message.message.split('/');
        let fileName = fileSplit[3].split('_');
        fileName = fileName[1];
        if (fileName.includes('.pdf')) {
            return (
                <>
                    <div className="row">
                        <div className="card col-4 chat-file">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-3">
                                        <a href={props.message.message} target="_blank" rel="noreferrer" download>
                                            <ImFilePdf className="messaging-file-icons" />
                                        </a>
                                    </div>
                                    <div className="col-9 text-center">
                                        <h4>{fileName}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else if (fileName.includes('.jpg') || fileName.includes('.png') || fileName.includes('.gif')) {
            return (
                <>
                    <ReactTooltip id={`${fileName}_tip`} place="left" effect="solid" type="dark">
                        {fileName}
                    </ReactTooltip>
                    <div className="row">
                        <div className="col-3">
                            <a href={props.message.message} target="_blank" rel="noreferrer" download>
                                <img
                                    src={props.message.message}
                                    alt="..."
                                    className="chat-file-image"
                                    data-tip
                                    data-for={`${fileName}_tip`}
                                />
                            </a>
                        </div>
                    </div>
                </>
            );
        } else if (fileName.includes('.zip')) {
            return (
                <>
                    <ReactTooltip id={`${fileName}_tip`} place="left" effect="solid" type="dark">
                        Download File
                    </ReactTooltip>
                    <div className="row">
                        <div className="card col-4 chat-file">
                            <div className="card-body">
                                <div className="row align-items-center">
                                    <div className="col-3">
                                        <a href={props.message.message} target="_blank" rel="noreferrer" download>
                                            <RiFolderZipLine
                                                className="messaging-file-icons"
                                                data-tip
                                                data-for={`${fileName}_tip`}
                                            />
                                        </a>
                                    </div>
                                    <div className="col-9 text-center">
                                        <h4>{fileName}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            );
        } else {
            return null;
        }
    } else {
        return (
            <>
                <div className="row algin-items-center">
                    <div className={props.user.id === props.message.sender.userId ? 'col text-right' : 'col'}>
                        <div
                            className={
                                props.user.id === props.message.sender.userId
                                    ? 'bubble message-user'
                                    : 'bubble message-incoming'
                            }>
                            <img
                                src={props.message.sender.avatarUrl}
                                className={
                                    props.user.id === props.message.sender.userId
                                        ? 'chat-message-image float-end'
                                        : 'chat-message-image'
                                }
                                alt="..."
                            />
                            {props.message.message}
                        </div>
                    </div>
                </div>
            </>
        );
    }
};

ChatMessage.propTypes = {
    message: PropTypes.shape({
        dateSent: PropTypes.string,
        message: PropTypes.string,
        sender: PropTypes.shape({
            id: PropTypes.number,
            userId: PropTypes.number,
            firstName: PropTypes.string,
            lastName: PropTypes.string,
            mi: PropTypes.string,
            avatarUrl: PropTypes.string,
        }),
    }).isRequired,
    user: PropTypes.shape({
        id: PropTypes.number,
        email: PropTypes.string,
        isLoggedIn: PropTypes.bool,
        roles: PropTypes.arrayOf(PropTypes.string),
    }).isRequired,
};

export default React.memo(ChatMessage);
