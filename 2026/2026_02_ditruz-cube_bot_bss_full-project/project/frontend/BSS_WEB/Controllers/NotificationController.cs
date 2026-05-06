using BSS_WEB.Interfaces;
using BSS_WEB.Models.ObjectModel;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationController : ControllerBase
    {
        private readonly INotificationService _notiService;
        private readonly ILogger<NotificationController> _logger;


        public NotificationController(INotificationService notiService, ILogger<NotificationController> logger)
        {
            _notiService = notiService;
            _logger = logger;
        }

        [HttpPost("SendOtp")]
        public async Task<IActionResult> SendOtp([FromBody] SendOtpRequest req)
        {
            try
            {
                var result = await _notiService.SendOtpAsync(req);
                if (!result.is_success)
                {
                    _logger.LogError( "SendOtp failed");
                    return BadRequest(new { is_success = false, msg_desc = "Send OTP failed" });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SendOtp failed");
                return BadRequest(new { is_success = false, msg_desc = "Send OTP failed" });
            }
        }

        [HttpPost("VerifyOtp")]
        public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest req)
        {
            try
            {
                var result = await _notiService.VerifyOtpAsync(req);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "VerifyOtp failed");
                return BadRequest(new { is_success = false, msg_desc = "Verify OTP failed" });
            }
        }
    }
}
