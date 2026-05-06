using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Services.Implementation;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Bibliography;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterCashTypeController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterCashtypeService _cashtypeService;

        public MasterCashTypeController(IAppShare share, IMasterCashtypeService cashtypeService) : base(share)
        {
            _share = share;
            _cashtypeService = cashtypeService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _cashtypeService.GetAllCashType();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetCashTypeById(int Id)
        {
            var data = await _cashtypeService.GetCashTypeById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateCashTypeRequest request)
        {

            var existingData = await _cashtypeService.GetCashTypeByUniqueOrKey(request.CashTypeCode.Trim());
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _cashtypeService.CreateCashType(request);
            return ApiSuccess("The cash type has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateCashTypeRequest request)
        {

            var existingData = await _cashtypeService.GetCashTypeById(request.CashTypeId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _cashtypeService.UpdateCashType(request);
            return ApiSuccess("The cash type has been updated successfully.");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {

            MasterCashTypeViewData? data = await _cashtypeService.GetCashTypeById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _cashtypeService.DeleteCashType(data.CashTypeId);
            return ApiSuccess("The cash type has been deleted successfully.");
        }

        [HttpPost("SearchCashType")]
        public async Task<IActionResult> SearchCashType(
        [FromBody] PagedRequest<MasterCashTypeRequest> request)
        {
            var result = await _cashtypeService.SearchCashType(request);
            return ApiSuccess(result);
        }
    }
}
