using Sabio.Data;
using Sabio.Data.Providers;
using Sabio.Models.Domain;
using Sabio.Models.Jobs;
using Sabio.Models.Requests;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using Sabio.Services.Interfaces;
using Sabio.Models.Requests.Users;

namespace Sabio.Services
{
    public class AdminDataService : IAdminDataService
    {
        private IDataProvider _data = null;

        public AdminDataService(IDataProvider data)
        {
            _data = data;
        }
        public AdminData GetData(AdminDataRequest request)
        {
            AdminData data = null;
            string procName = "[dbo].[AdminData_SelectAll]";

            _data.ExecuteCmd(procName, inputParamMapper: delegate (SqlParameterCollection dataCol)
            {
                dataCol.AddWithValue("@FromDate", request.FromDate);
            },
            singleRecordMapper: delegate (IDataReader reader, short set)
            {
                int startingIndex = 0;
                data = MapSingleAdminData(reader, ref startingIndex);
            });
            return data;
        }
        private AdminData MapSingleAdminData(IDataReader reader, ref int startingIndex)
        {
            AdminData data = new AdminData();

            data.ActiveUsers = reader.GetSafeInt32(startingIndex++);
            data.InactiveUsers = reader.GetSafeInt32(startingIndex++);
            data.TotalUsers = reader.GetSafeInt32(startingIndex++);
            data.ActiveSubcontractors = reader.GetSafeInt32(startingIndex++);
            data.InactiveSubcontractors = reader.GetSafeInt32(startingIndex++);
            data.TotalSubcontractors = reader.GetSafeInt32(startingIndex++);
            data.OrganizationCount = reader.GetSafeInt32(startingIndex++);
            data.TrainingProviderCount = reader.GetSafeInt32(startingIndex++);
            data.UsersJoined = reader.GetSafeInt32(startingIndex++);
            data.SubcontractorsJoined = reader.GetSafeInt32(startingIndex++);
            data.OrganizationsJoined = reader.GetSafeInt32(startingIndex++);
            data.RecentOrganizations = reader.DeserializeObject<List<Organization>>(startingIndex++);

            return data;
        }
    }
}
