using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office2010.Excel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    [ApiKey("BSS_WEB")]
    public class MasterMachineController : BaseController
    {
        private readonly IAppShare _share;
        private readonly IMasterMachineService _machineService;
        public MasterMachineController(IAppShare share, IMasterMachineService machineService) : base(share)
        {
            _share = share;
            _machineService = machineService;
        }

        [HttpGet("GetAll")]
        public async Task<IActionResult> GetAll()
        {
            var data = await _machineService.GetAllMachine();
            return ApiSuccess(data);
            
        }

        [HttpPost("GetByFilter")]
        public async Task<IActionResult> GetMachineByFilter(MachineFilterRequest request)
        {
            var data = await _machineService.GetMachineByFilter(request);
            return ApiSuccess(data);

        }

        [HttpGet("GetById")]
        public async Task<IActionResult> GetMachineById(int Id)
        {
            var data = await _machineService.GetMachineById(Id);
            if (data == null)
            {
                return ApiDataNotFound();
            }
            return ApiSuccess(data);
        }

        [HttpGet("GetByDepartment")]
        public async Task<IActionResult> GetMachineByDepartment(int departmentId)
        {
            var data = await _machineService.GetMachineByDepartment(departmentId);
            if (data == null)
            {
                return ApiDataNotFound();
            }
            return ApiSuccess(data);

        }       

        [HttpPost("Create")]
        public async Task<IActionResult> Create(CreateMachineRequest request)
        {
            var existingData = await _machineService.GetMachineByUniqueOrKey(request.MachineCode.Trim());
            if (existingData.Any())
            {
                return ApiDataDuplicate();
            }

            await _machineService.CreateMachine(request);
            return ApiSuccess("The machine has been updated successfully.");

        }

        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateMachineRequest request)
        {
            var existingData = await _machineService.GetMachineById(request.MachineId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _machineService.UpdateMachine(request);
            return ApiSuccess("The machine has been updated successfully.");
        }

        [HttpDelete("Remove")]
        public async Task<IActionResult> Remove(int Id)
        {
            MasterMachineViewData? data = await _machineService.GetMachineById(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _machineService.DeleteMachine(data.MachineId);
            return ApiSuccess("The machine has been deleted successfully.");

        }

        [HttpPost("SearchMachine")]
        public async Task<IActionResult> SearchMachine(
        [FromBody] PagedRequest<MasterMachineRequest> request)
        {
            var result = await _machineService.SearchMachine(request);
            return ApiSuccess(result);
        }
    }
}
