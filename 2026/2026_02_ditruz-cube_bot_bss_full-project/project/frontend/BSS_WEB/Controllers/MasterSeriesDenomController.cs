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
    public class MasterSeriesDenomController : Controller
    {
        private readonly ILogger<MasterSeriesDenomController> _logger;
        private readonly IMasterSeriesDenomService _seriesDenomService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public MasterSeriesDenomController(ILogger<MasterSeriesDenomController> logger, 
            IMasterSeriesDenomService seriesDenomService ,
            IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _seriesDenomService = seriesDenomService; 
            _httpContextAccessor = httpContextAccessor;
        }

        public IActionResult Index()
        {
            return View();
        }

 

        [HttpGet]
        public async Task<IActionResult> GetSeriesDenomById(int id)
        {
            var serviceResult = await _seriesDenomService.GetSeriesDenomByIdAsync(id);
            return Json(serviceResult);
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var serviceResult = await _seriesDenomService.GetAllMasterSeriesDenomAsync();
            return Json(serviceResult);
        }

        [HttpPost]
        public async Task<IActionResult> CreateSeriesDenom([FromBody] CreateSeriesDenomRequest requestData)
        { 
            var SeriesDenomResponse = await _seriesDenomService.CreateSeriesDenomAsync(requestData);
            return Json(SeriesDenomResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateSeriesDenom([FromBody] UpdateSeriesDenomRequest requestData)
        {
            var SeriesDenomResponse = await _seriesDenomService.UpdateSeriesDenomAsync(requestData);
            return Json(SeriesDenomResponse);
        }

        

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchSeriesDenom([FromBody] DataTablePagedRequest<MasterSeriesDenomRequest> request)
        {

            var response = await _seriesDenomService.SearchSeriesDenomAsync(request);

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
