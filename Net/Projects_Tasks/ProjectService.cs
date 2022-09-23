using Sabio.Data.Providers;
using Sabio.Models.Requests;
using Sabio.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Services
{
    public class ProjectService : IProjectService
    {
        IDataProvider _data = null;

        public ProjectService(IDataProvider data)
        {
            _data = data;
        }
        public int AddProject(ProjectAddRequest request)
        {
            int id = 0;
            string procName = "[dbo].[Projects_Insert]";

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                AddCommonProjectParameters(request, col);
            },
             returnParameters: delegate (SqlParameterCollection returnCol)
             {
                 object oId = returnCol["@ProjectId"].Value;
                 int.TryParse(oId.ToString(), out id);
             });
            return id;
        }
        public void AddTasks(List<ProjectTaskAddRequest> tasks)
        {
            string procName = "[dbo].[Tasks_Insert_Batch]";
            DataTable tasksTable = null;

            tasksTable = MapTasksToTable(tasks);

            _data.ExecuteNonQuery(procName, inputParamMapper: delegate (SqlParameterCollection col)
            {
                col.AddWithValue("@Tasks", tasksTable);
            });
        }

        private static void AddCommonProjectParameters(ProjectAddRequest request, SqlParameterCollection col)
        {
            col.AddWithValue("@LocationId", request.LocationId);
            col.AddWithValue("@OrgId", request.OrganizationId);
            col.AddWithValue("@Name", request.Name);
            col.AddWithValue("@EstimatedStartDate", request.EstimatedStartDate);
            col.AddWithValue("@Description", request.Description);
            SqlParameter projectId = new SqlParameter("@ProjectId", SqlDbType.Int);
            projectId.Direction = ParameterDirection.Output;
            col.Add(projectId);
        }

        private DataTable MapTasksToTable(List<ProjectTaskAddRequest> tasks) 
        {
            DataTable table = new DataTable();

            table.Columns.Add("ProjectId", typeof(Int32));
            table.Columns.Add("TaskTypeId", typeof(Int32));
            table.Columns.Add("Name", typeof(string));
            table.Columns.Add("Description", typeof(string));
            table.Columns.Add("ContactName", typeof(string));
            table.Columns.Add("ContactPhone", typeof(string));
            table.Columns.Add("ContactEmail", typeof(string));
            table.Columns.Add("EstimatedStartDate", typeof(DateTime));
            table.Columns.Add("EstimatedFinishDate", typeof(DateTime));
            table.Columns.Add("CreatedBy", typeof(Int32));
            table.Columns.Add("ModifiedBy", typeof(Int32));
            table.Columns.Add("ParentTaskId", typeof(Int32));
            table.Columns.Add("AwardedOrgId", typeof(Int32));
            table.Columns.Add("IsDeleted", typeof(bool));

            foreach (ProjectTaskAddRequest singleTask in tasks) 
            {
                DataRow row = table.NewRow();
                int index = 0;
                row.SetField(index++, singleTask.ProjectId);
                row.SetField(index++, singleTask.TaskTypeId);
                row.SetField(index++, singleTask.Name);
                row.SetField(index++, singleTask.Description);
                row.SetField(index++, singleTask.ContactName);
                row.SetField(index++, singleTask.ContactPhone);
                row.SetField(index++, singleTask.ContactEmail);
                row.SetField(index++, singleTask.EstimatedStartDate);
                row.SetField(index++, singleTask.EstimatedFinishDate);
                row.SetField(index++, singleTask.CreatedBy);
                row.SetField(index++, singleTask.ModifiedBy);
                row.SetField(index++, singleTask.ParentTaskId);
                row.SetField(index++, singleTask.AwardedOrgId);
                row.SetField(index++, false);
                table.Rows.Add(row);
            }
            return table;
        }
    }
}
