using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Services.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterMachineTypeController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterMachineTypeService _machineTypeService;
        public MasterMachineTypeController(IAppShare share, IMasterMachineTypeService machineTypeService) : base(share)
        {
            _share = share;
            _machineTypeService = machineTypeService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _machineTypeService.GetAllMachineType();
            return ApiSuccess(data);
        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetMachineTypeById(int Id)
        {
            var data = await _machineTypeService.GetMachineTypeById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            return ApiSuccess(data);
        }


        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateMachineTypeRequest request)
        {
            var existingData = await _machineTypeService.GetMachineTypeByUniqueOrKey(request.MachineTypeCode.Trim());
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _machineTypeService.CreateMachineType(request);
            return ApiSuccess("The machine type has been created successfully.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateMachineTypeRequest request)
        {
            var existingData = await _machineTypeService.GetMachineTypeById(request.MachineTypeId);

            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _machineTypeService.UpdateMachineType(request);
            return ApiSuccess("The machine type has been updated successfully.");
        }


        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterMachineTypeViewData? data = await _machineTypeService.GetMachineTypeById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _machineTypeService.DeleteMachineType(data.MachineTypeId); ;
            return ApiSuccess("The machine type has been deleted successfully.");
        }

        [HttpPost("SearchMachineType")]
        public async Task<IActionResult> SearchMachineType(
        [FromBody] PagedRequest<MasterMachineTypeRequest> request)
        {
            var result = await _machineTypeService.SearchMachineType(request);
            return ApiSuccess(result);
        }

    }
}
