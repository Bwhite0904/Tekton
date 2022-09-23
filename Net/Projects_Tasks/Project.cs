using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Tekton.Models.Domain
{
    public class Project
    {
        public int Id { get; set; }
        public int OrganizationId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int LocationId { get; set; }
        public DateTime EstimatedStartDate { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime DateModified { get; set; }

    }
}
