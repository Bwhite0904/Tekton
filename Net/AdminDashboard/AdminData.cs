using System.Collections.Generic;

namespace *****.Models.Domain
{
    public class AdminData
    {
        public int ActiveUsers { get; set; }
        public int InactiveUsers { get; set; }
        public int TotalUsers { get; set; }
        public int ActiveSubcontractors { get; set; }
        public int InactiveSubcontractors { get; set; }
        public int TotalSubcontractors { get; set; }
        public int OrganizationCount { get; set; }
        public int TrainingProviderCount { get; set; }
        public int UsersJoined { get; set; }
        public int SubcontractorsJoined { get; set; }
        public int OrganizationsJoined { get; set; }
        public List<Organization> RecentOrganizations { get; set; }

    }
}
