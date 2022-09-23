using Sabio.Models.Domain;
using Sabio.Models.Requests;
using Sabio.Models.Requests.Users;

namespace Sabio.Services
{
    public interface IAdminDataService
    {
        AdminData GetData(AdminDataRequest request);
    }
}