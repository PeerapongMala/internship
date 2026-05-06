namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;
    using Models.Common;
    using Models.RequestModels;
    using Models.ResponseModels;
    using Microsoft.EntityFrameworkCore;

    public class TransactionReconcileTranRepository(ApplicationDbContext db)
        : GenericRepository<TransactionReconcileTran>(db),
            ITransactionReconcileTranRepository
    {
        private readonly ApplicationDbContext _db = db;

        public async Task<PagedData<ReconcileTransactionResponse>> GetReconcileTransactionsAsync(
            PagedRequest<ReconcileTransactionFilterRequest> request, CancellationToken ct = default)
        {
            // TODO: Implement query logic when business requirements are confirmed
            var query = _db.Set<TransactionReconcileTran>()
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
                if (!string.IsNullOrEmpty(f.BnTypeCode))
                    query = query.Where(x => x.TransactionPreparation.TransactionContainerPrepare.MasterBanknoteType.BssBanknoteTypeCode == f.BnTypeCode);
            }

            var total = await query.CountAsync(ct);

            IQueryable<TransactionReconcileTran> final = query.OrderByDescending(x => x.CreatedDate);
            if (request.PageSize > 0)
                final = final.Skip(request.Skip).Take(request.Take);

            var items = await final
                .Select(x => new ReconcileTransactionResponse
                {
                    ReconcileTranId = x.ReconcileTranId,
                    PrepareId = x.PrepareId,
                    HeaderCardCode = x.HeaderCardCode,
                    DepartmentId = x.DepartmentId,
                    MachineHdId = (int)(x.MachineHdId ?? 0),
                    StatusId = x.StatusId,
                    M7Qty = x.M7Qty,
                    ReconcileQty = x.ReconcileQty,
                    SupQty = x.SupQty,
                    BundleNumber = x.BundleNumber,
                    ReconcileTotalValue = x.ReconcileTotalValue,
                    IsWarning = x.IsWarning,
                    IsNotReconcile = x.IsNotReconcile,
                    Remark = x.Remark,
                    AlertRemark = x.AlertRemark,
                    ReferenceCode = x.ReferenceCode,
                    SorterId = x.SorterId,
                    ShiftId = x.ShiftId,
                    PrepareDate = x.TransactionPreparation.PrepareDate,
                    DenominationPrice = x.TransactionPreparation.MasterDenomination.DenominationPrice,
                    CreatedDate = x.CreatedDate,
                    CreatedBy = x.CreatedBy,
                    UpdatedDate = x.UpdatedDate,
                    UpdatedBy = x.UpdatedBy,
                })
                .ToListAsync(ct);

            return new PagedData<ReconcileTransactionResponse>
            {
                Items = items,
                TotalCount = total,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }

        public async Task<TransactionReconcileTran?> GetReconcileTranByIdAsync(long reconcileTranId)
        {
            return await _db.Set<TransactionReconcileTran>()
                .Include(x => x.TransactionReconcile)
                .FirstOrDefaultAsync(x => x.ReconcileTranId == reconcileTranId);
        }

        public async Task<ReconcileHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long reconcileTranId)
        {
            // TODO: Implement with proper joins when business requirements confirmed
            var entity = await _db.Set<TransactionReconcileTran>()
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.ReconcileTranId == reconcileTranId);

            if (entity == null) return null;

            return new ReconcileHeaderCardDetailResponse
            {
                ReconcileTranId = entity.ReconcileTranId,
                HeaderCardCode = entity.HeaderCardCode,
                Date = entity.CreatedDate,
            };
        }

        public async Task<ReconcileDetailResponse?> GetReconcileDetailAsync(long reconcileTranId)
        {
            var entity = await _db.Set<TransactionReconcileTran>()
                .AsNoTracking()
                .Include(x => x.TransactionReconcile)
                .FirstOrDefaultAsync(x => x.ReconcileTranId == reconcileTranId);

            if (entity == null) return null;

            return new ReconcileDetailResponse
            {
                ReconcileTranId = entity.ReconcileTranId,
                HeaderCardCode = entity.HeaderCardCode,
                Denominations = entity.TransactionReconcile?.Select(r => new ReconcileDenominationDetail
                {
                    ReconcileId = r.ReconcileId,
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
                TotalQty = entity.TransactionReconcile?.Sum(r => r.Qty),
                TotalValue = entity.TransactionReconcile?.Sum(r => r.TotalValue),
            };
        }

        public async Task<ReconcileCountResponse> GetReconcileCountAsync(ReconcileCountRequest request)
        {
            var query = _db.Set<TransactionReconcileTran>()
                .AsNoTracking()
                .Where(x => x.IsActive == true);

            if (request.DepartmentId > 0)
                query = query.Where(x => x.DepartmentId == request.DepartmentId);
            if (request.MachineId.HasValue)
                query = query.Where(x => x.MachineHdId == request.MachineId.Value);

            var all = await query.ToListAsync();

            return new ReconcileCountResponse
            {
                TotalReconciled = all.Count(x => x.StatusId == 13),
                TotalPending = all.Count(x => x.StatusId == 11),
                TotalWarning = all.Count(x => x.IsWarning == true),
            };
        }
    }
}
