using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterCashTypeController : Controller
    {
        private readonly ILogger<MasterCashTypeController> _logger;
        private readonly IMasterCashTypeService _cashtypeService;
        public MasterCashTypeController(ILogger<MasterCashTypeController> logger, IMasterCashTypeService cashtypeService)
        {
            _logger = logger;
            _cashtypeService = cashtypeService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetCashTypeList()
        {
            var cashtypeResponse = _cashtypeService.GetAllMasterCashTypeAsyn();
            return Json(cashtypeResponse);
        }

        [HttpGet]
        public async Task<IActionResult> GetCashTypeById(int id)
        {
            var serviceResult = await _cashtypeService.GetCashTypeByIdAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> CreateCashType([FromBody] UpdateCashTypeRequest requestData)
        {
            var createData = new MasterCashTypeDisplay
            {
                cashTypeId = 0,
                cashTypeCode = requestData.cashTypeCode,
                cashTypeName = requestData.cashTypeName,
                cashTypeDesc = requestData.cashTypeDesc,
                isActive = requestData.isActive,
                createdBy = 999,
                createdDate = DateTime.Now,
                updatedBy = 999,
                updatedDate = DateTime.Now
            };

            var cashtypeResponse = await _cashtypeService.CreateCashTypeAsync(createData);
            return Json(cashtypeResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateCashType([FromBody] UpdateCashTypeRequest requestData)
        {
            var updateData = new MasterCashTypeDisplay
            {
                cashTypeId = requestData.cashTypeId,
                cashTypeCode = requestData.cashTypeCode,
                cashTypeName = requestData.cashTypeName,
                cashTypeDesc = requestData.cashTypeDesc,
                isActive = requestData.isActive,
                createdBy = 999,
                createdDate = DateTime.Now,
                updatedBy = 999,
                updatedDate = DateTime.Now
            };

            var cashtypeResponse = await _cashtypeService.UpdateCashTypeAsync(updateData);
            return Json(cashtypeResponse);
        }

        //[HttpGet]
        //public async Task<IActionResult> DeleteCashType(int id)
        //{
        //    var cashtypeResponse = await _cashtypeService.DeleteCashTypeAsync(id);
        //    return Json(cashtypeResponse);
        //}

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchCashType([FromBody] DataTablePagedRequest<MasterCashTypeRequest> request)
        {

            var response = await _cashtypeService.SearchCashTypeAsync(request);

            return Json(new
            {
                draw = request.Draw,
                recordsTotal = response?.data?.TotalCount,
                recordsFiltered = response?.data?.TotalCount,
                data = response?.data?.Items
            });

        }

    }
}
