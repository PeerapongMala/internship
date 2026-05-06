using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.SearchParameter;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterDropdownController : BaseController
    {
        private readonly ILogger<MasterDropdownController> _logger;
        private readonly IMasterDropdownService _dropdownService;
        private readonly IAppShare _appShare;

        public MasterDropdownController(ILogger<MasterDropdownController> logger, IMasterDropdownService dropdownService, IAppShare appShare) : base(appShare)
        {
            _logger = logger;
            _dropdownService = dropdownService;
            _appShare = appShare;
        }

        [HttpPost]
        public async Task<IActionResult> GetMasterDropdownData([FromBody] SystemSearchRequest request)
        {
            request.CompanyId = _appShare.CompanyId;
            request.DepartmentId = _appShare.DepartmentId;
            request.CbBcdCode = _appShare.CbBcdCode;
            return Json(await _dropdownService.GetMasterDropdownAsync(request));
        }

        [HttpPost]
        public async Task<IActionResult> GetMasterDropdownChashpointWithZone([FromBody] SystemSearchRequest request)
        {
            request.CompanyId = _appShare.CompanyId;
            request.DepartmentId = _appShare.DepartmentId;
            return Json(await _dropdownService.GetMasterDropdownChashpointWithZoneAsync(request));
        }
    }
}
