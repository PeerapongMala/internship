using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Models.RequestModels.MasterData;
using BSS_API.Models.ResponseModels;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office2016.Drawing.ChartDrawing;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterBanknoteTypeController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterBanknoteTypeService _banknoteTypeService;
        public MasterBanknoteTypeController(IAppShare share, IMasterBanknoteTypeService banknoteTypeService) : base(share)
        {
            _share = share;
            _banknoteTypeService = banknoteTypeService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _banknoteTypeService.GetAllBanknoteType();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetBanknoteTypeById(int Id)
        {
            var data = await _banknoteTypeService.GetBanknoteTypeById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }
            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateBanknoteTypeRequest request)
        {
            var existingData = await _banknoteTypeService.GetBanknoteTypeByUniqueOrKey(request.BssBanknoteTypeCode.Trim());
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _banknoteTypeService.CreateBanknoteType(request);
            return ApiSuccess("The bank note type has been updated successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateBanknoteTypeRequest request)
        {

            var existingData = await _banknoteTypeService.GetBanknoteTypeById(request.BanknoteTypeId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }
            
            await _banknoteTypeService.UpdateBanknoteType(request);
            return ApiSuccess("The bank note type has been updated successfully.");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterBanknoteType? banknoteTypeData = await _banknoteTypeService.GetBanknoteTypeById(Id);

            if (banknoteTypeData == null)
            {
                return ApiDataNotFound();
            }

            await _banknoteTypeService.DeleteBanknoteType(banknoteTypeData.BanknoteTypeId);
            return ApiSuccess("The banknote type has been deleted successfully.");
        }

         
        [HttpPost("SearchBanknoteType")]
        public async Task<IActionResult> SearchBanknoteType(
        [FromBody] PagedRequest<MasterBankNoteTypeRequest> request)
        {
            var result = await _banknoteTypeService.SearchBankNoteType(request);
            return ApiSuccess(result);
        }
         
    }
}
