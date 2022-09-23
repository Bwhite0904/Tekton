using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tekton.Models.Requests.Messages
{
    public class MessagingGroupUserAddRequest
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int AddedById { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int GroupId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int UserId { get; set; }
    }
}
