using System;
using System.Collections.Generic;

namespace Tekton.Models.Domain.Messages
{
    public class MessagingGroup : IModelIdentifier
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int CreatedById { get; set; }
        public List<UserProfileBase> Users { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }
    }
}
