using Tekton.Models.Requests;
using System.Collections.Generic;

namespace Tekton.Services.Interfaces
{
    public interface IProjectService
    {
        int AddProject(ProjectAddRequest request);
        void AddTasks(List<ProjectTaskAddRequest> tasks);
    }
}
