using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Helpers;
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
    public class MasterZoneCashPointController : Controller
    {
        private readonly ILogger<MasterZoneCashPointController> _logger;
        private readonly IMasterZoneCashpoinService _zoneCashpointService;
        private readonly IMasterCashPointService _CashpointService;
        private readonly IMasterZoneService _ZoneService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MasterZoneCashPointController(ILogger<MasterZoneCashPointController> logger,
            IMasterZoneCashpoinService zoneCashpointService,
            IMasterCashPointService CashpointService,
            IMasterZoneService ZoneService,
            IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _zoneCashpointService = zoneCashpointService;
            _CashpointService = CashpointService;
            _ZoneService = ZoneService;
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }
        /*

        [HttpPost]
        public async Task<IActionResult> GetZoneCashpointListFilter([FromBody] ZoneCashpointFilterSearch request)
        {

            var zoneResult = await _ZoneService.GetAllMasterZonesAsync();
            var zoneCashpointResult = await _zoneCashpointService.GetZoneCashpointByFilterAsync(request);
            var cashpointResult = await _CashpointService.GetCashPointAllAsync();
            
            if (zoneCashpointResult.data != null && zoneCashpointResult.data.Count > 0)
            {
                foreach (var item in zoneCashpointResult.data)
                {
                    item.cashpointName = cashpointResult.data.Where(c => c.cashpointId == item.CashpointId).FirstOrDefault()?.cashpointName.ToString();
                    item.ZoneName = zoneResult.data.Where(z => z.ZoneId == item.ZoneId).FirstOrDefault()?.ZoneName.ToString();
                }
            }

            return Json(zoneCashpointResult);
        }
        */

        [HttpGet]
        public async Task<IActionResult> GetZoneCashpointList()
        {
            var zoneResult = await _zoneCashpointService.GetAllZoneAsync();
            return Ok(zoneResult);
        }

        [HttpGet]
        public async Task<IActionResult> GetZoneById(int id)
        {
            var ZoneResponse = await _zoneCashpointService.GetZoneCashpointByIdAsync(id);
            return Json(ZoneResponse);
        }

        [HttpPost]
        public async Task<IActionResult> CreateZone([FromBody] CreateZoneCashpointRequest requestData)
        { 
            var zoneResponse = await _zoneCashpointService.CreateZoneCashPoint(requestData); 
            return Json(zoneResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateZone([FromBody] UpdateZoneCashpointRequest requestData)
        { 
            var zoneResponse = await _zoneCashpointService.UpdateZoneCashPoint(requestData);
            return Json(zoneResponse);
        }

        //[HttpGet]
        //public async Task<IActionResult> DeleteZone(int id)
        //{
        //    var zoneResponse = await _zoneCashpointService.DeleteZoneCashpoint(id);
        //    return Json(zoneResponse);
        //}
        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchZoneCashPoint([FromBody] DataTablePagedRequest<MasterZoneCashpointRequest> request)
        {

            var response = await _zoneCashpointService.SearchZoneCashpointAsync(request);

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
