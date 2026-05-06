using AspNetCoreHero.ToastNotification.Abstractions;
using BSS_WEB.Services;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    public class AdminController : Controller
    {

        BssAdminJobs _adminJobs;
        private readonly INotyfService _notyf;
        private readonly ILogger<AdminController> _logger;

        public AdminController(BssAdminJobs adminJobs, INotyfService notyf, ILogger<AdminController> logger)
        {
            _adminJobs = adminJobs;
            _notyf = notyf;
            _logger = logger;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> ProcessDatas()
        {
            await _adminJobs.ProcessDatas();
            return Ok();
        }

    }
}
