using Tekton.Models.Domain;
using Tekton.Models.Requests;
using Tekton.Models.Requests.Users;

namespace Tekton.Services
{
    public interface IAdminDataService
    {
        AdminData GetData(AdminDataRequest request);
    }
}
