using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using BSS_WEB.Models.ServiceModel;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterZoneController : Controller
    {
        private readonly ILogger<MasterZoneController> _logger;
        private readonly IMasterZoneService _zoneService;
        public MasterZoneController(ILogger<MasterZoneController> logger, 
            IMasterZoneService zoneService)
        {
            _logger = logger;
            _zoneService = zoneService;
        } 

        public IActionResult Index()
        {
            return View();
        }

        

        [HttpGet]
        public async Task<IActionResult> GetZoneList()
        {
            var zoneResult = await _zoneService.GetAllMasterZonesAsync();
            return Ok(zoneResult); 
        }

        [HttpGet]
        public async Task<IActionResult> GetZoneById(int id)
        {
            var ZoneResponse = await _zoneService.GetZoneByIdAsync(id);
            return Json(ZoneResponse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateZone([FromBody] CreateZoneRequest requestData)
        { 
            var zoneResponse = await _zoneService.CreateZoneAsync(requestData);
            return Json(zoneResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateZone([FromBody] UpdateZoneRequest requestData)
        {
            

            var ZoneResponse = await _zoneService.UpdateZoneAsync(requestData);
            return Json(ZoneResponse);
        }

        //[HttpGet]
        //public async Task<IActionResult> DeleteZone(int id)
        //{
        //    var zoneResponse = await _zoneService.DeleteZoneAsync(id);
        //    return Json(zoneResponse);
        //}

        [HttpGet]
        public async Task<IActionResult> GetZoneActiveList()
        {
            var cashPointResult = await _zoneService.GetAllMasterZonesAsync();
            if (cashPointResult.data != null)
            {
                var ActiveList = cashPointResult.data.Where(item => item.isActive == true).ToList();
                cashPointResult.data = ActiveList;
            }

            return Json(cashPointResult);
        }

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchZone([FromBody] DataTablePagedRequest<MasterZoneRequest> request)
        {

            var response = await _zoneService.SearchZoneAsync(request);

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
