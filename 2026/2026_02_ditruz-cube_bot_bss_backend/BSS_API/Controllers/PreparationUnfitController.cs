namespace BSS_API.Controllers
{
    using Helpers;
    using Models.Common;
    using Models.Entities;
    using Services.Interface;
    using Models.RequestModels;
    using Microsoft.AspNetCore.Mvc;
    using Infrastructure.Middlewares;

    [ApiController]
    [ApiKey("BSS_WEB")]
    [Route("api/[controller]")]
    public class PreparationUnfitController : BaseController
    {
        private readonly IAppShare _share;
        private readonly ITransactionContainerPrepareService _transactionContainerPrepareService;
        private readonly ITransactionPreparationService _transactionPreparationService;
        private readonly IMasterInstitutionService _masterInstitutionService;
        private readonly ICbmsTransactionService _cbmsTransactionService;
        private readonly ILogger<PreparationUnfitController> _logger;

        public PreparationUnfitController(IAppShare share,
            ITransactionContainerPrepareService transactionContainerPrepareService,
            ITransactionPreparationService transactionPreparationService,
            IMasterInstitutionService masterInstitutionService, ICbmsTransactionService cbmsTransactionService,
            ILogger<PreparationUnfitController> logger) : base(share)
        {
            _share = share;
            _transactionContainerPrepareService = transactionContainerPrepareService;
            _transactionPreparationService = transactionPreparationService;
            _masterInstitutionService = masterInstitutionService;
            _cbmsTransactionService = cbmsTransactionService;
            _logger = logger;
        }

        [HttpGet("GetUnfit")]
        public async Task<IActionResult> GetUnFit(int departmentId)
        {
            var data = await _transactionPreparationService.GetPreparationByDepartment(departmentId);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpPost("GenerateDummyBarCode")]
        public async Task<IActionResult> GenerateDummyBarCode([FromBody] CreateDummyBarcode request)
        {
            var data = await _transactionPreparationService.GenerateDummyBarcodeAsync(request);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpGet("GetAllPreparation")]
        public async Task<IActionResult> GetAllPreparationAsync()
        {
            var data = await _transactionPreparationService.GetAllPreparationAsync();
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpGet("GetPreparationById")]
        public async Task<IActionResult> GetPreparationByIdAsync(long PrepareId)
        {
            var data = await _transactionPreparationService.GetPreparationByIdAsync(PrepareId);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpPost("CreatePreparation")]
        public async Task<IActionResult> Create(CreatePreparationRequest request)
        {
            await _transactionPreparationService.CreatePreparation(request);
            return ApiSuccess("The Preparation has been created successfully.");
        }

        [HttpPut("UpdatePreparation")]
        public async Task<IActionResult> Update(UpdatePreparationRequest request)
        {
            var existingData = await _transactionPreparationService.GetPreparationByIdAsync(request.PrepareId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _transactionPreparationService.UpdatePreparation(request);
            return ApiSuccess("The Preparation has been updated successfully");
        }

        [HttpDelete("RemovePreparation")]
        public async Task<IActionResult> RemovePreparation(long prepareId)
        {
            TransactionPreparation? data = await _transactionPreparationService.GetPreparationByIdAsync(prepareId);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _transactionPreparationService.DeletePreparation(data.PrepareId);
            return ApiSuccess("The Preparation has been deleted successfully.");
        }

        [HttpGet("GetAllContainerPrepare")]
        public async Task<IActionResult> GetAllContainerPrepareAsync(int department)
        {
            var data = await _transactionContainerPrepareService.GetAllContainerPrepareAsync(department);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpGet("GetContainerPrepareById")]
        public async Task<IActionResult> GetContainerPrepareById(long containerPrepareId)
        {
            var data = await _transactionContainerPrepareService.GetContainerPrepareByIdAsync(containerPrepareId);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpPost("CreateContainerPrepare")]
        public async Task<IActionResult> Create(CreateTransactionContainerPrepareRequest request)
        {
            await _transactionContainerPrepareService.CreateContainerPrepare(request);
            return ApiSuccess("The ContainerPrepare has been created successfully.");
        }

        [HttpPut("UpdateContainerPrepare")]
        public async Task<IActionResult> Update(UpdateTransactionContainerPrepareRequest request)
        {
            var existingData =
                await _transactionContainerPrepareService.GetContainerPrepareById(request.ContainerPrepareId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _transactionContainerPrepareService.UpdateContainerPrepare(request);
            return ApiSuccess("The ContainerPrepare has been updated successfully");
        }

        [HttpDelete("RemoveContainerPrepare")]
        public async Task<IActionResult> Remove(long Id)
        {
            TransactionContainerPrepareViewData? data =
                await _transactionContainerPrepareService.GetContainerPrepareById(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _transactionContainerPrepareService.DeleteContainerPrepare(data.ContainerPrepareId);
            return ApiSuccess("The ContainerPrepare has been deleted successfully.");
        }

        [HttpPut("UpdatePreparationUnfit")]
        public async Task<IActionResult> UpdatePreparationUnfit(UpdatePreparationUnfitRequest request)
        {
            var existingData = await _transactionPreparationService.GetPreparationByIdAsync(request.PrepareId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _transactionPreparationService.UpdatePreparationUnfit(request);
            return ApiSuccess("The Preparation Unfit has been updated successfully");
        }

        [HttpDelete("DeletePreparationUnfit")]
        public async Task<IActionResult> DeletePreparationUnfit(List<DeletePreparationUnfitRequest> requests)
        {
            try
            {
                if (requests == null || requests.Count == 0)
                    return BadRequest(new { message = "At least 1 item is required." });

                var data = await _transactionPreparationService.DeletePreparationUnfit(requests);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeletePreparationUnfit failed. Items={Count}", requests?.Count ?? 0);
                return ApiInternalServerError("DELETE_PREPARATION_UNFIT_FAILED");
            }
        }

        [HttpPut("EditPreparationUnfit")]
        public async Task<IActionResult> EditPreparationUnfit(List<EditPreparationUnfitRequest> requests)
        {
            try
            {
                if (requests == null || requests.Count == 0)
                    return BadRequest(new { message = "At least 1 item is required." });

                var data = await _transactionPreparationService.EditPreparationUnfit(requests);
                return ApiSuccess(data);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "EditPreparationUnfit failed. Items={Count}", requests?.Count ?? 0);
                return ApiInternalServerError("EDIT_PREPARATION_UNFIT_FAILED");
            }
        }

        [HttpPost("GetPreparationUnfit")]
        public async Task<IActionResult> GetPreparationUnfit(
            [FromBody] PagedRequest<PreparationUnfitRequest> request,
            CancellationToken ct)
        {
            var data = await _transactionPreparationService.GetPreparationUnfitAsync(request);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpGet("GetReceiveCbmsDataById")]
        public async Task<IActionResult> GetReceiveCbmsDataByIdAsync(long receiveId)
        {
            var data = await _cbmsTransactionService.GetReceiveCbmsDataByIdAsync(receiveId);
            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpPut("UpdateReceiveCbmsData")]
        public async Task<IActionResult> UpdateReceiveCbmsData(UpdateTransactionReceiveCbmsDataRequest entity)
        {
            var existingData = await _cbmsTransactionService.GetReceiveCbmsDataByIdAsync(entity.ReceiveId);
            if (existingData == null)
            {
                return ApiDataNotFound();
            }

            await _cbmsTransactionService.UpdateReceiveCbmsData(entity);
            return ApiSuccess("The ReceiveCbmsData has been updated successfully");
        }


        [HttpDelete("RemoveReceiveCbmsData")]
        public async Task<IActionResult> RemoveReceiveCbmsData(long Id)
        {
            ReceiveCbmsDataTransaction? data = await _cbmsTransactionService.GetReceiveCbmsDataByIdAsync(Id);

            if (data == null)
            {
                return ApiDataNotFound();
            }

            await _cbmsTransactionService.DeleteReceiveCbmsData(data.ReceiveId);
            return ApiSuccess("The ReceiveCbmsData has been deleted successfully.");
        }

        [HttpPost("CreateContainerBarcode")]
        public async Task<IActionResult> CreateContainerBarcode(CreateContainerBarcodeRequest request)
        {
            await _transactionPreparationService.CreateContainerBarcode(request);
            return ApiSuccess("The ContainerBarcode has been created successfully.");
        }

        [HttpPost("GetCountPrepareByContainer")]
        public async Task<IActionResult> GetCountPrepareByContainer(CountPrepareByContainerRequest request)
        {
            var data = await _transactionPreparationService.GetCountPrepareByContainerAsync(request);
            return ApiSuccess(data);
        }

        [HttpPost("GetCountReconcile")]
        public async Task<IActionResult> GetCountReconcile(GetCountReconcileRequest request)
        {
            var data = await _transactionPreparationService.GetCountReconcileAsync(request);
            return ApiSuccess(data);
        }

        [HttpGet]
        public async Task<IActionResult> TestTransaction()
        {
            return ApiSuccess(await _transactionPreparationService.TestTransactionAsync());
        }
    }
}