using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tekton.Models.Requests.Messages
{
    public class MessagingGroupAddRequest
    {
        [Required]
        [MinLength(1)]
        [MaxLength(50)]
        public string Name { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int CreatedById { get; set; }
    }
}
