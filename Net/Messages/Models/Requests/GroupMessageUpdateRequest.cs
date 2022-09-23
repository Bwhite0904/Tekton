using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tekton.Models.Requests.Messages
{
    public class GroupMessageUpdateRequest : IModelIdentifier
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int Id { get; set; }
        [Required]
        [MinLength(1)]
        [MaxLength(1000)]
        public string Message { get; set; }
    }
}
