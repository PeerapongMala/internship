using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office.Word;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterMSevenDenomController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterMSevenDenomService _mSevenDenomService;
        public MasterMSevenDenomController(IAppShare share, IMasterMSevenDenomService m7DenomService) : base(share)
        {
            _share = share;
            _mSevenDenomService = m7DenomService;
        }
        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _mSevenDenomService.GetAllMSevenDenom();
            return ApiSuccess(data);

        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetM7DenomById(int Id)
        {
            var data = await _mSevenDenomService.GetMSevenDenomById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
          
        }
        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateMSevenDenomRequest request)
        {
            var existingData = await _mSevenDenomService.GetMSevenDenomByUniqueOrKey(request.M7DenomCode.Trim(), request.M7DenomName.Trim(),  request.DenoId);
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _mSevenDenomService.CreateMSevenDenom(request);
            return ApiSuccess("The mSevenDenom has been created successfully.");

        }

       

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateMSevenDenomRequest request)
        {
            var existingData = await _mSevenDenomService.GetMSevenDenomById(request.M7DenomId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _mSevenDenomService.UpdateMSevenDenom(request);
            return ApiSuccess("The mSevenDenom note type has been updated successfully.");

        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterMSevenDenomViewData? m7DenomData = await _mSevenDenomService.GetMSevenDenomById(Id);

            if (m7DenomData == null)
            {
                return ApiDataNotFound();
            }

            await _mSevenDenomService.DeleteMSevenDenom(m7DenomData.M7DenomId);
            return ApiSuccess("The mSevenDenom type has been deleted successfully.");

        }

        [HttpPost("GetByFilter")]
        public async Task<IActionResult> GetM7DenomByFilter(MSevenDenomFilterRequest request)
        {
            var data = await _mSevenDenomService.GetMSevenDenomByFilter(request);
            return ApiSuccess(data);
           
        }

        [HttpPost("SearchMSevenDenom")]
        public async Task<IActionResult> SearchMSevenDenom(
        [FromBody] PagedRequest<MasterMSevenDenomRequest> request)
        {
            var result = await _mSevenDenomService.SearchMSevenDenom(request);
            return ApiSuccess(result);
        }
    }
}
