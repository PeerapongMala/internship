using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterM7DenominationController : Controller
    {
        private readonly ILogger<MasterM7DenominationController> _logger;
        private readonly IMasterM7DenominationService _m7DenominationService;
        private readonly IMasterDenominationService _denominationService;

        public MasterM7DenominationController(ILogger<MasterM7DenominationController> logger, 
            IMasterM7DenominationService m7DenominationService, 
            IMasterDenominationService denominationService)
        {
            _logger = logger;
            _m7DenominationService = m7DenominationService;
            _denominationService = denominationService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> GetM7DenominationList([FromBody] M7DenominationFilterSearch requestData)
        {
            //DO NOT USE THIS,FIX FIRST
            var denominationResult = await _denominationService.GetAllMasterDenominationAsyn();
            var m7DenominationResult = await _m7DenominationService.GetM7DenominationByFilterAsync(requestData);
            if (m7DenominationResult.data != null && m7DenominationResult.data.Count > 0)
            {
                foreach (var item in m7DenominationResult.data)
                {
                    item.denominationDesc = denominationResult.data.Where(c => c.denominationId == item.denoId).FirstOrDefault()?.denominationDesc.ToString();
                }
            }
            return Json(m7DenominationResult);
        }

        [HttpPost]
        public async Task<IActionResult> CreateM7Denomination([FromBody] CreateM7DenominationRequest requestData)
        {
           

            var m7DenominationResponse = await _m7DenominationService.CreateM7DenominationAsync(requestData);
            return Json(m7DenominationResponse);
        }

        [HttpGet]
        public async Task<IActionResult> GetM7DenominationById(int id)
        {
            var m7DenominationResponse = await _m7DenominationService.GetM7DenominationsByIdAsync(id);
            return Json(m7DenominationResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateM7Denomination([FromBody] UpdateM7DenominationRequest requestData)
        {
            
            var m7DenominationResponse = await _m7DenominationService.UpdateM7DenominationAsync(requestData);
            return Json(m7DenominationResponse);
        }

        [HttpGet]
        public async Task<IActionResult> DeleteM7Denomination(int id)
        {
            var m7DenominationResponse = await _m7DenominationService.DeleteM7DenominationAsync(id);
            return Json(m7DenominationResponse);
        }


        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchM7Denomination([FromBody] DataTablePagedRequest<MasterM7DenominationRequest> request)
        {

            var response = await _m7DenominationService.SearchM7DenominationAsync(request);

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
