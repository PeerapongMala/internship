namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;
    using Models.Common;
    using Models.RequestModels;
    using Models.ResponseModels;
    using Microsoft.EntityFrameworkCore;

    public class TransactionVerifyTranRepository(ApplicationDbContext db)
        : GenericRepository<TransactionVerifyTran>(db),
            ITransactionVerifyTranRepository
    {
        private readonly ApplicationDbContext _db = db;

        public async Task<PagedData<VerifyTransactionResponse>> GetVerifyTransactionsAsync(
            PagedRequest<VerifyTransactionFilterRequest> request, CancellationToken ct = default)
        {
            // TODO: Implement query logic when business requirements are confirmed
            var query = _db.Set<TransactionVerifyTran>()
                .AsNoTracking()
                .AsQueryable();

            if (request.Filter != null)
            {
                var f = request.Filter;
                if (f.DepartmentId > 0)
                    query = query.Where(x => x.DepartmentId == f.DepartmentId);
                if (f.MachineId.HasValue)
                    query = query.Where(x => x.MachineHdId == f.MachineId.Value);
                if (!string.IsNullOrEmpty(f.HeaderCardCode))
                    query = query.Where(x => x.HeaderCardCode == f.HeaderCardCode);
                if (f.IsActive)
                    query = query.Where(x => x.IsActive == true);
            }

            var total = await query.CountAsync(ct);

            var items = await query
                .OrderByDescending(x => x.CreatedDate)
                .Skip(request.Skip)
                .Take(request.Take)
                .Select(x => new VerifyTransactionResponse
                {
                    VerifyTranId = x.VerifyTranId,
                    ReconcileTranId = x.ReconcileTranId,
                    PrepareId = x.PrepareId,
                    HeaderCardCode = x.HeaderCardCode,
                    DepartmentId = x.DepartmentId,
                    MachineHdId = x.MachineHdId,
                    StatusId = x.StatusId,
                    M7Qty = x.M7Qty,
                    VerifyQty = x.VerifyQty,
                    SupQty = x.SupQty,
                    BundleNumber = x.BundleNumber,
                    VerifyTotalValue = x.VerifyTotalValue,
                    IsWarning = x.IsWarning,
                    IsNotVerify = x.IsNotVerify,
                    Remark = x.Remark,
                    AlertRemark = x.AlertRemark,
                    ReferenceCode = x.ReferenceCode,
                    SorterId = x.SorterId,
                    ShiftId = x.ShiftId,
                    CreatedDate = x.CreatedDate,
                    CreatedBy = x.CreatedBy,
                    UpdatedDate = x.UpdatedDate,
                    UpdatedBy = x.UpdatedBy,
                })
                .ToListAsync(ct);

            return new PagedData<VerifyTransactionResponse>
            {
                Items = items,
                TotalCount = total,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }

        public async Task<TransactionVerifyTran?> GetVerifyTranByIdAsync(long verifyTranId)
        {
            return await _db.Set<TransactionVerifyTran>()
                .Include(x => x.TransactionVerify)
                .FirstOrDefaultAsync(x => x.VerifyTranId == verifyTranId);
        }

        public async Task<VerifyHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long verifyTranId)
        {
            // TODO: Implement with proper joins when business requirements confirmed
            var entity = await _db.Set<TransactionVerifyTran>()
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.VerifyTranId == verifyTranId);

            if (entity == null) return null;

            return new VerifyHeaderCardDetailResponse
            {
                VerifyTranId = entity.VerifyTranId,
                HeaderCardCode = entity.HeaderCardCode,
                Date = entity.CreatedDate,
            };
        }

        public async Task<VerifyDetailResponse?> GetVerifyDetailAsync(long verifyTranId)
        {
            var entity = await _db.Set<TransactionVerifyTran>()
                .AsNoTracking()
                .Include(x => x.TransactionVerify)
                .FirstOrDefaultAsync(x => x.VerifyTranId == verifyTranId);

            if (entity == null) return null;

            return new VerifyDetailResponse
            {
                VerifyTranId = entity.VerifyTranId,
                HeaderCardCode = entity.HeaderCardCode,
                Denominations = entity.TransactionVerify?.Select(r => new VerifyDenominationDetail
                {
                    VerifyId = r.VerifyId,
                    BnType = r.BnType,
                    DenomSeries = r.DenomSeries,
                    Qty = r.Qty,
                    TotalValue = r.TotalValue,
                    IsReplaceT = r.IsReplaceT,
                    IsReplaceC = r.IsReplaceC,
                    AdjustType = r.AdjustType,
                    IsNormal = r.IsNormal,
                    IsAddOn = r.IsAddOn,
                    IsEndJam = r.IsEndJam,
                }).ToList(),
                TotalQty = entity.TransactionVerify?.Sum(r => r.Qty),
                TotalValue = entity.TransactionVerify?.Sum(r => r.TotalValue),
            };
        }

        public async Task<VerifyCountResponse> GetVerifyCountAsync(VerifyCountRequest request)
        {
            var query = _db.Set<TransactionVerifyTran>()
                .AsNoTracking()
                .Where(x => x.IsActive == true);

            if (request.DepartmentId > 0)
                query = query.Where(x => x.DepartmentId == request.DepartmentId);
            if (request.MachineId.HasValue)
                query = query.Where(x => x.MachineHdId == request.MachineId.Value);

            var all = await query.ToListAsync();

            return new VerifyCountResponse
            {
                TotalVerified = all.Count(x => x.StatusId == 18), // SendToCBMS
                TotalPending = all.Count(x => x.StatusId == 17),  // Verify
                TotalWarning = all.Count(x => x.IsWarning == true),
            };
        }
    }
}
