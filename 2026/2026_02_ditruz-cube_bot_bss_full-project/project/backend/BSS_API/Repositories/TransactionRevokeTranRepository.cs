namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Common;
    using Models.RequestModels;
    using Models.ResponseModels;
    using Core.Constants;
    using Core.Helpers;
    using Microsoft.EntityFrameworkCore;

    public class TransactionRevokeTranRepository(ApplicationDbContext db) : ITransactionRevokeTranRepository
    {
        private readonly ApplicationDbContext _db = db;

        public async Task<PagedData<RevokeTransactionResponse>> GetRevokeListAsync(
            PagedRequest<RevokeTransactionFilterRequest> request, CancellationToken ct = default)
        {
            var query = _db.TransactionReconcileTran
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
                .Include(x => x.TransactionPreparation)
                    .ThenInclude(p => p!.TransactionContainerPrepare)
                .Include(x => x.MasterDepartment)
                .Include(x => x.MasterStatus)
                .Include(x => x.MasterShift)
                .Include(x => x.TransactionReconcile)
                .Where(x =>
                    x.IsRevoke == true &&
                    x.IsActive == true &&
                    x.IsDisplay == true &&
                    (x.StatusId == BssStatusConstants.Verify ||
                     x.StatusId == BssStatusConstants.SendToCBMS))
                .AsQueryable();

            if (request.Filter != null)
            {
                var f = request.Filter;
                if (f.DepartmentId > 0)
                    query = query.Where(x => x.DepartmentId == f.DepartmentId);
                if (f.BnTypeId.HasValue)
                    query = query.Where(x => x.TransactionPreparation!.TransactionContainerPrepare.BntypeId == f.BnTypeId.Value);
                if (f.InstitutionId.HasValue)
                    query = query.Where(x => x.TransactionPreparation!.MasterInstitution!.InstitutionId == f.InstitutionId.Value);
                if (f.ZoneId.HasValue)
                    query = query.Where(x => x.TransactionPreparation!.MasterZone!.ZoneId == f.ZoneId.Value);
                if (f.CashpointId.HasValue)
                    query = query.Where(x => x.TransactionPreparation!.MasterCashPoint!.CashpointId == f.CashpointId.Value);
                if (f.DenominationId.HasValue)
                    query = query.Where(x => x.TransactionPreparation!.MasterDenomination!.DenominationId == f.DenominationId.Value);
                if (!string.IsNullOrEmpty(f.HeaderCardCode))
                    query = query.Where(x => x.HeaderCardCode == f.HeaderCardCode);
                if (f.StartDate.HasValue)
                    query = query.Where(x => x.CreatedDate >= f.StartDate.Value);
                if (f.EndDate.HasValue)
                    query = query.Where(x => x.CreatedDate <= f.EndDate.Value);
            }

            var total = await query.CountAsync(ct);

            var items = await query
                .OrderByDescending(x => x.CreatedDate)
                .Skip(request.Skip)
                .Take(request.Take)
                .Select(x => new RevokeTransactionResponse
                {
                    ReconcileTranId = x.ReconcileTranId,
                    HeaderCardCode = x.HeaderCardCode,
                    DepartmentId = x.DepartmentId,
                    Bank = x.TransactionPreparation!.MasterInstitution!.BankCode,
                    CashCenter = x.TransactionPreparation!.MasterCashCenter!.CashCenterName,
                    Zone = x.TransactionPreparation!.MasterZone!.ZoneName,
                    Cashpoint = x.TransactionPreparation!.MasterCashCenter!.CashCenterName,
                    DenominationPrice = x.TransactionPreparation!.MasterDenomination!.DenominationPrice,
                    ParentBarcode = x.TransactionPreparation!.PackageCode,
                    BundleBarcode = x.TransactionPreparation!.BundleCode,
                    ReconcileQty = x.ReconcileQty,
                    ReconcileTotalValue = x.ReconcileTotalValue,
                    StatusId = x.StatusId,
                    StatusName = x.MasterStatus!.StatusNameEn,
                    ShiftId = x.ShiftId,
                    ShiftName = x.MasterShift!.ShiftName,
                    PrepareDate = x.TransactionPreparation!.PrepareDate,
                    CreatedDate = x.CreatedDate,
                    Denominations = x.TransactionReconcile!
                        .Where(r => r.IsActive == true)
                        .Select(r => new RevokeDenominationDetail
                        {
                            ReconcileId = r.ReconcileId,
                            BnType = BanknoteTypeHelper.MapBnType(r.BnType),
                            DenomSeries = r.DenomSeries,
                            DenoPrice = r.DenoPrice,
                            Qty = r.Qty,
                            TotalValue = r.TotalValue,
                        }).ToList(),
                })
                .ToListAsync(ct);

            return new PagedData<RevokeTransactionResponse>
            {
                Items = items,
                TotalCount = total,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }

        public async Task<RevokeDetailResponse?> GetDetailAsync(string headerCardCode, CancellationToken ct = default)
        {
            var result = await _db.TransactionReconcileTran
                .AsNoTracking()
                .Where(x =>
                    x.HeaderCardCode == headerCardCode &&
                    x.IsRevoke == true &&
                    x.IsActive == true)
                .Select(x => new RevokeDetailResponse
                {
                    ReconcileTranId = x.ReconcileTranId,
                    HeaderCardCode = x.HeaderCardCode,
                    Bank = x.TransactionPreparation!.MasterInstitution!.BankCode ?? "-",
                    Cashpoint = x.TransactionPreparation!.MasterCashCenter!.CashCenterName ?? "-",
                    DenominationPrice = x.TransactionPreparation!.MasterDenomination!.DenominationPrice,
                    Rows = x.TransactionReconcile!
                        .Where(r => r.IsActive == true)
                        .Select(r => new RevokeDenominationDetail
                        {
                            ReconcileId = r.ReconcileId,
                            BnType = r.BnType,
                            DenomSeries = r.DenomSeries,
                            DenoPrice = r.DenoPrice,
                            Qty = r.Qty,
                            TotalValue = r.TotalValue,
                        }).ToList(),
                })
                .FirstOrDefaultAsync(ct);

            if (result == null) return null;

            // Map BnType หลัง query เพราะ BanknoteTypeHelper ใช้ใน SQL ไม่ได้
            foreach (var row in result.Rows)
                row.BnType = BanknoteTypeHelper.MapBnType(row.BnType);

            result.TotalQty = result.Rows.Sum(r => r.Qty);
            result.TotalValue = result.Rows.Sum(r => r.TotalValue);

            return result;
        }

        public async Task<int> ExecuteRevokeAsync(RevokeActionRequest request, CancellationToken ct = default)
        {
            var items = await _db.TransactionReconcileTran
                .Where(x => request.ReconcileTranIds.Contains(x.ReconcileTranId)
                    && x.IsRevoke == true
                    && x.IsActive == true)
                .ToListAsync(ct);

            if (!items.Any()) return 0;

            var now = DateTime.Now;
            foreach (var item in items)
            {
                // Revoke: กลับไปสถานะ Auto Selling (14)
                item.StatusId = BssStatusConstants.AutoSelling;
                item.IsRevoke = false;
                item.Remark = request.Remark;
                item.UpdatedBy = request.UpdatedBy;
                item.UpdatedDate = now;
            }

            await _db.SaveChangesAsync(ct);
            return items.Count;
        }
    }
}
