using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Sabio.Models;
using Sabio.Models.Domain.Messages;
using Sabio.Models.Requests.Messages;
using Sabio.Services;
using Sabio.Services.Interfaces;
using Sabio.Web.Controllers;
using Sabio.Web.Models.Responses;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace Sabio.Web.Api.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessageApiController : BaseApiController
    {
        private IMessageService _service = null;
        private IAuthenticationService<int> _authService;
        public MessageApiController(IMessageService service
            , ILogger<MessageApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }
        #region-----DirectMessages-----

        [HttpPost]
        public ActionResult<ItemResponse<int>> Add(MessageAddRequest messageModel)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                int messageId = _service.Add(messageModel, userId);

                ItemResponse<int> response = new ItemResponse<int>() { Item = messageId };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }
        [HttpGet("sender/{id:int}")]
        public ActionResult<ItemResponse<Paged<Message>>> GetMessagesBySenderId(int id, int pageIndex, int pageSize) 
        {
            ActionResult result = null;
            try
            {
                Paged<Message> pagedMessages = _service.SelectBySenderId(id, pageIndex, pageSize);

                if (pagedMessages == null)
                {

                    result = NotFound404(new ErrorResponse("Records not found."));
                }
                else
                {
                    ItemResponse<Paged<Message>> response = new ItemResponse<Paged<Message>>();
                    response.Item = pagedMessages;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.ToString()));
            }
            return result;
        }
        [HttpGet("recipient/{id:int}")]
        public ActionResult<ItemResponse<Paged<Message>>> GetMessagesByRecipientId(int id, int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<Message> pagedMessages = _service.SelectByRecipientId(id, pageIndex, pageSize);

                if (pagedMessages == null)
                {

                    result = NotFound404(new ErrorResponse("Records not found."));
                }
                else
                {
                    ItemResponse<Paged<Message>> response = new ItemResponse<Paged<Message>>();
                    response.Item = pagedMessages;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.ToString()));
            }
            return result;
        }
        [HttpGet("conversation/{id:int}")]
        public ActionResult<ItemResponse<List<Message>>> GetConversationByID(int id)
        {
            ActionResult result = null;
            try
            {
                List<Message> messagesList = _service.GetConversation(id);

                if (messagesList == null)
                {

                    result = NotFound404(new ErrorResponse("Records not found."));
                }
                else
                {
                    ItemResponse<List<Message>> response = new ItemResponse<List<Message>>();
                    response.Item = messagesList;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.ToString()));
            }
            return result;
        }
        [HttpPut("{id:int}")]
        public ActionResult<SuccessResponse> Update(int messageId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.UpdateDateRead(messageId);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }

        [HttpDelete("{id:int}")]
        public ActionResult<SuccessResponse> Delete(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.DeleteMessage(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }
        #endregion
        #region-----GroupMessages-----

        [HttpPost("group")]
        public ActionResult<ItemResponse<int>> CreateGroupMessage(GroupMessageAddRequest messageModel)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                messageModel.SenderId = userId;
                int messageId = _service.AddGroupMessage(messageModel);

                ItemResponse<int> response = new ItemResponse<int>() { Item = messageId };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }
        [HttpGet("group/{id:int}/paginate")]
        public ActionResult<ItemResponse<Paged<GroupMessage>>> SelectGroupMessagesByGroupId(int id, int pageIndex, int pageSize)
        {
            ActionResult result = null;
            try
            {
                Paged<GroupMessage> pagedMessages = _service.SelectGroupMessageByGroupId(id, pageIndex, pageSize);

                if (pagedMessages == null)
                {

                    result = NotFound404(new ErrorResponse("Records not found."));
                }
                else
                {
                    ItemResponse<Paged<GroupMessage>> response = new ItemResponse<Paged<GroupMessage>>();
                    response.Item = pagedMessages;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.ToString()));
            }
            return result;
        }
        [HttpGet("group/{id:int}")]
        public ActionResult<ItemResponse<GroupMessage>> SelectGroupMessageById(int id)
        {
            ActionResult result = null;

            try
            {
                GroupMessage message = _service.SelectGroupMessageById(id);

                if (message == null)
                {
                    result = NotFound404(new ErrorResponse("Records not found."));
                }
                else
                {
                    ItemResponse<GroupMessage> response = new ItemResponse<GroupMessage>();
                    response.Item = message;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.ToString()));
            }
            return result;
        }
        [HttpPut("group/{id:int}")]
        public ActionResult<SuccessResponse> UpdateGroupMessage(GroupMessageUpdateRequest updateModel)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.UpdateGroupMessage(updateModel);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                if (ex.Message == "Record not found.")
                {
                    iCode = 404;
                    response = new ErrorResponse(ex.Message);
                }
                else 
                {
                    iCode = 500;
                    response = new ErrorResponse(ex.Message);
                    base.Logger.LogError(ex.ToString());
                }
            }
            return StatusCode(iCode, response);
        }
        [HttpDelete("group/{id:int}")]
        public ActionResult<SuccessResponse> DeleteGroupMessageById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.DeleteGroupMessageById(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                if (ex.Message == "Record not found.")
                {
                    iCode = 404;
                    response = new ErrorResponse(ex.Message);
                }
                else
                {
                    iCode = 500;
                    response = new ErrorResponse(ex.Message);
                    base.Logger.LogError(ex.ToString());
                }
            }
            return StatusCode(iCode, response);
        }
        #endregion
        #region-----MessagingGroups------
        [HttpPost("groups")]
        public ActionResult<ItemResponse<int>> CreateMessagingGroup(MessagingGroupAddRequest groupModel)
        {
            ObjectResult result = null;

            try
            {
                int userId = _authService.GetCurrentUserId();
                groupModel.CreatedById = userId;
                int messageId = _service.MessagingGroupAdd(groupModel);

                ItemResponse<int> response = new ItemResponse<int>() { Item = messageId };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }
        [HttpGet("groups/{id:int}")]
        public ActionResult<ItemResponse<MessagingGroup>> SelectMessagingGroupById(int id)
        {
            ActionResult result = null;
            try
            {
                MessagingGroup group = _service.SelectMessagingGroupById(id);

                if (group == null)
                {

                    result = NotFound404(new ErrorResponse("Records not found."));
                }
                else
                {
                    ItemResponse<MessagingGroup> response = new ItemResponse<MessagingGroup>();
                    response.Item = group;
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.ToString()));
            }
            return result;
        }
        [HttpGet("groups/user/{id:int}")]
        public ActionResult<ItemsResponse<MessagingGroup>> SelectMessagingGroupsByUserId(int id)
        {
            ActionResult result = null;
            try
            {
                List<MessagingGroup> groups = _service.SelectMessagingGroupsByUserId(id);

                if (groups == null)
                {

                    result = NotFound404(new ErrorResponse("Records not found."));
                }
                else
                {
                    ItemsResponse<MessagingGroup> response = new ItemsResponse<MessagingGroup>() { Items = groups };
                    result = Ok200(response);
                }
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.ToString()));
            }
            return result;
        }
        [HttpPut("groups/{id:int}")]
        public ActionResult<SuccessResponse> UpdateMessagingGroupById(MessagingGroupUpdateRequest groupModel)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.UpdateMessagingGroup(groupModel);
                response = new SuccessResponse();
            }
            catch (SqlException)
            {
                iCode = 404;
                response = new ErrorResponse("Record Not Found");
            }
            catch (Exception ex)
            {
                if (ex.Message == "Record not found.")
                {
                    iCode = 404;
                    response = new ErrorResponse(ex.Message);
                }
                else
                {
                    iCode = 500;
                    response = new ErrorResponse(ex.Message);
                    base.Logger.LogError(ex.ToString());
                }
            }
            return StatusCode(iCode, response);
        }
        [HttpDelete("groups/{id:int}")]
        public ActionResult<SuccessResponse> DeleteMessagingGroupById(int id)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.DeleteMessagingGroupById(id);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                if (ex.Message == "Record not found.")
                {
                    iCode = 404;
                    response = new ErrorResponse(ex.Message);
                }
                else
                {
                    iCode = 500;
                    response = new ErrorResponse(ex.Message);
                    base.Logger.LogError(ex.ToString());
                }
            }
            return StatusCode(iCode, response);
        }
        [HttpPost("groups/users")]
        public ActionResult<ItemResponse<int>> AddUserToMessageGroup(MessagingGroupUserAddRequest userAddRequest)
        {
            ObjectResult result = null;

            try
            {
                int addedById = _authService.GetCurrentUserId();
                int outputId = _service.AddGroupMember(userAddRequest);

                ItemResponse<int> response = new ItemResponse<int>() { Item = outputId };

                result = Created201(response);
            }
            catch (Exception ex)
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }
        [HttpDelete("groups/users/{id:int}")]
        public ActionResult<SuccessResponse> DeleteUserFromGroup(int id, int groupId)
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.RemoveGroupMember(id, groupId);

                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                if (ex.Message == "Record not found.")
                {
                    iCode = 404;
                    response = new ErrorResponse(ex.Message);
                }
                else
                {
                    iCode = 500;
                    response = new ErrorResponse(ex.Message);
                    base.Logger.LogError(ex.ToString());
                }
            }
            return StatusCode(iCode, response);
        }

        #endregion
    }
}
