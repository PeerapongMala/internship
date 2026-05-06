using BSS_API.Core.Constants;

namespace BSS_API.Repositories
{
    using Common;
    using Models;
    using Interface;
    using Models.Entities;
    using Models.ObjectModels;
    using Models.RequestModels;
    using Models.ResponseModels;
    using BSS_API.Models.Common;
    using System.Linq.Expressions;
    using Microsoft.EntityFrameworkCore;

    public class TransactionPreparationRepository(ApplicationDbContext db)
        : GenericRepository<TransactionPreparation>(db),
            ITransactionPreparationRepository
    {
        private readonly ApplicationDbContext _db = db;


        public async Task<TransactionPreparation?> GetLastTransactionPreparationWithContainerIdAsync(long containerId)
        {
            return await _db.TransactionPreparation
                .AsQueryable()
                .AsNoTracking()
                .Where(x => x.ContainerPrepareId == containerId && x.IsActive != false)
                .OrderByDescending(x => x.CreatedDate)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<TransactionPreparationViewData>> GetAllPreparationAsync()
        {
            var data = await _db.TransactionPreparation
                .Include(x => x.TransactionContainerPrepare)
                .Include(x => x.MasterInstitution)
                .Include(x => x.MasterCashCenter)
                .Include(x => x.MasterZone)
                .Include(x => x.MasterCashPoint)
                .Include(x => x.MasterDenomination)
                .Include(x => x.MasterStatus)
                .AsNoTracking()
                .Select(x => new TransactionPreparationViewData
                {
                    PrepareId = x.PrepareId,
                    ContainerPrepareId = x.ContainerPrepareId,
                    ContainerCode = x.TransactionContainerPrepare.ContainerCode,
                    HeaderCardCode = x.HeaderCardCode,
                    PackageCode = x.PackageCode,
                    BundleCode = x.BundleCode,
                    InstId = x.InstId,
                    InstitutionShortName = x.MasterInstitution.InstitutionShortName,
                    CashcenterId = x.CashcenterId,
                    CashCenterName = x.MasterCashCenter.CashCenterName,
                    ZoneId = x.ZoneId,
                    ZoneName = x.MasterZone.ZoneName,
                    CashpointId = x.CashpointId,
                    CashpointName = x.MasterCashPoint.CashpointName,
                    DenoId = x.DenoId,
                    DenominationPrice = x.MasterDenomination.DenominationPrice,
                    Qty = x.Qty,
                    Remark = x.Remark,
                    StatusId = x.StatusId,
                    StatusNameTh = x.MasterStatus.StatusNameTh,
                    PrepareDate = x.PrepareDate,
                    IsReconcile = x.IsReconcile,
                    IsActive = x.IsActive,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate,
                    CreatedByName = (x.CreatedByUser != null
                        ? (x.CreatedByUser.FirstName ?? string.Empty) + " " + (x.CreatedByUser.LastName ?? string.Empty)
                        : string.Empty),
                    UpdatedByName = (x.UpdatedByUser != null
                        ? (x.UpdatedByUser.FirstName ?? string.Empty) + " " + (x.UpdatedByUser.LastName ?? string.Empty)
                        : string.Empty)
                })
                .ToListAsync();
            return data;
        }

        public async Task<TransactionPreparation?> GetPreparationByIdAsync(long prepareId)
        {
            try
            {
                var data = await _db.TransactionPreparation
                    .Include(x => x.TransactionContainerPrepare)
                    .Include(x => x.MasterInstitution)
                    .Include(x => x.MasterCashCenter)
                    .Include(x => x.MasterZone)
                    .Include(x => x.MasterCashPoint)
                    .Include(x => x.MasterDenomination)
                    .Include(x => x.MasterStatus)
                    .AsNoTracking()
                    .FirstOrDefaultAsync(x => x.PrepareId == prepareId);
                return data;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<List<TransactionPreparation>> GetPreparationByIdsAsync(List<long> prepareIds)
        {
            var data = await _db.TransactionPreparation
                //.Include(x => x.TransactionContainerPrepare)
                .AsNoTracking().Where(x => prepareIds.Contains(x.PrepareId))
                .ToListAsync();
            return data;
        }

        public async Task<TransactionPreparation?> ValidateHeaderCardIsExistingAsync(string headerCard,
            DateTime startDate, DateTime endDate,
            int? departmentId = null, int? machineId = null)
        {
            IQueryable<TransactionPreparation> queryable = _dbSet
                .Include(x => x.TransactionContainerPrepare)
                .Where(w => w.HeaderCardCode == headerCard &&
                            w.CreatedDate >= startDate &&
                            w.CreatedDate <= endDate &&
                            w.IsActive == true)
                .AsNoTracking();

            if (departmentId != null)
            {
                queryable = queryable.Where(w => w.TransactionContainerPrepare.DepartmentId == departmentId);
            }
            else if (machineId != null)
            {
                queryable = queryable.Where(w => w.TransactionContainerPrepare.MachineId == machineId);
            }

            return await queryable.FirstOrDefaultAsync();
        }

        public async Task<bool> IsAllPrepareDeletedInContainerAsync(long containerPrepareId)
        {
            var hasAnyNotDeleted = await _db.TransactionPreparation
                .AsNoTracking()
                .AnyAsync(x =>
                    x.ContainerPrepareId == containerPrepareId &&
                    x.IsActive == true);

            return !hasAnyNotDeleted;
        }

        public async Task<CountPrepareResponseModel> GetCountPrepareByContainerAsync(
            CountPrepareByContainerRequest request, DateTime startDate, DateTime endDate)
        {
            var result = new CountPrepareResponseModel();
            var allCountPrepare = 0;

            if (request.DepartmentId == 0 || string.IsNullOrEmpty(request.ContainerId))
            {
                return result;
            }

            string bnTypeCodeInput = string.Empty;
            if (request.BssBNTypeCode == BssBNTypeCodeConstants.Unfit ||
                 request.BssBNTypeCode == BssBNTypeCodeConstants.UnsortCANonMember ||
                 request.BssBNTypeCode == BssBNTypeCodeConstants.UnsortCAMember)
            {
                #region Count Prepare For Unfit,CAMember,CANonMember

                bnTypeCodeInput = request.BssBNTypeCode == BssBNTypeCodeConstants.Unfit
                            ? BNTypeCodeConstants.Unfit
                            : BNTypeCodeConstants.UnsortCAMember;


                var queryReceiveCbmsData = await _db.ReceiveCbmsDataTransactions
                    .AsNoTracking()
                    .Where(r => r.DepartmentId == request.DepartmentId &&
                                r.ContainerId == request.ContainerId &&
                                r.BnTypeInput == bnTypeCodeInput &&
                                r.SendDate >= startDate && r.SendDate <= endDate)
                    .ToListAsync();

                if (queryReceiveCbmsData == null)
                {
                    return result;
                }

                foreach (var receiveItem in queryReceiveCbmsData)
                {
                    var queryContainerData = await _db.TransactionContainerPrepares
                                            .AsNoTracking()
                                            .Where(x => x.ReceiveId == receiveItem.ReceiveId &&
                                                        x.DepartmentId == request.DepartmentId)
                                            .Select(x => new CountContainerPrepareModel
                                            {
                                                ContainerPrepareId = x.ContainerPrepareId
                                            })
                                            .ToListAsync();


                    if (queryContainerData.Any())
                    {
                        foreach (var itemContainer in queryContainerData)
                        {
                            long ContainerPrepareId = itemContainer.ContainerPrepareId;

                            var queryPrepareData = await _db.TransactionPreparation
                                .AsNoTracking()
                                .Where(x => x.ContainerPrepareId == ContainerPrepareId && 
                                            x.IsActive == true &&
                                            x.IsReconcile == false)
                                .Select(x => new CountPrepareByContainerModel
                                {
                                    PrepareId = x.PrepareId
                                })
                                .ToListAsync();

                            if (queryPrepareData.Any())
                            {
                                allCountPrepare += queryPrepareData.Count;
                            }
                        }
                    }

                }

                #endregion Count Prepare For Unfit,CAMember,CANonMember
            }
            else
            {
                #region Count Prepare For UnsortCC
                var queryRegisterUnsort = await _db.TransactionRegisterUnsorts
                    .AsNoTracking()
                    .Where(rg => rg.ContainerCode == request.ContainerId &&
                                 rg.StatusId == BssStatusConstants.Received &&
                                 rg.ReceivedDate >= startDate && rg.ReceivedDate <= endDate &&
                                 rg.IsActive == true)
                     .ToListAsync();

                if (queryRegisterUnsort == null)
                {
                    return result;
                }

                foreach (var itemRegister in queryRegisterUnsort)
                {

                    var queryUnsortCCData = await _db.TransactionUnsortCCs
                                .AsNoTracking()
                                .Where(uc => uc.RegisterUnsortId == itemRegister.RegisterUnsortId)
                                .ToListAsync();

                    if (queryUnsortCCData.Any())
                    {

                        foreach (var itemUnsortCC in queryUnsortCCData)
                        {
                            var queryPrepareData = await _db.TransactionPreparation
                                    .AsNoTracking()
                                    .Where(p => p.TransactionUnsortCCId == itemUnsortCC.UnsortCCId &&
                                                p.IsActive == true &&
                                                p.IsReconcile == false)
                                    .Select(x => new CountPrepareByContainerModel
                                    {
                                        PrepareId = x.PrepareId
                                    })
                                    .ToListAsync();

                            if (queryPrepareData.Any())
                            {
                                allCountPrepare += queryPrepareData.Count;
                            }
                        }
                    }
                }

                #endregion Count Prepare For UnsortCC
            }

            result.CountPrepare = allCountPrepare; //queryPrepareData.Count;
            return result;
        }

        public async Task<CountReconcileResponseModel> GetCountReconcileAsync(GetCountReconcileRequest request)
        {
            var resultData = new CountReconcileResponseModel();

            var bnTypeData = await _db.MasterBanknoteTypes.AsNoTracking()
                .Where(b => b.BssBanknoteTypeCode == request.BnTypeCode.Trim()).FirstOrDefaultAsync();

            if (request.PrepareCentral == "YES")
            {
                var data = await _db.TransactionPreparation
                    .Include(x => x.TransactionContainerPrepare)
                    .AsNoTracking()
                    .Where(x => x.IsActive == true && x.IsReconcile == true &&
                                x.CreatedDate >= request.DateTimeStart && x.CreatedDate <= request.DateTimeEnd &&
                                x.TransactionContainerPrepare.IsActive == true &&
                                x.TransactionContainerPrepare.DepartmentId == request.DepartmentId &&
                                x.TransactionContainerPrepare.BntypeId == bnTypeData.BanknoteTypeId &&
                                x.TransactionContainerPrepare.MachineId == request.MachineId
                    )
                    .Select(x => new CountReconcilePrepareData
                    {
                        HeaderCardCode = x.HeaderCardCode,
                    })
                    .ToListAsync();

                resultData.CountReconcile = data.Count;
            }
            else
            {
                var data = await _db.TransactionPreparation
                    .Include(x => x.TransactionContainerPrepare)
                    .AsNoTracking()
                    .Where(x => x.IsActive == true && x.IsReconcile == true &&
                                x.CreatedDate >= request.DateTimeStart && x.CreatedDate <= request.DateTimeEnd &&
                                x.TransactionContainerPrepare.IsActive == true &&
                                x.TransactionContainerPrepare.DepartmentId == request.DepartmentId &&
                                x.TransactionContainerPrepare.BntypeId == bnTypeData.BanknoteTypeId
                    )
                    .Select(x => new CountReconcilePrepareData
                    {
                        HeaderCardCode = x.HeaderCardCode,
                    })
                    .ToListAsync();

                resultData.CountReconcile = data.Count;
            }

            return resultData;
        }

        public Task<PagedData<PreparationUnfitResponse>> GetPreparationUnfitAsync(
            PagedRequest<PreparationUnfitRequest> request,
            CancellationToken ct = default)
            => Query()
                .ToPagedDataAsync(
                    request: request,
                    applyFilter: GetPreparationUnfitFilter,
                    applySearch: null,
                    sortMap: PreparationUnfitSortMap,
                    selector: x => new PreparationUnfitResponse
                    {
                        PrepareId = x.PrepareId,
                        PackageCode = x.PackageCode,
                        BundleCode = x.BundleCode,
                        HeaderCardCode = x.HeaderCardCode,
                        ContainerPrepareId = x.ContainerPrepareId,
                        ContainerCode = x.TransactionContainerPrepare.ContainerCode,
                        InstitutionCode = x.MasterInstitution.InstitutionCode,
                        BankCode = x.MasterInstitution.BankCode,
                        CashCenterName = x.MasterCashCenter.CashCenterName,
                        DenominationPrice = x.MasterDenomination.DenominationPrice,
                        StatusCode = x.MasterStatus.StatusCode,
                        StatusNameTh = x.MasterStatus.StatusNameTh,
                        StatusNameEn = x.MasterStatus.StatusNameEn,
                        BanknoteTypeCode = x.TransactionContainerPrepare.MasterBanknoteType.BanknoteTypeCode,
                        BssBanknoteTypeCode = x.TransactionContainerPrepare.MasterBanknoteType.BssBanknoteTypeCode,
                        BanknoteTypeName = x.TransactionContainerPrepare.MasterBanknoteType.BanknoteTypeName,
                        PrepareDate = x.PrepareDate,
                        CreatedBy = x.CreatedBy,
                        CreatedDate = x.CreatedDate,
                        UpdatedBy = x.UpdatedBy,
                        UpdatedDate = x.UpdatedDate,
                        CreatedByName = (x.CreatedByUser != null
                            ? (x.CreatedByUser.FirstName ?? string.Empty) + " " +
                              (x.CreatedByUser.LastName ?? string.Empty)
                            : string.Empty),
                        UpdatedByName = (x.UpdatedByUser != null
                            ? (x.UpdatedByUser.FirstName ?? string.Empty) + " " +
                              (x.UpdatedByUser.LastName ?? string.Empty)
                            : string.Empty)
                    },
                    ct: ct
                );

        private static readonly IReadOnlyDictionary<string, Expression<Func<TransactionPreparation, object>>>
            PreparationUnfitSortMap
                = new Dictionary<string, Expression<Func<TransactionPreparation, object>>>(StringComparer
                    .OrdinalIgnoreCase)
                {
                    ["createdDate"] = x => x.CreatedDate,
                    ["prepareDate"] = x => x.PrepareDate,
                    ["prepareId"] = x => x.PrepareId
                };


        private IQueryable<TransactionPreparation> Query()
            => _dbSet
                .Include(x => x.TransactionContainerPrepare)
                .Include(x => x.MasterInstitution)
                .Include(x => x.MasterCashCenter)
                .Include(x => x.MasterCashCenter)
                .Include(x => x.MasterCashPoint)
                .Include(x => x.MasterDenomination)
                .Include(x => x.MasterStatus)
                .Include(x => x.TransactionContainerPrepare.MasterBanknoteType)
                .AsNoTracking();

        private static IQueryable<TransactionPreparation> GetPreparationUnfitFilter(
            IQueryable<TransactionPreparation> q,
            PreparationUnfitRequest? f)
        {
            if (f is null) return q;

            q = q.Where(x =>
                x.TransactionContainerPrepare != null &&
                x.TransactionContainerPrepare.DepartmentId == f.DepartmentId &&
                x.IsReconcile == f.IsReconcile &&
                x.IsActive == f.IsActive &&
                x.StatusId == f.StatusId &&
                x.TransactionContainerPrepare.BntypeId == f.BnTypeId
            );

            if (f.MachineId.HasValue)
            {
                var machineId = f.MachineId.Value;
                q = q.Where(x =>
                    x.TransactionContainerPrepare != null &&
                    x.TransactionContainerPrepare.MachineId == machineId
                );
            }

            return q;
        }

        public Task<PagedData<PreparationUnsortCaNonMemberResponse>> GetPreparationUnsortCaNonMemberAsync(
            PagedRequest<PreparationUnsortCaNonMemberRequest> request,
            CancellationToken ct = default)
            => Query()
                .ToPagedDataAsync(
                    request: request,
                    applyFilter: GetPreparationUnsortCaNonMemberFilter,
                    applySearch: null,
                    sortMap: PreparationUnfitSortMap,
                    selector: x => new PreparationUnsortCaNonMemberResponse
                    {
                        PrepareId = x.PrepareId,
                        HeaderCardCode = x.HeaderCardCode,
                        BankCode = x.MasterInstitution.BankCode,
                        CashCenterName = x.MasterCashCenter.CashCenterName,
                        ContainerCode = x.TransactionContainerPrepare.ContainerCode,
                        PrepareDate = x.PrepareDate,
                        DenominationPrice = x.MasterDenomination.DenominationPrice,
                        CreatedBy = x.CreatedBy,
                        CreatedDate = x.CreatedDate,
                        UpdatedBy = x.UpdatedBy,
                        UpdatedDate = x.UpdatedDate,
                        CreatedByName = (x.CreatedByUser != null
                            ? (x.CreatedByUser.FirstName ?? string.Empty) + " " +
                              (x.CreatedByUser.LastName ?? string.Empty)
                            : string.Empty),
                        UpdatedByName = (x.UpdatedByUser != null
                            ? (x.UpdatedByUser.FirstName ?? string.Empty) + " " +
                              (x.UpdatedByUser.LastName ?? string.Empty)
                            : string.Empty),
                        ZoneId = (x.MasterZone != null ? x.MasterZone.ZoneId : null),
                        ZoneName = (x.MasterZone != null ? (x.MasterZone.ZoneName ?? "") : string.Empty),
                    },
                    ct: ct
                );

        public async Task<bool> ExistsPackageCodeAsync(string packageCode)
        {
            return await _db.TransactionPreparation
                .AnyAsync(x => x.PackageCode == packageCode && x.IsActive == true);
        }

        public async Task<string?> GetLatestPackageCodeByPrefixAsync(string prefix)
        {
            return await _db.TransactionPreparation
                .Where(x =>
                    x.PackageCode != null &&
                    x.PackageCode.StartsWith(prefix) &&
                    x.IsActive == true
                )
                .OrderByDescending(x => x.PrepareId) // ล่าสุดก่อน
                .Select(x => x.PackageCode)
                .FirstOrDefaultAsync();
        }

        private static IQueryable<TransactionPreparation> GetPreparationUnsortCaNonMemberFilter(
            IQueryable<TransactionPreparation> q,
            PreparationUnsortCaNonMemberRequest? f)
        {
            if (f is null) return q;

            q = q.Where(x =>
                x.TransactionContainerPrepare != null &&
                x.TransactionContainerPrepare.DepartmentId == f.DepartmentId &&
                x.TransactionContainerPrepare.BntypeId == f.BnTypeId &&
                x.IsReconcile == f.IsReconcile &&
                x.IsActive == f.IsActive &&
                x.StatusId == f.StatusId
            );

            if (f.MachineId.HasValue)
            {
                var machineId = f.MachineId.Value;
                q = q.Where(x =>
                    x.TransactionContainerPrepare != null &&
                    x.TransactionContainerPrepare.MachineId == machineId
                );
            }

            return q;
        }

        public Task<PagedData<PreparationUnsortCaMemberResponse>> GetPreparationUnsortCaMemberAsync(
            PagedRequest<PreparationUnsortCaMemberRequest> request,
            CancellationToken ct = default)
            => Query()
                .ToPagedDataAsync(
                    request: request,
                    applyFilter: GetPreparationUnsortCaMemberFilter,
                    applySearch: null,
                    sortMap: PreparationUnfitSortMap,
                    selector: x => new PreparationUnsortCaMemberResponse
                    {
                        PrepareId = x.PrepareId,
                        HeaderCardCode = x.HeaderCardCode,
                        BankCode = x.MasterInstitution.BankCode,
                        CashCenterName = x.MasterCashCenter.CashCenterName,
                        ContainerCode = x.TransactionContainerPrepare.ContainerCode,
                        PrepareDate = x.PrepareDate,
                        DenominationPrice = x.MasterDenomination.DenominationPrice,
                        CashPointName = x.MasterCashPoint.CashpointName,
                        CreatedBy = x.CreatedBy,
                        CreatedDate = x.CreatedDate,
                        UpdatedBy = x.UpdatedBy,
                        UpdatedDate = x.UpdatedDate,
                        MachineId = x.TransactionContainerPrepare.MachineId,
                        CreatedByName = (x.CreatedByUser != null
                            ? (x.CreatedByUser.FirstName ?? string.Empty) + " " +
                              (x.CreatedByUser.LastName ?? string.Empty)
                            : string.Empty),
                        UpdatedByName = (x.UpdatedByUser != null
                            ? (x.UpdatedByUser.FirstName ?? string.Empty) + " " +
                              (x.UpdatedByUser.LastName ?? string.Empty)
                            : string.Empty),
                        ZoneId = (x.MasterZone != null ? x.MasterZone.ZoneId : null),
                        ZoneName = (x.MasterZone != null ? (x.MasterZone.ZoneName ?? string.Empty) : string.Empty),
                    },
                    ct: ct
                );

        private static IQueryable<TransactionPreparation> GetPreparationUnsortCaMemberFilter(
            IQueryable<TransactionPreparation> q,
            PreparationUnsortCaMemberRequest? f)
        {
            if (f is null) return q;

            q = q.Where(x =>
                x.TransactionContainerPrepare != null &&
                x.TransactionContainerPrepare.DepartmentId == f.DepartmentId &&
                x.TransactionContainerPrepare.BntypeId == f.BnTypeId &&
                x.IsReconcile == f.IsReconcile &&
                x.IsActive == f.IsActive &&
                x.StatusId == f.StatusId
            );

            if (f.MachineId.HasValue)
            {
                var machineId = f.MachineId.Value;
                q = q.Where(x =>
                    x.TransactionContainerPrepare != null &&
                    x.TransactionContainerPrepare.MachineId == machineId
                );
            }

            return q;
        }

        public async Task<TransactionPreparation?> CheckTransactionPreparationBarcodeIsDuplicateAsync(
            string containerCode,
            string barcodeWrap,
            string barcodeBundle, DateTime startDate,
            DateTime endDate)
        {
            return await _dbSet
                .Include(w => w.TransactionContainerPrepare)
                .Where(w => w.PackageCode == barcodeWrap && w.BundleCode == barcodeBundle &&
                            w.CreatedDate >= startDate && w.CreatedDate <= endDate && w.IsActive == true
                            && w.TransactionContainerPrepare.ContainerCode == containerCode)
                .FirstOrDefaultAsync();
        }


        #region PreparationUnsortCC

        private IQueryable<TransactionPreparation> UnsortCcQuery()
            => _dbSet
                .Include(x => x.TransactionUnsortCC)
                .Include(x => x.TransactionContainerPrepare)
                .Include(x => x.MasterInstitution)
                .Include(x => x.MasterCashCenter)
                .Include(x => x.MasterCashCenter)
                .Include(x => x.MasterDenomination)
                .Include(x => x.MasterStatus)
                .Include(x => x.TransactionContainerPrepare.MasterBanknoteType)
                .AsNoTracking();

        public Task<PagedData<PreparationUnsortCCResponse>> GetPreparationUnsortCCAsync(
            PagedRequest<PreparationUnsortCCRequest> request,
            CancellationToken ct = default)
            => UnsortCcQuery()
                .ToPagedDataAsync(
                    request: request,
                    applyFilter: GetPreparationUnsortCCFilter,
                    applySearch: null,
                    sortMap: PreparationUnsortCCSortMap,
                    selector: x => new PreparationUnsortCCResponse
                    {
                        PrepareId = x.PrepareId,
                        UnsortCCId = x.TransactionUnsortCCId,
                        HeaderCardCode = x.HeaderCardCode,
                        BankCode = x.MasterInstitution.BankCode,
                        CashpointName = x.MasterCashPoint.CashpointName,
                        ContainerCode = x.TransactionContainerPrepare.ContainerCode,
                        PrepareDate = x.PrepareDate,
                        DenominationPrice = x.MasterDenomination.DenominationPrice,
                        CreatedBy = x.CreatedBy,
                        CreatedDate = x.CreatedDate,
                        UpdatedBy = x.UpdatedBy,
                        UpdatedDate = x.UpdatedDate,
                        CreatedByName = (x.CreatedByUser != null
                            ? (x.CreatedByUser.FirstName ?? string.Empty) + " " +
                              (x.CreatedByUser.LastName ?? string.Empty)
                            : string.Empty),
                        UpdatedByName = (x.UpdatedByUser != null
                            ? (x.UpdatedByUser.FirstName ?? string.Empty) + " " +
                              (x.UpdatedByUser.LastName ?? string.Empty)
                            : string.Empty),
                        ZoneId = (x.MasterZone != null ? x.MasterZone.ZoneId : null),
                        ZoneName = (x.MasterZone != null ? (x.MasterZone.ZoneName ?? "") : string.Empty),
                    },
                    ct: ct
                );

        private static readonly IReadOnlyDictionary<string, Expression<Func<TransactionPreparation, object>>>
            PreparationUnsortCCSortMap
                = new Dictionary<string, Expression<Func<TransactionPreparation, object>>>(StringComparer
                    .OrdinalIgnoreCase)
                {
                    ["createdDate"] = x => x.CreatedDate,
                    ["prepareDate"] = x => x.PrepareDate,
                    ["prepareId"] = x => x.PrepareId
                };


        private static IQueryable<TransactionPreparation> GetPreparationUnsortCCFilter(
            IQueryable<TransactionPreparation> q,
            PreparationUnsortCCRequest? f)
        {
            if (f is null) return q;

            q = q.Where(x =>
                x.TransactionContainerPrepare != null &&
                x.TransactionContainerPrepare.DepartmentId == f.DepartmentId &&
                x.TransactionContainerPrepare.BntypeId == f.BnTypeId &&
                x.IsReconcile == f.IsReconcile &&
                x.IsActive == f.IsActive &&
                x.StatusId == f.StatusId
            );

            if (f.MachineId.HasValue)
            {
                var machineId = f.MachineId.Value;
                q = q.Where(x =>
                    x.TransactionContainerPrepare != null &&
                    x.TransactionContainerPrepare.MachineId == machineId
                );
            }

            return q;
        }

        #endregion PreparationUnsortCC

        public async Task<ICollection<TransactionPreparation>> GetAllTransactionPreparationWithPrepareIdAsync(
            long[] prepareId, int departmentId, string bssBnTypeCode)
        {
            IQueryable<TransactionPreparation> query = _db.TransactionPreparation
                .Include(i => i.TransactionContainerPrepare)
                .Include(iv => iv.CreatedByUser)
                .Where(x => prepareId.Contains(x.PrepareId) &&
                            x.TransactionContainerPrepare.DepartmentId == departmentId &&
                            x.IsActive == true)
                .AsNoTracking()
                .AsQueryable();

            switch (bssBnTypeCode)
            {
                case BssBNTypeCodeConstants.Unfit:

                    return await query
                        .Include(ii => ii.MasterInstitution)
                        .Include(iii => iii.MasterCashCenter)
                        .Where(x => prepareId.Contains(x.PrepareId) &&
                                    x.TransactionContainerPrepare.DepartmentId == departmentId &&
                                    x.IsActive == true)
                        .Select(s => new TransactionPreparation
                        {
                            PrepareId = s.PrepareId,
                            ContainerPrepareId = s.ContainerPrepareId,
                            PackageCode = s.PackageCode,
                            BundleCode = s.BundleCode,
                            HeaderCardCode = s.HeaderCardCode,
                            InstId = s.InstId,
                            MasterInstitution = s.MasterInstitution != null
                                ? new MasterInstitution
                                {
                                    InstitutionId = s.MasterInstitution.InstitutionId,
                                    InstitutionCode = s.MasterInstitution.InstitutionCode,
                                    BankCode = s.MasterInstitution.BankCode,
                                    InstitutionNameTh = s.MasterInstitution.InstitutionNameTh,
                                    InstitutionNameEn = s.MasterInstitution.InstitutionNameEn,
                                    InstitutionShortName = s.MasterInstitution.InstitutionShortName,
                                }
                                : null,
                            CashcenterId = s.CashcenterId,
                            MasterCashCenter = s.MasterCashCenter != null
                                ? new MasterCashCenter
                                {
                                    CashCenterId = s.MasterCashCenter.CashCenterId,
                                    CashCenterName = s.MasterCashCenter.CashCenterName,
                                    CashCenterCode = s.MasterCashCenter.CashCenterCode,
                                }
                                : null,
                            DenoId = s.DenoId,
                            MasterDenomination = s.MasterDenomination != null
                                ? new MasterDenomination
                                {
                                    DenominationId = s.MasterDenomination.DenominationId,
                                    DenominationCode = s.MasterDenomination.DenominationCode,
                                    DenominationPrice = s.MasterDenomination.DenominationPrice,
                                }
                                : null,
                            Qty = s.Qty,
                            PrepareDate = s.PrepareDate,
                            CreatedBy = s.CreatedBy,
                            CreatedDate = s.CreatedDate,
                            CreatedByUser = s.CreatedByUser != null
                                ? new MasterUser
                                {
                                    FirstName = s.CreatedByUser.FirstName ?? string.Empty,
                                    LastName = s.CreatedByUser.LastName ?? string.Empty,
                                }
                                : null,
                            TransactionContainerPrepare = s.TransactionContainerPrepare != null
                                ? new TransactionContainerPrepare
                                {
                                    ContainerPrepareId = s.TransactionContainerPrepare.ContainerPrepareId,
                                    ContainerCode = s.TransactionContainerPrepare.ContainerCode,
                                }
                                : null
                        })
                        .ToListAsync();

                    break;
                case BssBNTypeCodeConstants.UnsortCAMember:

                    return await query
                        .Include(ii => ii.MasterInstitution)
                        .Include(iii => iii.MasterCashCenter)
                        .Where(x => prepareId.Contains(x.PrepareId) &&
                                    x.TransactionContainerPrepare.DepartmentId == departmentId &&
                                    x.IsActive == true)
                        .Select(s => new TransactionPreparation
                        {
                            PrepareId = s.PrepareId,
                            ContainerPrepareId = s.ContainerPrepareId,
                            PackageCode = s.PackageCode,
                            BundleCode = s.BundleCode,
                            HeaderCardCode = s.HeaderCardCode,
                            InstId = s.InstId,
                            MasterInstitution = s.MasterInstitution != null
                                ? new MasterInstitution
                                {
                                    InstitutionId = s.MasterInstitution.InstitutionId,
                                    InstitutionCode = s.MasterInstitution.InstitutionCode,
                                    BankCode = s.MasterInstitution.BankCode,
                                    InstitutionNameTh = s.MasterInstitution.InstitutionNameTh,
                                    InstitutionNameEn = s.MasterInstitution.InstitutionNameEn,
                                    InstitutionShortName = s.MasterInstitution.InstitutionShortName,
                                }
                                : null,
                            DenoId = s.DenoId,
                            MasterDenomination = s.MasterDenomination != null
                                ? new MasterDenomination
                                {
                                    DenominationId = s.MasterDenomination.DenominationId,
                                    DenominationCode = s.MasterDenomination.DenominationCode,
                                    DenominationPrice = s.MasterDenomination.DenominationPrice,
                                }
                                : null,
                            ZoneId = s.ZoneId,
                            MasterZone = s.MasterZone != null
                                ? new MasterZone
                                {
                                    ZoneId = s.MasterZone.ZoneId,
                                    ZoneName = s.MasterZone.ZoneName,
                                    ZoneCode = s.MasterZone.ZoneCode,
                                }
                                : null,
                            CashpointId = s.CashpointId,
                            MasterCashPoint = s.MasterCashPoint != null
                                ? new MasterCashPoint
                                {
                                    CashpointId = s.MasterCashPoint.CashpointId,
                                    CashpointName = s.MasterCashPoint.CashpointName,
                                }
                                : null,
                            Qty = s.Qty,
                            PrepareDate = s.PrepareDate,
                            CreatedBy = s.CreatedBy,
                            CreatedDate = s.CreatedDate,
                            CreatedByUser = s.CreatedByUser != null
                                ? new MasterUser
                                {
                                    FirstName = s.CreatedByUser.FirstName ?? string.Empty,
                                    LastName = s.CreatedByUser.LastName ?? string.Empty,
                                }
                                : null,
                            TransactionContainerPrepare = s.TransactionContainerPrepare != null
                                ? new TransactionContainerPrepare
                                {
                                    ContainerPrepareId = s.TransactionContainerPrepare.ContainerPrepareId,
                                    ContainerCode = s.TransactionContainerPrepare.ContainerCode,
                                }
                                : null
                        })
                        .ToListAsync();

                    break;
                case BssBNTypeCodeConstants.UnsortCANonMember:

                    return await query
                        .Include(ii => ii.MasterInstitution)
                        .Include(iii => iii.MasterCashCenter)
                        .Where(x => prepareId.Contains(x.PrepareId) &&
                                    x.TransactionContainerPrepare.DepartmentId == departmentId &&
                                    x.IsActive == true)
                        .Select(s => new TransactionPreparation
                        {
                            PrepareId = s.PrepareId,
                            ContainerPrepareId = s.ContainerPrepareId,
                            PackageCode = s.PackageCode,
                            BundleCode = s.BundleCode,
                            HeaderCardCode = s.HeaderCardCode,
                            InstId = s.InstId,
                            MasterInstitution = s.MasterInstitution != null
                                ? new MasterInstitution
                                {
                                    InstitutionId = s.MasterInstitution.InstitutionId,
                                    InstitutionCode = s.MasterInstitution.InstitutionCode,
                                    BankCode = s.MasterInstitution.BankCode,
                                    InstitutionNameTh = s.MasterInstitution.InstitutionNameTh,
                                    InstitutionNameEn = s.MasterInstitution.InstitutionNameEn,
                                    InstitutionShortName = s.MasterInstitution.InstitutionShortName,
                                }
                                : null,
                            CashcenterId = s.CashcenterId,
                            MasterCashCenter = s.MasterCashCenter != null
                                ? new MasterCashCenter
                                {
                                    CashCenterId = s.MasterCashCenter.CashCenterId,
                                    CashCenterName = s.MasterCashCenter.CashCenterName,
                                    CashCenterCode = s.MasterCashCenter.CashCenterCode,
                                }
                                : null,
                            DenoId = s.DenoId,
                            MasterDenomination = s.MasterDenomination != null
                                ? new MasterDenomination
                                {
                                    DenominationId = s.MasterDenomination.DenominationId,
                                    DenominationCode = s.MasterDenomination.DenominationCode,
                                    DenominationPrice = s.MasterDenomination.DenominationPrice,
                                }
                                : null,
                            Qty = s.Qty,
                            PrepareDate = s.PrepareDate,
                            CreatedBy = s.CreatedBy,
                            CreatedDate = s.CreatedDate,
                            CreatedByUser = s.CreatedByUser != null
                                ? new MasterUser
                                {
                                    FirstName = s.CreatedByUser.FirstName ?? string.Empty,
                                    LastName = s.CreatedByUser.LastName ?? string.Empty,
                                }
                                : null,
                            TransactionContainerPrepare = s.TransactionContainerPrepare != null
                                ? new TransactionContainerPrepare
                                {
                                    ContainerPrepareId = s.TransactionContainerPrepare.ContainerPrepareId,
                                    ContainerCode = s.TransactionContainerPrepare.ContainerCode,
                                }
                                : null
                        })
                        .ToListAsync();

                    break;
                case BssBNTypeCodeConstants.UnsortCC:

                    return await query
                        .Include(ii => ii.MasterInstitution)
                        .Include(iii => iii.MasterCashCenter)
                        .Where(x => prepareId.Contains(x.PrepareId) &&
                                    x.TransactionContainerPrepare.DepartmentId == departmentId &&
                                    x.IsActive == true)
                        .Select(s => new TransactionPreparation
                        {
                            PrepareId = s.PrepareId,
                            ContainerPrepareId = s.ContainerPrepareId,
                            PackageCode = s.PackageCode,
                            BundleCode = s.BundleCode,
                            HeaderCardCode = s.HeaderCardCode,
                            InstId = s.InstId,
                            MasterInstitution = s.MasterInstitution != null
                                ? new MasterInstitution
                                {
                                    InstitutionId = s.MasterInstitution.InstitutionId,
                                    InstitutionCode = s.MasterInstitution.InstitutionCode,
                                    BankCode = s.MasterInstitution.BankCode,
                                    InstitutionNameTh = s.MasterInstitution.InstitutionNameTh,
                                    InstitutionNameEn = s.MasterInstitution.InstitutionNameEn,
                                    InstitutionShortName = s.MasterInstitution.InstitutionShortName,
                                }
                                : null,
                            DenoId = s.DenoId,
                            MasterDenomination = s.MasterDenomination != null
                                ? new MasterDenomination
                                {
                                    DenominationId = s.MasterDenomination.DenominationId,
                                    DenominationCode = s.MasterDenomination.DenominationCode,
                                    DenominationPrice = s.MasterDenomination.DenominationPrice,
                                }
                                : null,
                            ZoneId = s.ZoneId,
                            MasterZone = s.MasterZone != null
                                ? new MasterZone
                                {
                                    ZoneId = s.MasterZone.ZoneId,
                                    ZoneName = s.MasterZone.ZoneName,
                                    ZoneCode = s.MasterZone.ZoneCode,
                                }
                                : null,
                            CashpointId = s.CashpointId,
                            MasterCashPoint = s.MasterCashPoint != null
                                ? new MasterCashPoint
                                {
                                    CashpointId = s.MasterCashPoint.CashpointId,
                                    CashpointName = s.MasterCashPoint.CashpointName,
                                }
                                : null,
                            Qty = s.Qty,
                            PrepareDate = s.PrepareDate,
                            CreatedBy = s.CreatedBy,
                            CreatedDate = s.CreatedDate,
                            CreatedByUser = s.CreatedByUser != null
                                ? new MasterUser
                                {
                                    FirstName = s.CreatedByUser.FirstName ?? string.Empty,
                                    LastName = s.CreatedByUser.LastName ?? string.Empty,
                                }
                                : null,
                            TransactionContainerPrepare = s.TransactionContainerPrepare != null
                                ? new TransactionContainerPrepare
                                {
                                    ContainerPrepareId = s.TransactionContainerPrepare.ContainerPrepareId,
                                    ContainerCode = s.TransactionContainerPrepare.ContainerCode,
                                }
                                : null
                        })
                        .ToListAsync();

                    break;
                default:
                    break;
            }

            return new List<TransactionPreparation>();
        }

        public async Task<TransactionPreparation?> CheckLatestBundleBarcodeAsync(long ReceiveId)
        {
            return await _db.TransactionPreparation
                .AsNoTracking()
                .Include(x => x.TransactionContainerPrepare)
                .Where(x => x.TransactionContainerPrepare.ReceiveId == ReceiveId
                         && x.IsActive != false
                         && x.BundleCode.Substring(8, 3) == "999")
                .OrderByDescending(x => x.PrepareId)
                .FirstOrDefaultAsync();
        }
    }
}