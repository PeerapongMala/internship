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
    public class MasterBanknoteTypeController : Controller
    {
        private readonly ILogger<MasterBanknoteTypeController> _logger;
        private readonly IMasterBanknoteTypeService _banknoteTypeService;
        public MasterBanknoteTypeController(ILogger<MasterBanknoteTypeController> logger, IMasterBanknoteTypeService banknoteTypeService)
        {
            _logger = logger;
            _banknoteTypeService = banknoteTypeService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetBanknoteTypeList()
        {
            var banknoteTypeResponse = await _banknoteTypeService.GetAllBanknoteTypeAsyn();
            return Json(banknoteTypeResponse);
        }

        [HttpGet]
        public async Task<IActionResult> GetBanknoteTypeById(int id)
        {
            var serviceResult = await _banknoteTypeService.GetBanknoteTypeByIdAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBanknoteType([FromBody] CreateBanknoteTypeRequest requestData)
        {
            var banknoteTypeResponse = await _banknoteTypeService.CreateBanknoteTypeAsync(requestData);
            return Json(banknoteTypeResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateBanknoteType([FromBody] UpdateBanknoteTypeRequest requestData)
        {
         
            var banknoteTypeResponse = await _banknoteTypeService.UpdateBanknoteTypeAsync(requestData);
            return Json(banknoteTypeResponse);
        }

        /*
        [HttpGet]
        public async Task<IActionResult> DeleteBanknoteType(int id)
        {
            var banknoteTypeResponse = await _banknoteTypeService.DeleteBanknoteTypeAsync(id);
            return Json(banknoteTypeResponse);
        }
        */


        [HttpPost] 
        public async Task<IActionResult> SearchBankNoteType([FromBody] DataTablePagedRequest<MasterBanknoteTypeRequest> request)
        {

            var response = await _banknoteTypeService.SearchBanknoteTypeAsync(request);

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
