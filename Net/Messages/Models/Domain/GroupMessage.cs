using System;

namespace Tekton.Models.Domain.Messages
{
    public class GroupMessage
    {
        public int Id { get; set; }
        public string Message { get; set; }
        public string Subject { get; set; }
        public int GroupId { get; set; }
        public int SenderId { get; set; }
        public UserProfileBase Sender { get; set; }
        public DateTime DateSent { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
