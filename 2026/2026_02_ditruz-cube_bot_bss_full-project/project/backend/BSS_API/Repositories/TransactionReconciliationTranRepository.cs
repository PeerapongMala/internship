namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;
    using Models.Common;
    using Models.RequestModels;
    using Models.ResponseModels;
    using Microsoft.EntityFrameworkCore;
    using BSS_API.Core.Constants;

    public class TransactionReconciliationTranRepository(ApplicationDbContext db)
        : GenericRepository<TransactionReconcileTran>(db),
            ITransactionReconciliationTranRepository
    {
        private readonly ApplicationDbContext _db = db;

        public async Task<PagedData<ReconciliationTransactionResponse>> GetReconciliationTransactionsAsync(
            PagedRequest<ReconciliationFilterRequest> request, CancellationToken ct = default)
        {
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
            }

            var total = await query.CountAsync(ct);

            var users = _db.Set<MasterUser>().AsNoTracking();

            var items = await query
                .OrderByDescending(x => x.CreatedDate)
                .Skip(request.Skip)
                .Take(request.Take)
                .GroupJoin(users, rt => rt.CreatedBy, u => u.UserId, (rt, cUsers) => new { rt, cUsers })
                .SelectMany(g => g.cUsers.DefaultIfEmpty(), (g, createdUser) => new { g.rt, createdUser })
                .GroupJoin(users, g => g.rt.UpdatedBy, u => u.UserId, (g, uUsers) => new { g.rt, g.createdUser, uUsers })
                .SelectMany(g => g.uUsers.DefaultIfEmpty(), (g, updatedUser) => new ReconciliationTransactionResponse
                {
                    ReconciliationTranId = g.rt.ReconcileTranId,
                    PrepareId = g.rt.PrepareId,
                    HeaderCardCode = g.rt.HeaderCardCode,
                    DepartmentId = g.rt.DepartmentId,
                    MachineHdId = (int?)g.rt.MachineHdId,
                    MachineName = g.rt.TransactionMachineHd != null && g.rt.TransactionMachineHd.MasterMachine != null
                        ? g.rt.TransactionMachineHd.MasterMachine.MachineName : null,
                    DenominationPrice = g.rt.TransactionPreparation != null
                        ? g.rt.TransactionPreparation.MasterDenomination != null
                            ? (int?)g.rt.TransactionPreparation.MasterDenomination.DenominationPrice
                            : null
                        : null,
                    StatusId = g.rt.StatusId,
                    StatusCode = g.rt.MasterStatus != null ? g.rt.MasterStatus.StatusCode : null,
                    StatusNameTh = g.rt.MasterStatus != null ? g.rt.MasterStatus.StatusNameTh : null,
                    StatusNameEn = g.rt.MasterStatus != null ? g.rt.MasterStatus.StatusNameEn : null,
                    M7Qty = g.rt.M7Qty,
                    ReconciliationQty = g.rt.ReconcileQty,
                    SupQty = g.rt.SupQty,
                    BundleNumber = g.rt.BundleNumber,
                    ReconciliationTotalValue = g.rt.ReconcileTotalValue,
                    IsWarning = g.rt.IsWarning,
                    IsNotReconcile = g.rt.IsNotReconcile,
                    Remark = g.rt.Remark,
                    AlertRemark = g.rt.AlertRemark,
                    ReferenceCode = g.rt.ReferenceCode,
                    SorterId = g.rt.SorterId,
                    ShiftId = g.rt.ShiftId,
                    ShiftName = g.rt.MasterShift != null ? g.rt.MasterShift.ShiftName : null,
                    PrepareDate = g.rt.TransactionPreparation != null ? (DateTime?)g.rt.TransactionPreparation.PrepareDate : null,
                    CreatedDate = g.rt.CreatedDate,
                    CreatedBy = g.rt.CreatedBy,
                    CreatedByName = g.createdUser != null ? g.createdUser.FirstName : null,
                    UpdatedDate = g.rt.UpdatedDate,
                    UpdatedBy = g.rt.UpdatedBy,
                    UpdatedByName = updatedUser != null ? updatedUser.FirstName : null,
                })
                .ToListAsync(ct);

            return new PagedData<ReconciliationTransactionResponse>
            {
                Items = items,
                TotalCount = total,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize
            };
        }

        public async Task<TransactionReconcileTran?> GetReconciliationTranByIdAsync(long reconsileTranId)
        {
            return await _db.Set<TransactionReconcileTran>()
                .Include(x => x.TransactionReconcile)
                .FirstOrDefaultAsync(x => x.ReconcileTranId == reconsileTranId);
        }

        public async Task<ReconciliationHeaderCardDetailResponse?> GetHeaderCardDetailAsync(long reconsileTranId)
        {
            var entity = await _db.Set<TransactionReconcileTran>()
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.ReconcileTranId == reconsileTranId);

            if (entity == null) return null;

            // Query all preparations with the same header_card_code, join master tables
            var bundles = await _db.Set<TransactionPreparation>()
                .AsNoTracking()
                .Where(p => p.HeaderCardCode == entity.HeaderCardCode && p.IsActive == true)
                .Join(_db.Set<MasterDenomination>(),
                    p => p.DenoId, d => d.DenominationId,
                    (p, d) => new { Prep = p, Denom = d })
                .Join(_db.Set<MasterInstitution>(),
                    pd => pd.Prep.InstId, i => i.InstitutionId,
                    (pd, i) => new { pd.Prep, pd.Denom, Inst = i })
                .GroupJoin(_db.Set<MasterCashPoint>(),
                    pdi => pdi.Prep.CashpointId, cp => cp.CashpointId,
                    (pdi, cps) => new { pdi.Prep, pdi.Denom, pdi.Inst, CashPoints = cps })
                .SelectMany(x => x.CashPoints.DefaultIfEmpty(),
                    (x, cp) => new PreparationBundleDetail
                    {
                        PrepareId = x.Prep.PrepareId,
                        HeaderCardCode = x.Prep.HeaderCardCode,
                        DenomPrice = x.Denom.DenominationPrice,
                        BankCode = x.Inst.BankCode,
                        BankName = x.Inst.InstitutionShortName,
                        CashpointName = cp != null ? cp.CashpointName : null,
                        Qty = x.Prep.Qty,
                    })
                .OrderBy(b => b.DenomPrice)
                .ToListAsync();

            // UC05: DISABLED — รอยืนยันว่า is_machine_result ใช้แยก "สลับมือ" จริง
            // หรือแค่ flag "ผ่านเครื่อง" (ถ้าทุก HC ตารางกลางมี → trigger ทุกตัว = ผิด)
            // var hasMachineResult = await _db.Set<TransactionReconcileTmp>()
            //     .AnyAsync(t => t.ReconcileTranId == reconsileTranId && t.IsMachineResult == true);

            return new ReconciliationHeaderCardDetailResponse
            {
                ReconciliationTranId = entity.ReconcileTranId,
                HeaderCardCode = entity.HeaderCardCode,
                Date = entity.CreatedDate,
                BundleNumber = bundles.Count,
                HasMachineResult = false, // UC05 disabled
                Bundles = bundles,
            };
        }

        public async Task<ReconciliationDetailResponse?> GetReconciliationDetailAsync(long reconsileTranId)
        {
            var entity = await _db.Set<TransactionReconcileTran>()
                .AsNoTracking()
                .Include(x => x.TransactionReconcile)
                .FirstOrDefaultAsync(x => x.ReconcileTranId == reconsileTranId);

            if (entity == null) return null;

            // Reconciled/confirmed → read from reconcile (final)
            // Otherwise → read from reconcile_tmp (staging) if available
            if (entity.StatusId != BssStatusConstants.Reconciled)
            {
                var tmpRecords = await _db.Set<TransactionReconcileTmp>()
                    .AsNoTracking()
                    .Where(t => t.ReconcileTranId == reconsileTranId && t.IsMachineResult == false)
                    .ToListAsync();

                if (tmpRecords.Any())
                {
                    return new ReconciliationDetailResponse
                    {
                        ReconciliationTranId = entity.ReconcileTranId,
                        HeaderCardCode = entity.HeaderCardCode,
                        Denominations = tmpRecords.Select(t => new ReconciliationDenominationDetail
                        {
                            ReconciliationId = t.ReconcileTmpId,
                            BnType = t.BnType,
                            DenomSeries = t.DenomSeries,
                            DenoPrice = t.DenoPrice,
                            Qty = t.TmpQty,
                            TotalValue = t.TmpValue,
                            AdjustType = null,
                            HeaderCardCode = t.HeaderCardCode,
                            IsReplaceT = t.IsReplaceT,
                            IsReplaceC = t.IsReplaceC,
                            CreatedDate = t.CreatedDate,
                        }).ToList(),
                        TotalQty = tmpRecords.Sum(t => t.TmpQty),
                        TotalValue = tmpRecords.Sum(t => t.TmpValue),
                    };
                }
            }

            return new ReconciliationDetailResponse
            {
                ReconciliationTranId = entity.ReconcileTranId,
                HeaderCardCode = entity.HeaderCardCode,
                Denominations = entity.TransactionReconcile?.Select(r => new ReconciliationDenominationDetail
                {
                    ReconciliationId = r.ReconcileId,
                    BnType = r.BnType,
                    DenomSeries = r.DenomSeries,
                    DenoPrice = r.DenoPrice,
                    Qty = r.Qty,
                    TotalValue = r.TotalValue,
                    IsReplaceT = r.IsReplaceT,
                    IsReplaceC = r.IsReplaceC,
                    AdjustType = r.AdjustType,
                    IsNormal = r.IsNormal,
                    IsAddOn = r.IsAddOn,
                    IsEndJam = r.IsEndJam,
                    CreatedDate = r.CreatedDate,
                }).ToList(),
                TotalQty = entity.TransactionReconcile?.Sum(r => r.Qty),
                TotalValue = entity.TransactionReconcile?.Sum(r => r.TotalValue),
            };
        }

        public async Task<ReconciliationCountResponse> GetReconciliationCountAsync(ReconciliationCountRequest request)
        {
            var query = _db.Set<TransactionReconcileTran>()
                .AsNoTracking()
                .Where(x => x.IsActive == true);

            if (request.DepartmentId > 0)
                query = query.Where(x => x.DepartmentId == request.DepartmentId);
            if (request.MachineId.HasValue)
                query = query.Where(x => x.MachineHdId == request.MachineId.Value);

            return new ReconciliationCountResponse
            {
                TotalReconciled = await query.CountAsync(x => x.StatusId == BssStatusConstants.Reconciled),
                TotalPending = await query.CountAsync(x => x.StatusId == BssStatusConstants.Reconciliation),
                TotalWarning = await query.CountAsync(x => x.IsWarning == true),
            };
        }
    }
}
