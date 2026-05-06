namespace BSS_API.Controllers
{
    using Core.Helpers;
    using Helpers;
    using Models;
    using Models.RequestModels;
    using Models.ResponseModels;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;
    using Infrastructure.Middlewares;

    [ApiController]
    [ApiKey("BSS_WEB")]
    [Route("api/[controller]")]
    public class HoldingController : BaseController
    {
        private readonly ApplicationDbContext _db;
        private readonly ILogger<HoldingController> _logger;

        public HoldingController(IAppShare share, ApplicationDbContext db, ILogger<HoldingController> logger)
            : base(share)
        {
            _db = db;
            _logger = logger;
        }

        /// <summary>
        /// ดึงสรุปยอด Holding — รวมทุก header card, group by (ชนิดราคา, ประเภท, แบบ)
        /// เฉพาะรายการที่ bss_txn_prepare.is_reconcile = true
        /// </summary>
        [HttpPost("GetHoldingSummary")]
        public async Task<IActionResult> GetHoldingSummary([FromBody] HoldingFilterRequest request)
        {
            try
            {
                // Query: reconcile_tran → prepare (is_reconcile=true) → reconcile rows
                var query = _db.TransactionReconcileTran
                    .AsNoTracking()
                    .Include(rt => rt.TransactionReconcile)
                    .Where(rt =>
                        rt.IsActive == true &&
                        rt.IsDisplay == true &&
                        rt.StatusId == 13)
                    .AsQueryable();

                // Filter by department
                if (request.DepartmentId > 0)
                    query = query.Where(rt => rt.DepartmentId == request.DepartmentId);

                // Filter by shift
                if (request.ShiftId.HasValue && request.ShiftId > 0)
                    query = query.Where(rt => rt.ShiftId == request.ShiftId.Value);

                // Filter by machine
                if (request.MachineHdId.HasValue && request.MachineHdId > 0)
                    query = query.Where(rt => rt.MachineHdId == request.MachineHdId.Value);

                // Flatten all reconcile rows from all matching reconcile_tran
                var allRows = await query
                    .SelectMany(rt => rt.TransactionReconcile!
                        .Where(r => r.IsActive == true)
                        .Select(r => new
                        {
                            r.DenoPrice,
                            r.BnType,
                            r.DenomSeries,
                            r.Qty
                        }))
                    .ToListAsync();

                // Group by (DenoPrice, BnType, DenomSeries) — รวมทุก header card
                var grouped = allRows
                    .GroupBy(r => new { r.DenoPrice, r.BnType, r.DenomSeries })
                    .Select(g => new HoldingDenominationRow
                    {
                        DenoPrice = g.Key.DenoPrice,
                        BnTypeCode = g.Key.BnType ?? "",
                        BnType = BanknoteTypeHelper.MapBnType(g.Key.BnType),
                        DenomSeries = g.Key.DenomSeries ?? "",
                        Qty = g.Sum(x => x.Qty)
                    })
                    .OrderByDescending(r => r.Qty)
                    .ThenBy(r => r.DenoPrice)
                    .ThenBy(r => r.BnTypeCode)
                    .ThenBy(r => r.DenomSeries)
                    .ToList();

                // Summary categories based on BnType code:
                // G=ดี, B=เสีย, D=ทำลาย → ดี/เสีย/ทำลาย (+)
                // R=Reject → Reject (+)
                // C=ปลอม, T=ชำรุด → ปลอม/ชำรุด (O)
                // E=เกินจำนวน → เกินจำนวน (O)
                var goodDamagedDestroy = grouped
                    .Where(r => r.BnTypeCode is "G" or "B" or "D")
                    .Sum(r => r.Qty);

                var reject = grouped
                    .Where(r => r.BnTypeCode == "R")
                    .Sum(r => r.Qty);

                var counterfeitDefect = grouped
                    .Where(r => r.BnTypeCode is "C" or "T")
                    .Sum(r => r.Qty);

                var excess = grouped
                    .Where(r => r.BnTypeCode == "E")
                    .Sum(r => r.Qty);

                var response = new HoldingSummaryResponse
                {
                    Rows = grouped,
                    TotalGoodDamagedDestroy = goodDamagedDestroy,
                    TotalReject = reject,
                    TotalCounterfeitDefect = counterfeitDefect,
                    TotalExcess = excess,
                    GrandTotal = goodDamagedDestroy + reject + counterfeitDefect + excess
                };

                return Ok(new BaseResponse<HoldingSummaryResponse>
                {
                    is_success = true,
                    msg_code = "200",
                    msg_desc = "Success",
                    data = response
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetHoldingSummary failed");
                return Ok(new BaseResponse<HoldingSummaryResponse>
                {
                    is_success = false,
                    msg_code = "500",
                    msg_desc = "GET_HOLDING_SUMMARY_FAILED",
                    data = null
                });
            }
        }

        /// <summary>
        /// ส่งยอด Reject → update status ของ reconcile_tran ที่ status=13 (Reconciled) เป็น 14 (Auto Selling)
        /// </summary>
        [HttpPost("SubmitReject")]
        public async Task<IActionResult> SubmitReject([FromBody] HoldingFilterRequest request)
        {
            try
            {
                var query = _db.TransactionReconcileTran
                    .Where(rt =>
                        rt.IsActive == true &&
                        rt.IsDisplay == true &&
                        rt.StatusId == 13);

                if (request.DepartmentId > 0)
                    query = query.Where(rt => rt.DepartmentId == request.DepartmentId);

                if (request.ShiftId.HasValue && request.ShiftId > 0)
                    query = query.Where(rt => rt.ShiftId == request.ShiftId.Value);

                if (request.MachineHdId.HasValue && request.MachineHdId > 0)
                    query = query.Where(rt => rt.MachineHdId == request.MachineHdId.Value);

                var reconcileTrans = await query.ToListAsync();

                if (!reconcileTrans.Any())
                {
                    return Ok(new BaseResponse<object>
                    {
                        is_success = false,
                        msg_code = "404",
                        msg_desc = "NO_RECONCILED_DATA_FOUND",
                        data = null
                    });
                }

                foreach (var rt in reconcileTrans)
                {
                    rt.StatusId = 14; // Auto Selling
                    rt.UpdatedDate = DateTime.Now;
                }

                await _db.SaveChangesAsync();

                _logger.LogInformation("SubmitReject: updated {Count} reconcile_tran to status 14 (Auto Selling)", reconcileTrans.Count);

                return Ok(new BaseResponse<object>
                {
                    is_success = true,
                    msg_code = "200",
                    msg_desc = "Success",
                    data = new { updatedCount = reconcileTrans.Count }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SubmitReject failed");
                return Ok(new BaseResponse<object>
                {
                    is_success = false,
                    msg_code = "500",
                    msg_desc = "SUBMIT_REJECT_FAILED",
                    data = null
                });
            }
        }
    }
}
