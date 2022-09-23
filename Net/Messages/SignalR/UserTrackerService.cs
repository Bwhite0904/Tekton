using Tekton.Models.Domain.Messages;
using Tekton.Services.Interfaces;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tekton.Services
{
    public class UserTrackerService<THub> : IUserTrackerService<THub>
    {
        private readonly ConcurrentDictionary<string, UserConnection> _usersOnline
            = new ConcurrentDictionary<string, UserConnection>();

        public Task<IEnumerable<UserConnection>> UsersOnline() => Task.FromResult(_usersOnline.Values.AsEnumerable());

        public Task<UserConnection> GetUser(int userId)
        {
            UserConnection user = _usersOnline.Values.FirstOrDefault(u => u.Id == userId);

            return Task.FromResult(user);
        }

        public Task AddUser(string connectionId, UserConnection userDetails)
        {
            _usersOnline.TryAdd(connectionId, userDetails);

            return Task.CompletedTask;
        }

        public Task UpdateUser(string connectionId, UserConnection userDetails)
        {
            _usersOnline.AddOrUpdate(connectionId, userDetails, (oldKey, oldValue) => userDetails);

            return Task.CompletedTask;
        }

        public Task RemoveUser(string connectionId)
        {
            if (_usersOnline.TryRemove(connectionId, out var userDetails)) { }

            return Task.CompletedTask;
        }
    }
}
