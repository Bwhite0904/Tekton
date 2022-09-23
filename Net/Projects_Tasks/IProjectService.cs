using Sabio.Models.Requests;
using System.Collections.Generic;

namespace Sabio.Services.Interfaces
{
    public interface IProjectService
    {
        int AddProject(ProjectAddRequest request);
        void AddTasks(List<ProjectTaskAddRequest> tasks);
    }
}