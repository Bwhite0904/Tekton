using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Tekton.Models.Domain;
using Tekton.Models.Requests;
using Tekton.Models.Requests.Users;
using Tekton.Services;
using Tekton.Services.Interfaces;
using Tekton.Web.Controllers;
using Tekton.Web.Models.Responses;
using System;

namespace Tekton.Web.Api.Controllers
{
    [Route("api/admindata")]
    [ApiController]
    public class AdminDataApiController : BaseApiController
    {
        private IAdminDataService _service = null;
        private IAuthenticationService<int> _authService;
        public AdminDataApiController(IAdminDataService service
            , IAuthenticationService<int> authService
            , ILogger<AdminDataApiController> logger) : base(logger)
        {
            _service = service;
            _authService = authService;
        }

        [HttpPost]
        public ActionResult<ItemResponse<AdminData>> GetAdminData(AdminDataRequest request) 
        {
            ActionResult result = null;

            try 
            {
                AdminData adminData = _service.GetData(request);

                ItemResponse<AdminData> itemResponse = new ItemResponse<AdminData>() { Item = adminData };
                result = Ok200(itemResponse);
            }
            catch (Exception ex) 
            {
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.ToString()));
            }
            return result;
        }
    }
}
