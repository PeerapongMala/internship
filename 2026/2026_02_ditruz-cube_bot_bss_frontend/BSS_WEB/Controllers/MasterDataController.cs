using Microsoft.AspNetCore.Mvc;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models;
using BSS_WEB.Interfaces;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Text.RegularExpressions;
using Microsoft.Build.Framework;
using BSS_WEB.Infrastructure;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterDataController : Controller
    {
        private readonly ILogger<MasterDataController> _logger;
        private readonly IDataAccessService _dataAccessService;

        public MasterDataController(ILogger<MasterDataController> logger, IDataAccessService dataAccessService)
        {
            _logger = logger;
            _dataAccessService = dataAccessService;
        }
        public IActionResult Index()
        {
            return View();
        }
    }
}
