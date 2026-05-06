namespace BSS_API.Controllers
{
    using Helpers;
    using Services.Interface;
    using Microsoft.AspNetCore.Mvc;
    using Models.Report.Preparation;
    using Infrastructure.Middlewares;
    using Models.Report.RegisterUnsort;

    [ApiController]
    [ApiKey("BSS_WEB")]
    [Route("api/[controller]")]
    public class BssReportController(IAppShare share, IBssReportService bssReportService) : BaseController(share)
    {
        [HttpPost("CheckSupervisorOnline")]
        public async Task<IActionResult> CheckSupervisorOnline(
            [FromBody] CheckSupervisorOnlineRequest checkSupervisorOnlineRequest)
        {
            return ApiSuccess(
                await bssReportService.CheckSupervisorOnlineAsync(checkSupervisorOnlineRequest.DepartmentId));
        }

        #region PrepararionUnfit

        [HttpPost("PreparationUnfitReport")]
        public async Task<IActionResult> PreparationUnfitReport(
            PreparationUnfitReportRequest preparationUnfitReportRequest)
        {
            return ApiSuccess(await bssReportService.GetPreparationUnfitReportAsync(preparationUnfitReportRequest));
        }

        #endregion PrepararionUnfit

        #region PreparationUnsortCAMember

        [HttpPost("PreparationUnsortCAMemberReport")]
        public async Task<IActionResult> PreparationUnsortCAMemberReport(
            PreparationUnsortCAMemberReportRequest preparationUnfitReportRequest)
        {
            return ApiSuccess(await bssReportService.GetPreparationCAMemberReportAsync(preparationUnfitReportRequest));
        }

        #endregion PreparationUnsortCAMember

        #region PreparationUnsortCANonMember

        [HttpPost("PreparationUnsortCANonMemberReport")]
        public async Task<IActionResult> PreparationUnsortCANonMemberReport(
            PreparationUnsortCANonMemberReportRequest preparationUnfitReportRequest)
        {
            return ApiSuccess(
                await bssReportService.GetPreparationCANonMemberReportAsync(preparationUnfitReportRequest));
        }

        #endregion PreparationUnsortCANonMember

        #region PreparationUnsortCC

        [HttpPost("PreparationUnsortCCReport")]
        public async Task<IActionResult> PreparationUnsortCCReport(
            PreparationUnsortCCReportRequest preparationUnsortCcReportRequest)
        {
            return ApiSuccess(
                await bssReportService.GetPreparationUnsortCCReportAsync(preparationUnsortCcReportRequest));
        }

        #endregion PreparationUnsortCC

        #region RegisterUnsortCC

        [HttpPost("RegisterUnsortCC")]
        public async Task<IActionResult> RegisterUnsortCC(
            RegisterUnsortReportRequest registrationUnsortReportRequest)
        {
            return ApiSuccess(
                await bssReportService.GetRegisterUnsortReportModelAsync(registrationUnsortReportRequest));
        }

        #endregion RegisterUnsortCC

        #region SendUnsortDelivery

        [HttpPost("SendUnsortDelivery")]
        public async Task<IActionResult> SendUnsortDelivery(SendUnsortDeliveryRequest sendUnsortDeliveryRequest)
        {
            return ApiSuccess(await bssReportService.GetSendUnsortDeliveryReportAsync(sendUnsortDeliveryRequest));
        }

        #endregion SendUnsortDelivery
    }
}