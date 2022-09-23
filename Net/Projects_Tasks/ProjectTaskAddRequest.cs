using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tekton.Models.Requests
{
    public class ProjectTaskAddRequest
    {
        [Required]
        [Range(1, Int32.MaxValue)]
        public int ProjectId { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int TaskTypeId { get; set; }
        [Required]
        [StringLength(200, MinimumLength = 2)]
        public string Name { get; set; }
        [Required]
        [StringLength(4000, MinimumLength = 2)]
        public string Description { get; set; }
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string ContactName { get; set; }
        [StringLength(20, MinimumLength = 2)]
        public string ContactPhone { get; set; }
        [StringLength(200, MinimumLength = 2)]
        public string ContactEmail { get; set; }
        [Required]
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:MM/dd/yyyy}")]
        public DateTime EstimatedStartDate { get; set; }
        [DisplayFormat(ApplyFormatInEditMode = true, DataFormatString = "{0:MM/dd/yyyy}")]
        public DateTime? EstimatedFinishDate { get; set; }
        [Required]
        [Range(1, Int32.MaxValue)]
        public int CreatedBy { get; set; }
        [Range(1, Int32.MaxValue)]
        public int? ModifiedBy { get; set; }
        [Range(1, Int32.MaxValue)]
        public int? ParentTaskId { get; set; }
        [Range(1, Int32.MaxValue)]
        public int? AwardedOrgId { get; set; }
    }
}
