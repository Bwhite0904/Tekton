using Microsoft.AspNetCore.SignalR;
using Sabio.Models.Domain.Messages;
using Sabio.Models.Requests.Messages;
using Sabio.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Sabio.Web.Api.Hubs
{
    public class MessageHub : Hub
    {
        protected IUserTrackerService<MessageHub> _userTracker;
        private IMessageService _messageService = null;
        public MessageHub(IUserTrackerService<MessageHub> userTracker, IMessageService messageService)
        {
            _userTracker = userTracker;
            _messageService = messageService;
        }
        public async Task StartConnection(string connectionId, UserConnection userInfo)
        {
            if (await _userTracker.GetUser(userInfo.Id) == null)
            {
                await _userTracker.AddUser(connectionId, userInfo);
            }
            else
            {
                var oldUser = await _userTracker.GetUser(userInfo.Id);
                await _userTracker.RemoveUser(oldUser.ConnectionId);
                await _userTracker.AddUser(connectionId, userInfo);
            }
            var userGroups = _messageService.SelectMessagingGroupsByUserId(userInfo.Id);
            if (userGroups != null)
            {
                foreach (MessagingGroup group in userGroups)
                {
                    await Groups.AddToGroupAsync(connectionId, group.Id.ToString());
                    var messages = _messageService.SelectGroupMessageByGroupId(group.Id, 0, 50);
                    await Clients.Client(connectionId).SendAsync("ReceiveGroupMessages", messages);
                }
                await Clients.Client(connectionId).SendAsync("ReceiveMessagingGroups", userGroups);
            }
        }
        [HubMethodName("SendMessage")]
        public async Task SendMessage(int senderUserId, int targetUserId, MessageAddRequest message)
        {

            var targetUser = await _userTracker.GetUser(targetUserId);
            var sender = await _userTracker.GetUser(senderUserId);
            var response = _messageService.Add(message, senderUserId);
            
            if (response > 0) 
            {
                var newMessage = _messageService.SelectByMessageId(response);
                if (await _userTracker.GetUser(targetUserId) != null)
                {
                    await Clients.Client(targetUser.ConnectionId).SendAsync("ReceiveMessage", newMessage);
                }
                if (await _userTracker.GetUser(senderUserId) != null) 
                {
                    await Clients.Client(sender.ConnectionId).SendAsync("ReceiveMessage", newMessage);
                }
            }            
        }
        [HubMethodName("GetMessages")]
        public async Task GetMessages(int userId) 
        {
            var currentUser = await _userTracker.GetUser(userId);
            List<Message> response = _messageService.GetConversation(userId);

            if (response != null) 
            {
                await Clients.Client(currentUser.ConnectionId).SendAsync("ReceiveAllMessages", response);
            }
        }
        [HubMethodName("UpdateMessage")]
        public void UpdateMessage(int msgid)
        {
            _messageService.UpdateDateRead(msgid);
        }
        [HubMethodName("SendGroupMessage")]
        public async Task SendGroupMessage(string group, GroupMessageAddRequest message) 
        {
            var response = _messageService.AddGroupMessage(message);

            if (response > 0) 
            {
                var newMessage = _messageService.SelectGroupMessageById(response);
                await Clients.Group(group).SendAsync("ReceiveGroupMessage", newMessage);
            };
        }
        [HubMethodName("CreateMessagingGroup")]
        public async Task CreateMessagingGroup(string connectionId, MessagingGroupAddRequest group) 
        {
            int newGroupId = _messageService.MessagingGroupAdd(group);
            if (newGroupId > 0) 
            {
                GroupMessageAddRequest newGroupCreated = new GroupMessageAddRequest();

                newGroupCreated.GroupId = newGroupId;
                newGroupCreated.SenderId = group.CreatedById;
                newGroupCreated.Message = $"{group.Name} Created";

                int firstMessageId = _messageService.AddGroupMessage(newGroupCreated);

                GroupMessage message = _messageService.SelectGroupMessageById(firstMessageId);

                await Groups.AddToGroupAsync(connectionId, newGroupId.ToString());
                MessagingGroup newGroup = _messageService.SelectMessagingGroupById(newGroupId);
                await Clients.Client(connectionId).SendAsync("ReceiveMessagingGroup", newGroup);
                await Clients.Group(newGroupId.ToString()).SendAsync("ReceiveGroupMessage", message);
            }
        }
        [HubMethodName("AddUserToMessagingGroup")]
        public async Task AddUserToMessagingGroup(MessagingGroupUserAddRequest userAddRequest) 
        {
            var output = _messageService.AddGroupMember(userAddRequest);

            if (output > 0) 
            {
                var newMember = await _userTracker.GetUser(userAddRequest.UserId);

                if (newMember != null) 
                {
                    await Groups.AddToGroupAsync(newMember.ConnectionId, userAddRequest.GroupId.ToString());
                }
            }
        }
        [HubMethodName("RemoveUserFromMessagingGroup")]
        public async Task RemoveUserFromMessagingGroup(int userId, int groupId) 
        {
            var user = await _userTracker.GetUser(userId);

            if (user != null) 
            {
                await Groups.RemoveFromGroupAsync(user.ConnectionId, groupId.ToString());
            }
            _messageService.RemoveGroupMember(userId, groupId);

            var userGroups = _messageService.SelectMessagingGroupsByUserId(userId);
            if (userGroups != null && user != null) 
            {
                await Clients.Client(user.ConnectionId).SendAsync("ReceiveMessagingGroups", userGroups);
            }
        }
    }
}
