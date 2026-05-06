using BSS_API.Helpers;
using BSS_API.Infrastructure.Middlewares;
using BSS_API.Models;
using BSS_API.Models.Common;
using BSS_API.Models.RequestModels;
using BSS_API.Services;
using BSS_API.Services.Interface;
using Microsoft.AspNetCore.Mvc;

namespace BSS_API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    [ApiKey("BSS_WEB")]
    public class ReportController (
        IAppShare share,
        IReportService reportService,

        ILogger<ReportController> logger) 
        : BaseController(share)
    {
        [HttpPost("GetDataReport_BankSummary")]
        public async Task<IActionResult> GetDataReport(reportBankSummaryRequest request)
        {
            // ส่ง ct ต่อเข้าไปยัง Service
            var data = await reportService.GetDataReport(request);

            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpPost("GetDataReport_CashPointCashCenter")]
        public async Task<IActionResult> GetDataReport_CashPointCashCenter(reportCashPointCenterRequest request)
        {
            // ส่ง ct ต่อเข้าไปยัง Service
            var data = await reportService.GetDataReport_CashPointCashCenter(request);

            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpPost("GetHeaderCardList")]
        public async Task<IActionResult> GetHeaderCardList(reportGetHeaderCardListRequest request)
        {
            // ส่ง ct ต่อเข้าไปยัง Service
            var data = await reportService.GetHeaderCardListAsync(request);

            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpPost("GetDataReport_SingleHeaderCard")]
        public async Task<IActionResult> GetDataReport_SingleHeaderCard(reportSingleHeaderCardRequest request)
        {
            // ส่ง ct ต่อเข้าไปยัง Service
            var data = await reportService.GetDataReport_SingleHeaderCard(request);

            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpPost("GetDataReport_MultiHeaderCard")]
        public async Task<IActionResult> GetDataReport_MultiHeaderCard(reportMultiHeaderCardRequest request)
        {
            // ส่ง ct ต่อเข้าไปยัง Service
            var data = await reportService.GetDataReport_MultiHeaderCard(request);

            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpPost("GetDataReport_Container")]
        public async Task<IActionResult> GetDataReport_Container(reportContainerRequest request)
        {
            // ส่ง ct ต่อเข้าไปยัง Service
            var data = await reportService.GetDataReport_Container(request);

            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }

        [HttpPost("GetDataReport_Abnormal")]
        public async Task<IActionResult> GetDataReport_Abnormal(reportAbnormalRequest request)
        {
            // ส่ง ct ต่อเข้าไปยัง Service
            var data = await reportService.GetDataReport_Abnormal(request);

            if (data == null)
            {
                return ApiDataNotFound("ไม่พบข้อมูล");
            }

            return ApiSuccess(data);
        }
    }
}
