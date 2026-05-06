using BSS_API.Core.Constants;
using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    [AllowAnonymous]
    public class TestController : BaseController
    {
        private readonly IAppShare _share;
        private readonly ITestService _testService;
        private readonly IMasterRoleService _masterRoleService;
        private readonly IMasterConfigRepository _masterConfigRepository;
        private readonly ICbmsTransactionRepository _cbmsTransactionRepository;
        private readonly ICbmsTransactionService _cbmsTransactionService;
        private readonly ILogger<TestController> _logger;

        public TestController(IAppShare share, ITestService testService, ILogger<TestController> logger,
            IMasterRoleService masterRoleService, IMasterConfigRepository masterConfigRepository,
            ICbmsTransactionRepository cbmsTransactionRepository,
            ICbmsTransactionService cbmsTransactionService) : base(share)
        {
            _share = share;
            _testService = testService;
            _logger = logger;
            _masterRoleService = masterRoleService;
            _masterConfigRepository = masterConfigRepository;
            _cbmsTransactionRepository = cbmsTransactionRepository;
            _cbmsTransactionService = cbmsTransactionService;
        }


        [HttpGet("TestPing")]
        public IActionResult TestPing()
        {
            return Ok(new { Id = "Test", Message = "Ok" });
        }

        [HttpPost("TestCurl")]
        [ServiceFilter(typeof(CurlLoggingFilter))]
        public IActionResult TestCurl(ConfigFilterRequest data)
        {
            _logger.LogInformation("&&&&&& Test write log from TestCurl");
            return Ok(new { Id = "Test", Message = "Ok" });
        }

        [HttpPost("TestCurlLongProcess")]
        [ServiceFilter(typeof(CurlLoggingFilter))]
        public IActionResult TestCurlLongProcess(ConfigFilterRequest data)
        {
            _logger.LogInformation("&&&&&& Test write log from TestCurlLongProcess start");
            // Simulate a long process (5 seconds)
            Task.Delay(8000).Wait();
            _logger.LogInformation("Test write log from TestCurlLongProcess finish");
            return Ok(new { Id = "Test", Message = "Long process Ok" });
        }

        [HttpPost("TestCurlError")]
        [ServiceFilter(typeof(CurlLoggingFilter))]
        public IActionResult TestCurlError(ConfigFilterRequest data)
        {
            _logger.LogInformation("&&&&&& Test write log from TestCurlError before error");
            int i = 0;
            int j = 1;
            j = j / i; //this should throw devided by zero thrown


            return Ok(new { Id = "Test", Message = "This should not return" });
        }

        [HttpGet("TestGetCacheMetadata")]
        public IActionResult TestGetCacheMetadata()
        {
            var result = CacheHelper.GetCacheMetadata();

            return Ok(result);
        }

        [HttpGet("TestGetConfig")]
        public async Task<IActionResult> TestGetConfig()
        {
            var config = await _masterConfigRepository.GetByConfigTypeCodeAsync(ConfigConstants.BSS_WORK_DAY);
            return Ok(config);
        }

        [HttpGet("TestGetCbmsTransaction")]
        public async Task<IActionResult> TestGetCbmsTransaction()
        {
            var transactions = await _cbmsTransactionService.GetReceiveCbmsDataTransactionsWithConditionAsync(
                new GetReceiveCbmsTransactionWithConditionRequest
                {
                    DepartmentId = 1,
                    //ContainerId = "BK10001"
                });
            return Ok(transactions.ToList());
        }
    }
}