using Sabio.Models;
using Sabio.Models.Domain.Messages;
using Sabio.Models.Requests.Messages;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IMessageService
    {
        int Add(MessageAddRequest messageModel, int userId);
        int AddGroupMessage(GroupMessageAddRequest message);
        Paged<Message> SelectBySenderId(int senderId, int pageIndex, int pageSize);
        Paged<Message> SelectByRecipientId(int recipientId, int pageIndex, int pageSize);
        Paged<GroupMessage> SelectGroupMessageByGroupId(int id, int pageIndex, int pageSize);
        List<Message> GetConversation(int senderId);
        Message SelectByMessageId(int messageId);
        GroupMessage SelectGroupMessageById(int messageId);
        void UpdateDateRead(int messageId);
        void UpdateGroupMessage(GroupMessageUpdateRequest messageModel);
        void DeleteMessage(int messageId);
        void DeleteGroupMessageById(int messageId);
        int MessagingGroupAdd(MessagingGroupAddRequest groupModel);
        MessagingGroup SelectMessagingGroupById(int groupId);
        List<MessagingGroup> SelectMessagingGroupsByUserId(int userId);
        List<MessagingGroup> SelectAllMessagingGroups();
        void UpdateMessagingGroup(MessagingGroupUpdateRequest groupModel);
        void DeleteMessagingGroupById(int groupId);
        int AddGroupMember(MessagingGroupUserAddRequest userAddRequest);
        void RemoveGroupMember(int userId, int groupId);
    }
}