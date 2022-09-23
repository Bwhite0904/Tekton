using Tekton.Models.Domain.Messages;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Tekton.Services.Interfaces
{
    public interface IUserTrackerService<THub>
    {
        Task AddUser(string connectionId, UserConnection userDetails);
        Task<UserConnection> GetUser(int userId);
        Task RemoveUser(string connectionId);
        Task UpdateUser(string connectionId, UserConnection userDetails);
        Task<IEnumerable<UserConnection>> UsersOnline();
    }
}
