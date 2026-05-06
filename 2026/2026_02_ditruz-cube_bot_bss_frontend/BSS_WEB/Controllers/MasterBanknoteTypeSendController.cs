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
    public class MasterBanknoteTypeSendController : Controller
    {
        private readonly ILogger<MasterBanknoteTypeSendController> _logger;
        private readonly IMasterBanknoteTypeSendService _banknoteTypeSendService;
        public MasterBanknoteTypeSendController(ILogger<MasterBanknoteTypeSendController> logger, IMasterBanknoteTypeSendService banknoteTypeSendService)
        {
            _logger = logger;
            _banknoteTypeSendService = banknoteTypeSendService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetBanknoteTypeSendList()
        {
            var banknoteTypeSendResponse = await _banknoteTypeSendService.GetAllBanknoteTypeSendAsyn();
            return Json(banknoteTypeSendResponse);
        }

        [HttpGet]
        public async Task<IActionResult> GetBanknoteTypeSendById(int id)
        {
            var serviceResult = await _banknoteTypeSendService.GetBanknoteTypeSendByIdAsync(id);
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBanknoteTypeSend([FromBody] CreateBanknoteTypeSendRequest requestData)
        {
            

            var banknoteTypeSendResponse = await _banknoteTypeSendService.CreateBanknoteTypeSendAsync(requestData);
            return Json(banknoteTypeSendResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateBanknoteTypeSend([FromBody] UpdateBanknoteTypeSendRequest requestData)
        {
           

            var banknoteTypeSendResponse = await _banknoteTypeSendService.UpdateBanknoteTypeSendAsync(requestData);
            return Json(banknoteTypeSendResponse);
        }

        /*
        [HttpGet]
        public async Task<IActionResult> DeleteBanknoteTypeSend(int id)
        {
            var banknoteTypeSendResponse = await _banknoteTypeSendService.DeleteBanknoteTypeSendAsync(id);
            return Json(banknoteTypeSendResponse);
        }
        */

        [HttpPost] 
        public async Task<IActionResult> SearchBankNoteTypeSend([FromBody] DataTablePagedRequest<MasterBanknoteTypeSendRequest> request)
        {

            var response = await _banknoteTypeSendService.SearchBanknoteTypeSendAsync(request);

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
