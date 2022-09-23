using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests.Messages
{
    public class GroupMessageAddRequest
    {
        [Required]
        [MinLength(1)]
        [MaxLength(1000)]
        public string Message { get; set; }
        [MinLength(2)]
        [MaxLength(100)]
        public string Subject { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int GroupId { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int SenderId { get; set; }
    }
}
