using Tekton.Data;
using Tekton.Data.Providers;
using Tekton.Models;
using Tekton.Models.Domain;
using Tekton.Models.Domain.Messages;
using Tekton.Models.Requests.Messages;
using Tekton.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace Tekton.Services
{
    public class MessageService : IMessageService
    {
        IDataProvider _data = null;

        public MessageService(IDataProvider data)
        {
            _data = data;
        }
        #region-----Direct Messages-----
        public int Add(MessageAddRequest messageModel, int userId)
        {
            int id = 0;
            string procName = "[dbo].[Messages_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection messageCol)
            {
                AddCommonParams(messageModel, messageCol, userId);
                SqlParameter messageIdOut = new SqlParameter("@Id", SqlDbType.Int);
                messageIdOut.Direction = ParameterDirection.Output;
                messageCol.Add(messageIdOut);
            }
            ,
            returnParameters: delegate (SqlParameterCollection returnMessageCol)
            {
                object oId = returnMessageCol["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }
        public Paged<Message> SelectBySenderId(int senderId, int pageIndex, int pageSize) 
        {
            string procName = "[Messages_Select_BySenderId]";
            Paged<Message> pagedMessages = null;
            List<Message> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection messageCol)
            {
                messageCol.AddWithValue("@Id", senderId);
                messageCol.AddWithValue("@PageIndex", pageIndex);
                messageCol.AddWithValue("@PageSize", pageSize);
            }
            ,
            singleRecordMapper: delegate (IDataReader reader, short set) 
            {
                int startingIndex = 0;
                Message retMessage = MapSingleMessage(reader, ref startingIndex);

                if (totalCount == 0) 
                {
                    totalCount = reader.GetSafeInt32(startingIndex);
                }
                if (list == null) 
                {
                    list = new List<Message>();
                }
                list.Add(retMessage);
            });
            if (list != null) 
            {
                pagedMessages = new Paged<Message>(list, pageIndex, pageSize, totalCount);
            }
            return pagedMessages;
        }
        public Paged<Message> SelectByRecipientId(int recipientId, int pageIndex, int pageSize)
        {
            string procName = "[dbo].[Messages_Select_ByRece]";
            Paged<Message> pagedMessages = null;
            List<Message> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection messageCol)
            {
                messageCol.AddWithValue("@RecipientId", recipientId);
                messageCol.AddWithValue("@PageIndex", pageIndex);
                messageCol.AddWithValue("@PageSize", pageSize);
            }
            ,
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Message retMessage = MapSingleMessage(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex);
                }
                if (list == null)
                {
                    list = new List<Message>();
                }
                list.Add(retMessage);
            });
            if (list != null)
            {
                pagedMessages = new Paged<Message>(list, pageIndex, pageSize, totalCount);
            }
            return pagedMessages;
        }
        public List<Message> GetConversation(int userId)
        {
            string procName = "[Messages_Select_Conversation]";
            List<Message> list = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection messageCol)
            {
                messageCol.AddWithValue("@UserId", userId);
            }
            ,
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                Message retMessage = MapSingleMessage(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex);
                }
                if (list == null)
                {
                    list = new List<Message>();
                }
                list.Add(retMessage);
            });
            
            return list;
        }
        public Message SelectByMessageId(int messageId) 
        {
            string procName = "[dbo].[Messages_Select_ByMessageId]";
            Message retMessage = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection messageCol)
            {
                messageCol.AddWithValue("@MessageId", messageId);
            }
            ,
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                retMessage = MapSingleMessage(reader, ref startingIndex);

                if (retMessage == null)
                {
                    retMessage = new Message();
                }
            });
                return retMessage;
        }
        public void UpdateDateRead(int messageId) 
        {
            string procName = "[dbo].[Messages_Update]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection messageCol)
            {
                messageCol.AddWithValue("@Id", messageId);
            }
            ,
            returnParameters: null);
        }
        public void DeleteMessage(int messageId) 
        {
            string procName = "[dbo].[Messages_Delete_ById]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection messageCol)
            {
                messageCol.AddWithValue("@Id", messageId);
            }
            ,
            returnParameters: null);
        }
        private static void AddCommonParams(MessageAddRequest messageModel, SqlParameterCollection messageCol, int userId)
        {
            messageCol.AddWithValue("@Message", messageModel.Message);
            messageCol.AddWithValue("@Subject", messageModel.Subject);
            messageCol.AddWithValue("@RecipientId", messageModel.RecipientId);
            messageCol.AddWithValue("@SenderId", userId);
            messageCol.AddWithValue("@DateSent", messageModel.DateSent);
        }
        private static Message MapSingleMessage(IDataReader reader, ref int startingIndex)
        {
            Message newMessage = new Message();
            UserProfileBase senderProfile = new UserProfileBase();
            UserProfileBase recipientProfile = new UserProfileBase();

            newMessage.Id = reader.GetSafeInt32(startingIndex++);
            newMessage.Body = reader.GetSafeString(startingIndex++);
            newMessage.Subject = reader.GetSafeString(startingIndex++);
            newMessage.RecipientId = reader.GetSafeInt32(startingIndex++);
            newMessage.SenderId = reader.GetSafeInt32(startingIndex++);
            newMessage.DateSent = reader.GetSafeDateTime(startingIndex++);
            newMessage.DateRead = reader.GetSafeDateTime(startingIndex++);
            newMessage.DateModified = reader.GetSafeDateTime(startingIndex++);
            newMessage.DateCreated = reader.GetSafeDateTime(startingIndex++);
            senderProfile.FirstName = reader.GetSafeString(startingIndex++);
            senderProfile.LastName = reader.GetSafeString(startingIndex++);
            senderProfile.AvatarUrl = reader.GetSafeString(startingIndex++);
            recipientProfile.FirstName = reader.GetSafeString(startingIndex++);
            recipientProfile.LastName = reader.GetSafeString(startingIndex++);
            recipientProfile.AvatarUrl = reader.GetSafeString(startingIndex++);

            newMessage.Sender = senderProfile;
            newMessage.Recipient = recipientProfile;

            return newMessage;
        }
        #endregion
        #region-----Group Messages-----
        public int AddGroupMessage(GroupMessageAddRequest message) 
        {
            int id = 0;
            string procName = "[dbo].[GroupMessages_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection messageCol)
            {
                messageCol.AddWithValue("@Message", message.Message);
                messageCol.AddWithValue("@GroupId", message.GroupId);
                messageCol.AddWithValue("@SenderId", message.SenderId);
                SqlParameter messageIdOut = new SqlParameter("@Id", SqlDbType.Int);
                messageIdOut.Direction = ParameterDirection.Output;
                messageCol.Add(messageIdOut);
            }
            ,
            returnParameters: delegate (SqlParameterCollection returnMessageCol)
            {
                object oId = returnMessageCol["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }
        public Paged<GroupMessage> SelectGroupMessageByGroupId(int id, int pageIndex, int pageSize) 
        {
            string procName = "[dbo].[GroupMessages_Select_ByGroupId]";
            List<GroupMessage> list = null;
            Paged<GroupMessage> pagedMessages = null;
            int totalCount = 0;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection messageCol)
            {
                messageCol.AddWithValue("@GroupId", id);
                messageCol.AddWithValue("@PageIndex", pageIndex);
                messageCol.AddWithValue("@PageSize", pageSize);
            }
            ,
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                GroupMessage retMessage = MapSingleGroupMessage(reader, ref startingIndex);

                if (totalCount == 0)
                {
                    totalCount = reader.GetSafeInt32(startingIndex);
                }
                if (list == null)
                {
                    list = new List<GroupMessage>();
                }
                list.Add(retMessage);
            });
            if (list != null)
            {
                pagedMessages = new Paged<GroupMessage>(list, pageIndex, pageSize, totalCount);
            }
            return pagedMessages;
        }
        public GroupMessage SelectGroupMessageById(int messageId) 
        {
            string procName = "[dbo].[GroupMessages_Select_ByMessageId]";
            GroupMessage retMessage = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection messageCol)
            {
                messageCol.AddWithValue("@MessageId", messageId);
            }
            ,
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                retMessage = MapSingleGroupMessage(reader, ref startingIndex);
            });
            return retMessage;
        }
        public void UpdateGroupMessage(GroupMessageUpdateRequest messageModel) 
        {
            string procName = "[dbo].[GroupMessages_Update]";

            var result = _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection messageCol)
            {
                messageCol.AddWithValue("@Id", messageModel.Id);
                messageCol.AddWithValue("@Message", messageModel.Message);
            }
            ,
            returnParameters: null);
            if (result == 0) 
            {
                throw new Exception("Record not found.");
            }
        }
        public void DeleteGroupMessageById(int messageId) 
        {
            string procName = "[dbo].[GroupMessages_Delete_ById]";

            var result = _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection messageCol)
            {
                messageCol.AddWithValue("@Id", messageId);
            }
            ,
            returnParameters: null);
            if (result == 0)
            {
                throw new Exception("Record not found.");
            }
        }
        private static GroupMessage MapSingleGroupMessage(IDataReader reader, ref int startingIndex)
        {
            GroupMessage newMessage = new GroupMessage();
            UserProfileBase sender = new UserProfileBase();

            newMessage.Id = reader.GetSafeInt32(startingIndex++);
            newMessage.Message = reader.GetSafeString(startingIndex++);
            newMessage.Subject = reader.GetSafeString(startingIndex++);
            newMessage.GroupId = reader.GetSafeInt32(startingIndex++);
            newMessage.SenderId = reader.GetSafeInt32(startingIndex++);
            newMessage.DateSent = reader.GetSafeDateTime(startingIndex++);
            newMessage.DateModified = reader.GetSafeDateTime(startingIndex++);
            newMessage.DateCreated = reader.GetSafeDateTime(startingIndex++);
            sender.Id = reader.GetSafeInt32(startingIndex++);
            sender.UserId = reader.GetSafeInt32(startingIndex++);
            sender.FirstName = reader.GetSafeString(startingIndex++);
            sender.LastName = reader.GetSafeString(startingIndex++);
            sender.MI = reader.GetSafeString(startingIndex++);
            sender.AvatarUrl = reader.GetSafeString(startingIndex++);
            newMessage.Sender = sender;
            return newMessage;
        }
        #endregion
        #region-----Messaging Groups-----
        public int MessagingGroupAdd(MessagingGroupAddRequest groupModel) 
        {
            string procName = "[dbo].[MessageGroups_Insert]";
            int id = 0;

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection groupCol)
            {
                groupCol.AddWithValue("@Name", groupModel.Name);
                groupCol.AddWithValue("@CreatedById", groupModel.CreatedById);
                SqlParameter groupIdOut = new SqlParameter("@Id", SqlDbType.Int);
                groupIdOut.Direction = ParameterDirection.Output;
                groupCol.Add(groupIdOut);
            }
            ,
            returnParameters: delegate (SqlParameterCollection returnCol)
            {
                object oId = returnCol["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }
        public MessagingGroup SelectMessagingGroupById(int groupId) 
        {
            string procName = "[dbo].[MessageGroups_Select_ById]";
            MessagingGroup group = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", groupId);
            }
            ,
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;

                group = MapSingleMessagingGroup(reader, ref startingIndex);
            });
            return group;
        }
        public List<MessagingGroup> SelectMessagingGroupsByUserId(int userId) 
        {
            string procName = "[dbo].[MessageGroups_Select_ByUserId]";
            List<MessagingGroup> list = null;

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection col) 
            {
                col.AddWithValue("@Id", userId);
            }
            ,
            singleRecordMapper: delegate (IDataReader reader, short set) 
            {
                int startingIndex = 0;
                MessagingGroup group = MapSingleMessagingGroup(reader, ref startingIndex);

                if (list == null) 
                {
                    list = new List<MessagingGroup>();
                }
                list.Add(group);
            });
            return list;
        }
        public List<MessagingGroup> SelectAllMessagingGroups() 
        {
            string procName = "[dbo].[MessageGroups_SelectAll]";
            List<MessagingGroup> list = null;

            _data.ExecuteCmd(procName, inputParamMapper: null
                , singleRecordMapper: delegate (IDataReader reader, short set)
                {
                    int startingIndex = 0;
                    MessagingGroup group = MapSingleMessagingGroup(reader, ref startingIndex);

                    if (list == null) 
                    {
                        list = new List<MessagingGroup>();
                    }
                    list.Add(group);
                });
            return list;
        }
        public void UpdateMessagingGroup(MessagingGroupUpdateRequest groupModel) 
        {
            string procName = "[dbo].[MessageGroups_Update]";

            var result = _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Id", groupModel.Id);
                col.AddWithValue("@Name", groupModel.Name);
            }
            ,
            returnParameters: null);
            if (result == 0)
            {
                throw new Exception("Record not found.");
            }
        }
        public void DeleteMessagingGroupById(int groupId) 
        {
            string procName = "[dbo].[MessageGroups_DeleteById]";

            var result = _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col) 
            {
                col.AddWithValue("@Id", groupId);
            }
            ,
            returnParameters: null);
            if (result == 0)
            {
                throw new Exception("Record not found.");
            }
        }
        public int AddGroupMember(MessagingGroupUserAddRequest userAddRequest) 
        {
            string procName = "[dbo].[GroupMessageUsers_Insert]";
            int id = 0;

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@AddedById", userAddRequest.AddedById);
                col.AddWithValue("@GroupId", userAddRequest.GroupId);
                col.AddWithValue("@UserId", userAddRequest.UserId);
                SqlParameter idOut = new SqlParameter("@Id", SqlDbType.Int);
                idOut.Direction = ParameterDirection.Output;
                col.Add(idOut);
            }
            ,
            returnParameters: delegate (SqlParameterCollection returnCol) 
            {
                object oId = returnCol["@Id"].Value;
                int.TryParse(oId.ToString(), out id);
            });
            return id;
        }
        public void RemoveGroupMember(int userId, int groupId) 
        {
            string procName = "[dbo].[GroupMessageUsers_Delete_ByUserId]";

            var result = _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col) 
            {
                col.AddWithValue("@UserId", userId);
                col.AddWithValue("@GroupId", groupId);
            }
            ,
            returnParameters: null);
            if (result == 0)
            {
                throw new Exception("Record not found.");
            }
        }
        private static MessagingGroup MapSingleMessagingGroup(IDataReader reader, ref int startingIndex)
        {
            MessagingGroup newGroup = new MessagingGroup();

            newGroup.Id = reader.GetSafeInt32(startingIndex++);
            newGroup.DateCreated = reader.GetSafeDateTime(startingIndex++);
            newGroup.DateModified = reader.GetSafeDateTime(startingIndex++);
            newGroup.Name = reader.GetSafeString(startingIndex++);
            newGroup.CreatedById = reader.GetSafeInt32(startingIndex++);

            string userIds = reader.GetSafeString(startingIndex++);

            if (!string.IsNullOrEmpty(userIds))
            {
                newGroup.Users = Newtonsoft.Json.JsonConvert.DeserializeObject<List<UserProfileBase>>(userIds);
            }
            else
            {
                newGroup.Users = new List<UserProfileBase>();
            }
            return newGroup;
        }
        #endregion
    }
}
