using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Services.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc; 
namespace BSS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BMS")]
    public class BmsController : ControllerBase
    {
        private readonly IAppShare _share;
        private readonly ILogger<TestController> _logger;

        [HttpGet("TestPing")]
        public IActionResult TestPing()
        {
            return Ok(new { Id = "Test", Message = "Ok" });
        }
    }
}
