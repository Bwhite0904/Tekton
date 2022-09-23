using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Requests
{
    public class ProjectAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int LocationId { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int OrganizationId { get; set; }
        [Required]
        [StringLength(200, MinimumLength =2)]
        public string Name { get; set; }
        [Required]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:MM/dd/yyyy}")]
        public DateTime EstimatedStartDate { get; set; }
        [Required]
        [StringLength(4000, MinimumLength = 2)]
        public string Description { get; set; }

    }
}
