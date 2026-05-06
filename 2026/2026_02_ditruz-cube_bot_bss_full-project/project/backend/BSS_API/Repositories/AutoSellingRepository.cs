namespace BSS_API.Repositories
{
    using Core.Helpers;
    using Interface;
    using Microsoft.EntityFrameworkCore;
    using Models.Entities;
    using Models.RequestModels;
    using Models.ResponseModels;

    public class AutoSellingRepository(Models.ApplicationDbContext db) : IAutoSellingRepository
    {
        private readonly Models.ApplicationDbContext _db = db;

        public async Task<AutoSellingAllDataResponse> GetAllDataAsync(
            AutoSellingFilterRequest filter, CancellationToken ct = default)
        {
            var items = await _db.TransactionReconcileTran
                .AsNoTracking()
                .Include(x => x.TransactionPreparation)
                    .ThenInclude(p => p!.MasterInstitution)
                .Include(x => x.TransactionPreparation)
                    .ThenInclude(p => p!.MasterZone)
                .Include(x => x.TransactionPreparation)
                    .ThenInclude(p => p!.MasterCashPoint)
                .Include(x => x.TransactionPreparation)
                    .ThenInclude(p => p!.MasterCashCenter)
                .Include(x => x.TransactionPreparation)
                    .ThenInclude(p => p!.MasterDenomination)
                .Include(x => x.MasterStatus)
                .Include(x => x.MasterShift)
                .Include(x => x.TransactionReconcile)
                .Where(x =>
                    x.IsDisplay == true &&
                    x.IsActive == true &&
                    x.IsRevoke != true &&
                    x.DepartmentId == filter.DepartmentId)
                .ToListAsync(ct);

            var result = new AutoSellingAllDataResponse();

            foreach (var x in items)
            {
                var qty = x.ReconcileQty ?? 0;
                var m7Qty = x.M7Qty ?? 0;
                var supQty = x.SupQty ?? 0;
                var isMerged = x.IsMixedBundle == true;
                var isExcess = x.IsExcessMachine == true;
                var item = MapToItemResponse(x, isExcess ? qty - supQty : 0);

                if (isMerged && m7Qty > 0 && qty == m7Qty)
                    result.Table2.Add(item);
                else if (isMerged)
                    result.TableB.Add(item);
                else if (isExcess)
                    result.TableC.Add(item);
                else if (qty == 1000)
                    result.Table1.Add(item);
                else
                    result.TableA.Add(item);
            }

            return result;
        }

        public async Task<AutoSellingDetailResponse?> GetDetailAsync(
            string headerCardCode, CancellationToken ct = default)
        {
            var tran = await _db.TransactionReconcileTran
                .AsNoTracking()
                .Include(x => x.TransactionPreparation)
                    .ThenInclude(p => p!.MasterInstitution)
                .Include(x => x.TransactionPreparation)
                    .ThenInclude(p => p!.MasterCashPoint)
                .Include(x => x.TransactionPreparation)
                    .ThenInclude(p => p!.MasterCashCenter)
                .Include(x => x.TransactionPreparation)
                    .ThenInclude(p => p!.MasterDenomination)
                .Include(x => x.TransactionReconcile)
                .Where(x =>
                    x.HeaderCardCode == headerCardCode &&
                    x.IsActive == true)
                .FirstOrDefaultAsync(ct);

            if (tran == null) return null;

            var prep = tran.TransactionPreparation;
            var bank = prep?.MasterInstitution?.BankCode ?? "-";
            var cashpoint = prep?.MasterCashCenter?.CashCenterName ?? "-";
            var denom = prep?.MasterDenomination?.DenominationPrice ?? 0;

            var details = tran.TransactionReconcile?
                .Where(v => v.IsActive == true)
                .ToList() ?? new List<TransactionReconcile>();

            var rows = details.Select(v => new AutoSellingDetailRow
            {
                HeaderCardCode = headerCardCode,
                Bank = bank,
                Cashpoint = cashpoint,
                DenominationPrice = v.DenoPrice,
                Type = BanknoteTypeHelper.MapBnType(v.BnType),
                TypeNum = v.DenomSeries,
                Qty = v.Qty,
                TotalValue = v.TotalValue
            }).ToList();

            return new AutoSellingDetailResponse
            {
                HeaderCardCode = headerCardCode,
                Rows = rows,
                TotalQty = rows.Sum(r => r.Qty),
                TotalValue = rows.Sum(r => r.TotalValue)
            };
        }

        public async Task<bool> SaveAdjustmentAsync(
            AutoSellingAdjustmentRequest request, CancellationToken ct = default)
        {
            var tran = await _db.TransactionReconcileTran
                .Include(x => x.TransactionPreparation)
                    .ThenInclude(p => p!.MasterDenomination)
                .Include(x => x.TransactionReconcile)
                .Where(x => x.IsActive == true
                    && (request.Id > 0
                        ? x.ReconcileTranId == request.Id
                        : x.HeaderCardCode == request.HeaderCardCode))
                .FirstOrDefaultAsync(ct);

            if (tran == null) return false;

            var delta = request.Direction?.ToLower() == "add" ? request.Qty : -request.Qty;
            tran.ReconcileQty = (tran.ReconcileQty ?? 0) + delta;

            var denom = tran.TransactionPreparation?.MasterDenomination?.DenominationPrice ?? 0;
            tran.ReconcileTotalValue = tran.ReconcileQty * denom;
            tran.UpdatedBy = request.UpdatedBy;
            tran.UpdatedDate = DateTime.Now;

            var bnTypeUpper = request.Type?.ToUpper();
            var detail = tran.TransactionReconcile?
                .FirstOrDefault(v => v.IsActive == true && v.BnType?.ToUpper() == bnTypeUpper);

            if (detail != null)
            {
                detail.Qty += delta;
                detail.TotalValue = detail.Qty * denom;
                detail.ManualBy = request.UpdatedBy;
                detail.ManualDate = DateTime.Now;
                detail.AdjustType = request.Remark;
                detail.AdjustDate = DateTime.Now;
                detail.UpdatedBy = request.UpdatedBy;
                detail.UpdatedDate = DateTime.Now;
            }

            await _db.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> CancelSendAsync(
            AutoSellingCancelSendRequest request, CancellationToken ct = default)
        {
            var items = await _db.TransactionReconcileTran
                .Where(x => request.Ids.Contains(x.ReconcileTranId)
                    && x.IsActive == true)
                .ToListAsync(ct);

            if (!items.Any()) return false;

            foreach (var item in items)
            {
                item.IsActive = false;
                item.IsRevoke = true;
                item.UpdatedBy = request.UpdatedBy;
                item.UpdatedDate = DateTime.Now;
            }

            await _db.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> SaveInsertReplaceAsync(
            AutoSellingInsertReplaceRequest request, CancellationToken ct = default)
        {
            var tran = await _db.TransactionReconcileTran
                .Include(x => x.TransactionReconcile)
                .Where(x => x.IsActive == true && x.HeaderCardCode == request.HeaderCardCode)
                .FirstOrDefaultAsync(ct);

            if (tran == null) return false;

            var now = DateTime.Now;
            var subtractRow = request.Rows.FirstOrDefault(r => r.Direction?.ToLower() == "subtract");
            var addRow = request.Rows.FirstOrDefault(r => r.Direction?.ToLower() == "add");
            if (subtractRow == null || addRow == null) return false;

            // 1. Deactivate ALL foreign denom detail rows
            var foreignDetails = tran.TransactionReconcile?
                .Where(v => v.IsActive == true && v.DenoPrice == subtractRow.Denomination)
                .ToList() ?? [];
            foreach (var fd in foreignDetails)
            {
                fd.IsActive = false;
                fd.UpdatedBy = request.UpdatedBy;
                fd.UpdatedDate = now;
            }

            // 2. Add qty to parent denom main row (largest active row)
            var mainDetail = tran.TransactionReconcile?
                .Where(v => v.IsActive == true && v.DenoPrice == addRow.Denomination)
                .OrderByDescending(v => v.Qty)
                .FirstOrDefault();
            if (mainDetail != null)
            {
                mainDetail.Qty += addRow.Qty;
                mainDetail.TotalValue = mainDetail.Qty * mainDetail.DenoPrice;
                mainDetail.ManualBy = request.UpdatedBy;
                mainDetail.ManualDate = now;
                mainDetail.UpdatedBy = request.UpdatedBy;
                mainDetail.UpdatedDate = now;
            }
            else
            {
                var newDetail = new TransactionReconcile
                {
                    ReconcileTranId = tran.ReconcileTranId,
                    BnType = "G",
                    DenomSeries = addRow.TypeNum ?? "17",
                    DenoPrice = addRow.Denomination,
                    Qty = addRow.Qty,
                    TotalValue = addRow.Qty * addRow.Denomination,
                    IsNormal = request.Type?.ToLower() == "normal",
                    IsAddOn = request.Type?.ToLower() == "addon",
                    IsEndJam = request.Type?.ToLower() == "endjam",
                    AdjustType = request.Remark,
                    AdjustDate = now,
                    ManualBy = request.UpdatedBy,
                    ManualDate = now,
                    IsActive = true,
                    CreatedBy = request.UpdatedBy ?? 0,
                    CreatedDate = now,
                    UpdatedBy = request.UpdatedBy,
                    UpdatedDate = now
                };
                _db.TransactionReconcile.Add(newDetail);
            }

            // 3. Recalc header from active details
            var activeDetails = tran.TransactionReconcile?
                .Where(v => v.IsActive == true).ToList() ?? [];
            tran.ReconcileQty = activeDetails.Sum(v => v.Qty);
            tran.ReconcileTotalValue = activeDetails.Sum(v => v.TotalValue);
            tran.UpdatedBy = request.UpdatedBy;
            tran.UpdatedDate = now;

            await _db.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> SaveAdjustOffsetAsync(
            AdjustOffsetRequest request, CancellationToken ct = default)
        {
            // ตั้งสถานะ Adjust Offset เท่านั้น — รอ ธปท approve ก่อนถึงจะปรับจำนวน
            var items = await _db.TransactionReconcileTran
                .Where(x => request.Ids.Contains(x.ReconcileTranId)
                    && x.IsActive == true)
                .ToListAsync(ct);

            if (!items.Any()) return false;

            var now = DateTime.Now;
            foreach (var item in items)
            {
                item.StatusId = 15; // Adjust Offset
                item.UpdatedBy = request.UpdatedBy;
                item.UpdatedDate = now;
            }

            await _db.SaveChangesAsync(ct);
            return true;
        }

        public async Task<bool> ChangeShiftAsync(
            AutoSellingChangeShiftRequest request, CancellationToken ct = default)
        {
            var items = await _db.TransactionReconcileTran
                .Where(x => request.Ids.Contains(x.ReconcileTranId)
                    && x.IsActive == true)
                .ToListAsync(ct);

            if (!items.Any()) return false;

            var now = DateTime.Now;
            foreach (var item in items)
            {
                item.ShiftId = request.ShiftId;
                item.UpdatedBy = request.UpdatedBy;
                item.UpdatedDate = now;
            }

            await _db.SaveChangesAsync(ct);
            return true;
        }

        private static AutoSellingItemResponse MapToItemResponse(TransactionReconcileTran x, int excessQty)
        {
            var prep = x.TransactionPreparation;
            var isEdited = x.TransactionReconcile?.Any(v => v.ManualBy != null) ?? false;

            return new AutoSellingItemResponse
            {
                Id = x.ReconcileTranId,
                HeaderCardCode = x.HeaderCardCode ?? "-",
                Bank = prep?.MasterInstitution?.BankCode ?? "-",
                Zone = prep?.MasterZone?.ZoneName ?? "-",
                Cashpoint = prep?.MasterCashCenter?.CashCenterName ?? "-",
                DenominationPrice = prep?.MasterDenomination?.DenominationPrice ?? 0,
                CountingDate = x.CreatedDate,
                Qty = x.ReconcileQty ?? 0,
                TotalValue = x.ReconcileTotalValue ?? 0,
                Status = x.MasterStatus?.StatusNameEn ?? "Auto Selling",
                IsEdited = isEdited,
                ExcessQty = excessQty,
                ShiftId = x.ShiftId,
                ShiftName = x.MasterShift?.ShiftName
            };
        }

    }
}
