namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;
    using Models.Common;
    using Models.RequestModels;
    using Models.ResponseModels;
    using Microsoft.EntityFrameworkCore;

    public class TransactionApproveManualKeyInTranRepository(ApplicationDbContext db)
        : GenericRepository<TransactionApproveManualKeyInTran>(db),
            ITransactionApproveManualKeyInTranRepository
    {
        private readonly ApplicationDbContext _db = db;

        private static readonly int[] ApproveManualKeyInStatuses =
        [
            Core.Constants.BssStatusConstants.AdjustOffset,              // 15
            Core.Constants.BssStatusConstants.Approved,                  // 16
            Core.Constants.BssStatusConstants.Edited,                    // 20
            Core.Constants.BssStatusConstants.CancelSentDeniedEdited,    // 22
            Core.Constants.BssStatusConstants.CancelSent,                // 23
            Core.Constants.BssStatusConstants.ManualKeyIn,               // 24
            Core.Constants.BssStatusConstants.CancelSentManualKeyIn,     // 26
            Core.Constants.BssStatusConstants.EditedApproved,            // 27
            Core.Constants.BssStatusConstants.CancelSentDeniedApproved,  // 29
            Core.Constants.BssStatusConstants.ApprovedCancel,            // 30
        ];

        public async Task<PagedData<ApproveManualKeyInTransactionResponse>> GetApproveManualKeyInTransactionsAsync(
            PagedRequest<ApproveManualKeyInTransactionFilterRequest> request, CancellationToken ct = default)
        {
            var query = _db.Set<TransactionReconcileTran>()
                .AsNoTracking()
                .Where(x => ApproveManualKeyInStatuses.Contains(x.StatusId))
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
                .Select(x => new ApproveManualKeyInTransactionResponse
                {
                    ApproveManualKeyInTranId = x.ReconcileTranId,
                    PrepareId = x.PrepareId,
                    HeaderCardCode = x.HeaderCardCode,
                    DepartmentId = x.DepartmentId,
                    MachineHdId = x.MachineHdId,
                    PackageCode = x.TransactionPreparation!.PackageCode,
                    BundleCode = x.TransactionPreparation.BundleCode,
                    BankName = x.TransactionPreparation.MasterInstitution.InstitutionNameTh,
                    ZoneName = x.TransactionPreparation.MasterZone != null ? x.TransactionPreparation.MasterZone.ZoneName : null,
                    CashpointName = x.TransactionPreparation.MasterCashPoint != null ? x.TransactionPreparation.MasterCashPoint.CashpointName : null,
                    BnTypeName = x.TransactionPreparation.TransactionContainerPrepare.MasterBanknoteType.BanknoteTypeName,
                    DenominationPrice = x.TransactionPreparation.MasterDenomination.DenominationPrice,
                    StatusId = x.StatusId,
                    StatusCode = x.MasterStatus!.StatusCode,
                    StatusNameTh = x.MasterStatus.StatusNameTh,
                    StatusNameEn = x.MasterStatus.StatusNameEn,
                    M7Qty = x.M7Qty,
                    ManualKeyInQty = (int?)null,
                    SupQty = x.SupQty,
                    BundleNumber = x.BundleNumber,
                    TotalValue = x.ReconcileTotalValue,
                    IsWarning = x.IsWarning,
                    IsNotApproved = x.IsNotReconcile,
                    Remark = x.Remark,
                    AlertRemark = x.AlertRemark,
                    ReferenceCode = x.ReferenceCode,
                    SorterId = x.SorterId,
                    ShiftId = x.ShiftId,
                    ShiftName = x.MasterShift != null ? x.MasterShift.ShiftName : null,
                    PrepareDate = x.TransactionPreparation.PrepareDate,
                    ManualDate = _db.Set<TransactionManualTmp>()
                        .Where(mt => mt.ReconcileTranId == x.ReconcileTranId)
                        .OrderByDescending(mt => mt.ManualDate)
                        .Select(mt => (DateTime?)mt.ManualDate)
                        .FirstOrDefault(),
                    CreatedDate = x.CreatedDate,
                    CreatedBy = x.CreatedBy,
                    UpdatedDate = x.UpdatedDate,
                    UpdatedBy = x.UpdatedBy,
                })
                .ToListAsync(ct);

            return new PagedData<ApproveManualKeyInTransactionResponse>
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
                .FirstOrDefaultAsync(x => x.ReconcileTranId == reconcileTranId
                    && ApproveManualKeyInStatuses.Contains(x.StatusId));
        }

        public async Task<ApproveManualKeyInHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long reconcileTranId)
        {
            var entity = await _db.Set<TransactionReconcileTran>()
                .AsNoTracking()
                .Where(x => x.ReconcileTranId == reconcileTranId
                    && ApproveManualKeyInStatuses.Contains(x.StatusId))
                .Select(x => new ApproveManualKeyInHeaderCardDetailResponse
                {
                    ApproveManualKeyInTranId = x.ReconcileTranId,
                    HeaderCardCode = x.HeaderCardCode,
                    Date = x.CreatedDate,
                    ShiftName = x.MasterShift != null ? x.MasterShift.ShiftName : null,
                })
                .FirstOrDefaultAsync();

            return entity;
        }

        public async Task<ApproveManualKeyInDetailResponse?> GetApproveManualKeyInDetailAsync(long reconcileTranId)
        {
            var tran = await _db.Set<TransactionReconcileTran>()
                .AsNoTracking()
                .Where(x => x.ReconcileTranId == reconcileTranId
                    && ApproveManualKeyInStatuses.Contains(x.StatusId))
                .Select(x => new { x.ReconcileTranId, x.HeaderCardCode })
                .FirstOrDefaultAsync();

            if (tran == null) return null;

            // Try manual_tmp first (status 24/26 — MKI staging data)
            var denomRows = await _db.Set<TransactionManualTmp>()
                .AsNoTracking()
                .Where(x => x.ReconcileTranId == reconcileTranId)
                .Select(x => new ApproveManualKeyInDenominationDetail
                {
                    ApproveManualKeyInId = x.ManualTmpId,
                    DenoPrice = x.DenoPrice,
                    BnType = x.BnType,
                    DenomSeries = x.DenomSeries,
                    Qty = x.TmpQty,
                    TotalValue = x.TmpValue,
                    TmpAction = x.TmpAction,
                })
                .ToListAsync();

            // Fallback to reconcile (status 16/20/15/etc — data already copied)
            if (denomRows.Count == 0)
            {
                denomRows = await _db.Set<TransactionReconcile>()
                    .AsNoTracking()
                    .Where(x => x.ReconcileTranId == reconcileTranId && x.IsActive == true)
                    .Select(x => new ApproveManualKeyInDenominationDetail
                    {
                        ApproveManualKeyInId = x.ReconcileId,
                        DenoPrice = x.DenoPrice,
                        BnType = x.BnType,
                        DenomSeries = x.DenomSeries,
                        Qty = x.Qty,
                        TotalValue = x.TotalValue,
                        TmpAction = null,
                        AdjustType = x.AdjustType,
                        IsReplaceT = x.IsReplaceT,
                        IsReplaceC = x.IsReplaceC,
                        IsAddOn = x.IsAddOn,
                        IsEndJam = x.IsEndJam,
                    })
                    .ToListAsync();
            }

            return new ApproveManualKeyInDetailResponse
            {
                ApproveManualKeyInTranId = tran.ReconcileTranId,
                HeaderCardCode = tran.HeaderCardCode,
                Denominations = denomRows,
                TotalQty = denomRows.Sum(r => r.Qty),
                TotalValue = denomRows.Sum(r => r.TotalValue),
            };
        }

        public async Task<ApproveManualKeyInCountResponse> GetApproveManualKeyInCountAsync(ApproveManualKeyInCountRequest request)
        {
            var countStatuses = ApproveManualKeyInStatuses.Append(Core.Constants.BssStatusConstants.DeniedManualKeyIn).ToArray();
            var query = _db.Set<TransactionReconcileTran>()
                .AsNoTracking()
                .Where(x => x.IsActive == true && countStatuses.Contains(x.StatusId));

            if (request.DepartmentId > 0)
                query = query.Where(x => x.DepartmentId == request.DepartmentId);
            if (request.MachineId.HasValue)
                query = query.Where(x => x.MachineHdId == request.MachineId.Value);

            var all = await query.ToListAsync();

            return new ApproveManualKeyInCountResponse
            {
                TotalApproved = all.Count(x => x.StatusId == Core.Constants.BssStatusConstants.Approved),
                TotalPending = all.Count(x => x.StatusId == Core.Constants.BssStatusConstants.ManualKeyIn),
                TotalRejected = all.Count(x => x.StatusId == Core.Constants.BssStatusConstants.DeniedManualKeyIn),
            };
        }

        public async Task<List<TransactionManualTmp>> GetManualTmpByTranIdAsync(long reconcileTranId)
        {
            return await _db.Set<TransactionManualTmp>()
                .AsNoTracking()
                .Where(x => x.ReconcileTranId == reconcileTranId)
                .ToListAsync();
        }

        public async Task AddManualTmpAsync(TransactionManualTmp detail)
        {
            await _db.Set<TransactionManualTmp>().AddAsync(detail);
        }

        #region Legacy methods — used by ManualKeyInService (Terminal A)

        public async Task<TransactionApproveManualKeyInTran?> GetApproveManualKeyInTranByIdAsync(long approveManualKeyInTranId)
        {
            return await _db.Set<TransactionApproveManualKeyInTran>()
                .Include(x => x.TransactionApproveManualKeyIn)
                .FirstOrDefaultAsync(x => x.ApproveManualKeyInTranId == approveManualKeyInTranId);
        }

        public async Task<List<TransactionApproveManualKeyIn>> GetDetailsByTranIdAsync(long approveManualKeyInTranId)
        {
            return await _db.Set<TransactionApproveManualKeyIn>()
                .AsNoTracking()
                .Where(x => x.ApproveManualKeyInTranId == approveManualKeyInTranId && x.IsActive == true)
                .ToListAsync();
        }

        public async Task AddDetailAsync(TransactionApproveManualKeyIn detail)
        {
            await _db.Set<TransactionApproveManualKeyIn>().AddAsync(detail);
        }

        public async Task SoftDeleteDetailsByTranIdAsync(long approveManualKeyInTranId, int updatedBy)
        {
            var details = await _db.Set<TransactionApproveManualKeyIn>()
                .Where(x => x.ApproveManualKeyInTranId == approveManualKeyInTranId && x.IsActive == true)
                .ToListAsync();

            foreach (var detail in details)
            {
                detail.IsActive = false;
                detail.UpdatedBy = updatedBy;
                detail.UpdatedDate = DateTime.Now;
            }
        }

        #endregion Legacy methods
    }
}
