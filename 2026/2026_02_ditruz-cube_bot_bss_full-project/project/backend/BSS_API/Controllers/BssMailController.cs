using BSS_API.Repositories.Interface;
using BSS_API.Services;

namespace BSS_API.Controllers
{
    using Helpers;
    using Models.BssMail;
    using Microsoft.AspNetCore.Mvc;
    using Infrastructure.Middlewares;

    [ApiController]
    [ApiKey("BSS_WEB")]
    [Route("api/[controller]")]
    public class BssMailController(IAppShare share, IUnitOfWork unitOfWork) : BaseController(share)
    {
        [HttpPost("SendMail")]
        public async Task<IActionResult> SendMail(BssMailRequest bssMailRequest)
        {
            BssMailService bssMailService = new BssMailService(unitOfWork);
            return ApiSuccess(await bssMailService.SendMailAsync(bssMailRequest));
        }

        [HttpPost("ValidateMail")]
        public async Task<IActionResult> ValidateMail(BssMailRequest bssMailRequest)
        {
            BssMailService bssMailService = new BssMailService(unitOfWork);
            return ApiSuccess(await bssMailService.ValidateMailAsync(bssMailRequest));
        }
    }
}