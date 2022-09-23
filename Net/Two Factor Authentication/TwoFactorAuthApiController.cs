using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Tekton.Models.AppSettings;
using Tekton.Models.Domain;
using Tekton.Web.Controllers;
using Tekton.Web.Models.Responses;
using System;
using Twilio;
using Twilio.Rest.Verify.V2.Service;

namespace Tekton.Web.Api.Controllers
{
    [Route("api/twofactorauth")]
    [ApiController]
    [AllowAnonymous]
    public class TwoFactorAuthApiController : BaseApiController
    {
        private readonly TwilioConfig _config = null;
        public TwoFactorAuthApiController(IOptions<TwilioConfig> config
            , ILogger<TwoFactorAuthApiController> logger) : base(logger) 
        {
            _config = config.Value;
        }
        [HttpPut]
        public ActionResult<ItemResponse<VerificationResource>> SendAuthToken(TwoFactorAuthTokenRequest request) 
        {
            ObjectResult result = null;
            var accountSid = _config.AccountSID;
            var authToken = _config.AuthToken;
            var serviceSid = _config.ServiceSID;

            try 
            {
                TwilioClient.Init(accountSid, authToken);

                var verification = VerificationResource.Create(
                to: request.UserNumber,
                channel: "sms",
                pathServiceSid: serviceSid);

                ItemResponse<VerificationResource> response = new ItemResponse<VerificationResource>() { Item = verification };

                result = Ok200(response);
            }
            catch (Exception ex) 
            {
                base.Logger.LogError(ex.ToString());
                result = StatusCode(500, new ErrorResponse(ex.ToString()));
            }

            return result;
        }
        [HttpPost]
        public ActionResult<ItemResponse<VerificationCheckResource>> CheckAuthToken(TwoFactorAuthVerificationRequest request) 
        {
            ObjectResult result = null;
            var accountSid = _config.AccountSID;
            var authToken = _config.AuthToken;
            var serviceSid = _config.ServiceSID;

            try 
            {
                TwilioClient.Init(accountSid, authToken);

                var verificationCheck = VerificationCheckResource.Create(
                to: request.UserNumber,
                code: request.VerificationCode,
                pathServiceSid: serviceSid
                );

                ItemResponse<VerificationCheckResource> response = new ItemResponse<VerificationCheckResource>() { Item = verificationCheck };

                result = Ok200(response);
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
