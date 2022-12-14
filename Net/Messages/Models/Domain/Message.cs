using System;

namespace Tekton.Models.Domain.Messages
{
    public class Message
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public string Subject { get; set; }
        public int RecipientId { get; set; }
        public int SenderId { get; set; }
        public DateTime DateSent { get; set; }
        public DateTime DateRead { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
        public UserProfileBase Sender { get; set; }
        public UserProfileBase Recipient { get; set; }


    }
}
