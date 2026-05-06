using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterBanknoteTypeSendController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterBanknoteTypeSendService _banknoteTypeSendService;
        public MasterBanknoteTypeSendController(IAppShare share, IMasterBanknoteTypeSendService banknoteTypeSendService) : base(share)
        {
            _share = share;
            _banknoteTypeSendService = banknoteTypeSendService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _banknoteTypeSendService.GetAllBanknoteTypeSend();
            return ApiSuccess(data);
        }

        

        [HttpGet("GetById")]
        public async Task<IActionResult> GetBanknoteTypeSendById(int Id)
        {
            var data = await _banknoteTypeSendService.GetBanknoteTypeSendById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }
            return ApiSuccess(data);
        }

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateBanknoteTypeSendRequest request)
        {
            var existingData = await _banknoteTypeSendService.GetBanknoteTypeByUniqueOrKey(request.BanknoteTypeSendCode.Trim(), request.BssBntypeCode.Trim());
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _banknoteTypeSendService.CreateBanknoteTypeSend(request);
            return ApiSuccess("The banknote Type Send has been created successfully.");

        }


        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateBanknoteTypeSendRequest request)
        {
            var existingData = await _banknoteTypeSendService.GetBanknoteTypeSendById(request.BanknoteTypeSendId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _banknoteTypeSendService.UpdateBanknoteTypeSend(request);
            return ApiSuccess("The banknote Type Send has been updated successfully.");

        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterBanknoteTypeSend? banknoteTypeSendData = await _banknoteTypeSendService.GetBanknoteTypeSendById(Id);

            if (banknoteTypeSendData == null)
            {
                return ApiDataNotFound();
            }

            await _banknoteTypeSendService.DeleteBanknoteTypeSend(banknoteTypeSendData.BanknoteTypeSendId);
            return ApiSuccess("The banknote type has been deleted successfully.");

        }

        [HttpPost("SearchBanknoteTypeSend")]
        public async Task<IActionResult> SearchBanknoteTypeSend(
        [FromBody] PagedRequest<MasterBanknoteTypeSendRequest> request)
        {
            var result = await _banknoteTypeSendService.SearchBanknoteTypeSend(request);
            return ApiSuccess(result);
        }

    }
}
