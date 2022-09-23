using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Tekton.Models.Requests;
using Tekton.Services;
using Tekton.Services.Interfaces;
using Tekton.Web.Controllers;
using Tekton.Web.Models.Responses;
using System;
using System.Collections.Generic;

namespace Tekton.Web.Api.Controllers
{
    [Route("api/projects")]
    [ApiController]
    public class ProjectApiController : BaseApiController
    {
        private IProjectService _service = null;
        private IAuthenticationService<int> _authService;
        public ProjectApiController(IProjectService service
            , ILogger<ProjectApiController> logger
            , IAuthenticationService<int> authService) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<int>> AddProject(ProjectAddRequest project) 
        {
            ObjectResult result = null;

            try 
            {
                int projectId = _service.AddProject(project);
                
                ItemResponse<int> response = new ItemResponse<int>() { Item = projectId};

                result = Created201(response);
            }
            catch (Exception ex) 
            {
                base.Logger.LogError(ex.ToString());
                ErrorResponse response = new ErrorResponse(ex.Message);

                result = StatusCode(500, response);
            }
            return result;
        }
        [HttpPost("tasks")]
        public ActionResult<SuccessResponse> AddTasks(List<ProjectTaskAddRequest> tasks) 
        {
            int iCode = 200;
            BaseResponse response = null;

            try
            {
                _service.AddTasks(tasks);
                response = new SuccessResponse();
            }
            catch (Exception ex)
            {
                iCode = 500;
                response = new ErrorResponse(ex.Message);
                base.Logger.LogError(ex.ToString());
            }
            return StatusCode(iCode, response);
        }
    }
}
