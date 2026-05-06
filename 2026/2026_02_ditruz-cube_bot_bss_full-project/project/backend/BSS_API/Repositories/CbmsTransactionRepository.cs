using BSS_API.Models;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace BSS_API.Repositories
{
    public class CbmsTransactionRepository : GenericRepository<ReceiveCbmsDataTransaction>, ICbmsTransactionRepository
    {
        private readonly ApplicationDbContext _db;

        public CbmsTransactionRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
            _dbSet = db.Set<ReceiveCbmsDataTransaction>();
        }

        public async Task<IEnumerable<TransactionReceiveCbmsViewData>> GetAllReceiveCbmsDataAsync(int department)
        {
            try
            {
                var data = await _db.ReceiveCbmsDataTransactions
                    .Include(d => d.MasterDepartment)
                    .Include(m => m.MasterInstitution)
                    .Include(b => b.MasterDenomination)
                    .AsNoTracking()
                    .Where(x => x.DepartmentId == department)
                    .Select(x => new TransactionReceiveCbmsViewData
                    {
                        ReceiveId = x.ReceiveId,
                        DepartmentId = x.DepartmentId,
                        DepartmentName = x.MasterDepartment.DepartmentName,
                        BnTypeInput = x.BnTypeInput,
                        BarCode = x.BarCode,
                        ContainerId = x.ContainerId,
                        SendDate = x.SendDate,
                        InstitutionId = x.InstitutionId,
                        InstitutionShortName = x.MasterInstitution.InstitutionShortName,
                        DenominationId = x.DenominationId,
                        DenominationPrice = x.MasterDenomination.DenominationPrice,
                        Qty = x.Qty,
                        RemainingQty = x.RemainingQty,
                        UnfitQty = x.UnfitQty,
                        CbBdcCode = x.CbBdcCode
                    })
                    .ToListAsync();

                return data;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ReceiveCbmsDataTransaction?> GetReceiveCbmsDataByIdAsync(long receiveId)
        {
            var data = await _db.ReceiveCbmsDataTransactions
                .Include(d => d.MasterDepartment)
                .Include(m => m.MasterInstitution)
                .Include(b => b.MasterDenomination)
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.ReceiveId == receiveId);

            return data;
        }

        public async Task<IEnumerable<TransactionReceiveCbmsViewData>> CheckReceiveCbmsTransactionAsync(
            CheckReceiveCbmsTransactionRequest request)
        {
            var queryData = await _db.ReceiveCbmsDataTransactions
                .Include(d => d.MasterDepartment)
                .Include(m => m.MasterInstitution)
                .Include(b => b.MasterDenomination)
                .AsNoTracking()
                .Where(x => x.DepartmentId == request.DepartmentId &&
                            x.ContainerId == request.ContainerId.Trim() &&
                            x.BnTypeInput == request.BnTypeInput.Trim() &&
                            x.BarCode == request.WrapBarcode.Trim() &&
                            x.SendDate >= request.DateTimeStart &&
                            x.SendDate <= request.DateTimeEnd)
                .OrderByDescending(x => x.SendDate)
                .Select(x => new TransactionReceiveCbmsViewData
                {
                    ReceiveId = x.ReceiveId,
                    DepartmentId = x.DepartmentId,
                    DepartmentName = x.MasterDepartment.DepartmentName,
                    BnTypeInput = x.BnTypeInput,
                    BarCode = x.BarCode,
                    ContainerId = x.ContainerId,
                    SendDate = x.SendDate,
                    InstitutionId = x.InstitutionId,
                    InstitutionShortName = x.MasterInstitution.InstitutionShortName,
                    DenominationId = x.DenominationId,
                    DenominationPrice = x.MasterDenomination.DenominationPrice,
                    Qty = x.Qty,
                    RemainingQty = x.RemainingQty,
                    UnfitQty = x.UnfitQty,
                    CbBdcCode = x.CbBdcCode,
                    BankCode = x.MasterInstitution.BankCode,
                    CashCenterCode = string.Empty,
                    CashCenterName = string.Empty
                })
                .ToListAsync();

            if (queryData.Any())
            {
                foreach (var item in queryData)
                {
                    var cashCenterData = await _db.MasterCashCenters
                        .AsNoTracking()
                        .Where(x => x.InstitutionId == item.InstitutionId && x.DepartmentId == item.DepartmentId)
                        .FirstOrDefaultAsync();

                    if (cashCenterData != null)
                    {
                        item.CashCenterCode = cashCenterData.CashCenterCode;
                        item.CashCenterName = cashCenterData.CashCenterName;
                    }
                }
            }

            return queryData;
        }

        public async Task ReceiveCbmsIncreaseRemainingQtyAsync(UpdateRemainingQtyRequest request)
        {
            if (request == null)
            {
                return;
            }

            foreach (var itemId in request.ReceiveIds)
            {
                var rowData = await _db.ReceiveCbmsDataTransactions.Where(x => x.ReceiveId == itemId)
                    .FirstOrDefaultAsync();
                if (rowData != null)
                {
                    if (rowData.RemainingQty < 5)
                    {
                        rowData.RemainingQty = rowData.RemainingQty + 1;
                        _db.ReceiveCbmsDataTransactions.Update(rowData);
                    }
                }
            }

            await _db.SaveChangesAsync();
        }

        public async Task ReceiveCbmsReduceRemainingQtyAsync(UpdateRemainingQtyRequest request)
        {
            if (request == null)
            {
                return;
            }

            foreach (var itemId in request.ReceiveIds)
            {
                var rowData = await _db.ReceiveCbmsDataTransactions.Where(x => x.ReceiveId == itemId)
                    .FirstOrDefaultAsync();
                if (rowData != null)
                {
                    if (rowData.RemainingQty > 0)
                    {
                        rowData.RemainingQty = rowData.RemainingQty - 1;
                        _db.ReceiveCbmsDataTransactions.Update(rowData);
                    }
                }
            }

            await _db.SaveChangesAsync();
        }

        public async Task<IEnumerable<TransactionReceiveCbmsViewData>> GetReceiveCbmsDataTransactionsWithConditionAsync(
            GetReceiveCbmsTransactionWithConditionRequest request)
        {
            var data = await GetListAsyncByConditionAsNoTracking(
                x => x.DepartmentId.Equals(request.DepartmentId)
                     && x.ContainerId == request.ContainerId
                     && x.SendDate >= request.SendDateFrom
                     && x.SendDate <= request.SendDateTo
                     && x.BnTypeInput.Equals(request.BnTypeInput)
                && (
                    request.BnTypeInput != "U"
                    || (x.BarCode != null && x.BarCode.Length >= 7 && x.BarCode.Substring(6, 1) == "2")
                ),
                x => x.MasterDepartment,
                x => x.MasterInstitution,
                x => x.MasterDenomination
            );
            var result = data.Select(x => new TransactionReceiveCbmsViewData
            {
                ReceiveId = x.ReceiveId,
                DepartmentId = x.DepartmentId,
                DepartmentName = x.MasterDepartment.DepartmentName,
                BnTypeInput = x.BnTypeInput,
                BarCode = x.BarCode,
                ContainerId = x.ContainerId,
                SendDate = x.SendDate,
                InstitutionId = x.InstitutionId,
                InstitutionShortName = x.MasterInstitution.InstitutionShortName,
                DenominationId = x.DenominationId,
                DenominationPrice = x.MasterDenomination.DenominationPrice,
                Qty = x.Qty,
                RemainingQty = x.RemainingQty,
                UnfitQty = x.UnfitQty,
                CbBdcCode = x.CbBdcCode,
                BankCode = x.MasterInstitution.BankCode
            });
            return result;
        }

        public async Task<IEnumerable<TransactionReceiveCbmsViewData>> ValidateCbmsDataAsync(
            ValidateCbmsDataRequest request)
        {
            try
            {
                var containerId = (request.ContainerId ?? string.Empty).Trim();
                var bnTypeInput = (request.BnTypeInput ?? string.Empty).Trim();

                var queryData = await _db.ReceiveCbmsDataTransactions
                    .AsNoTracking()
                    .Where(x => x.DepartmentId == request.DepartmentId &&
                                x.ContainerId == containerId &&
                                x.BnTypeInput == bnTypeInput &&
                                x.SendDate >= request.SendDateFrom &&
                                x.SendDate <= request.SendDateTo)
                    .OrderByDescending(x => x.SendDate)
                    .Select(x => new TransactionReceiveCbmsViewData
                    {
                        ReceiveId = x.ReceiveId,
                        DepartmentId = x.DepartmentId,
                        DepartmentName = x.MasterDepartment.DepartmentName,
                        BnTypeInput = x.BnTypeInput,
                        BarCode = x.BarCode,
                        ContainerId = x.ContainerId,
                        SendDate = x.SendDate,
                        InstitutionId = x.InstitutionId,
                        InstitutionShortName = x.MasterInstitution.InstitutionShortName,
                        DenominationId = x.DenominationId,
                        DenominationPrice = x.MasterDenomination.DenominationPrice,
                        Qty = x.Qty,
                        RemainingQty = x.RemainingQty,
                        UnfitQty = x.UnfitQty,
                        CbBdcCode = x.CbBdcCode,
                        BankCode = x.MasterInstitution.BankCode,
                        CashCenterCode = string.Empty,
                        CashCenterName = string.Empty,
                        hasCrossMachineConflict = false,
                        CrossMachineConflictMachines = ""
                    })
                    .ToListAsync();

                if (!queryData.Any())
                    return queryData;


                var instIds = queryData.Select(x => x.InstitutionId).Distinct().ToList();

                var cashCenters = await _db.MasterCashCenters
                    .AsNoTracking()
                    .Where(x => x.DepartmentId == request.DepartmentId && instIds.Contains(x.InstitutionId))
                    .Select(x => new
                    {
                        x.InstitutionId,
                        x.CashCenterCode,
                        x.CashCenterName
                    })
                    .ToListAsync();

                var cashCenterByInst = cashCenters
                    .GroupBy(x => x.InstitutionId)
                    .ToDictionary(g => g.Key, g => g.First());

                foreach (var item in queryData)
                {
                    if (cashCenterByInst.TryGetValue(item.InstitutionId, out var cc))
                    {
                        item.CashCenterCode = cc.CashCenterCode;
                        item.CashCenterName = cc.CashCenterName;
                    }
                }

                var receiveIds = queryData
                    .Where(x => x.RemainingQty > 0)
                    .Select(x => x.ReceiveId)
                    .Distinct()
                    .ToList();

                if (receiveIds.Count > 0)
                {
                    var conflictPairs = await _db.TransactionContainerPrepares
                        .AsNoTracking()
                        .Where(x => x.ReceiveId.HasValue && receiveIds.Contains(x.ReceiveId.Value))
                        .Where(x => x.MachineId != request.MachineId)
                        .Select(x => new
                        {
                            ReceiveId = x.ReceiveId!.Value,
                            x.MachineId,
                            MachineName = x.MasterMachine != null ? x.MasterMachine.MachineName : null
                        })
                        .Distinct()
                        .ToListAsync();

                    var conflictByReceiveId = conflictPairs
                        .GroupBy(x => x.ReceiveId)
                        .ToDictionary(
                            g => g.Key,
                            g => new
                            {
                                Text = string.Join(", ",
                                    g.Select(x =>
                                            string.IsNullOrWhiteSpace(x.MachineName)
                                                ? $"Machine#{x.MachineId}"
                                                : $"{x.MachineName} ({x.MachineId})")
                                        .Distinct()
                                        .OrderBy(s => s))
                            });

                    foreach (var item in queryData)
                    {
                        if (conflictByReceiveId.TryGetValue(item.ReceiveId, out var info) && info != null)
                        {
                            item.hasCrossMachineConflict = true;
                            item.CrossMachineConflictMachines = info.Text ?? string.Empty;
                        }
                    }
                }

                return queryData;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<ReceiveCbmsDataTransaction?> ValidateCbmsIsExistingAsync(string containerCode,
            string bnTypeInput, DateTime startDateTime,
            DateTime endDateTime)
        {
            return await _db.ReceiveCbmsDataTransactions
                .Where(w => w.ContainerId == containerCode && /*w.BnTypeInput == bnTypeInput &&*/
                            w.CreatedDate >= startDateTime && w.CreatedDate <= endDateTime)
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }

        public async Task<ReceiveCbmsDataTransaction?> GetTransactionContainerPrepareForImportCbmsIdAsync(
            string containerCode, int departmentId, int institutionId,
            int denominationId, DateTime startDateTime, DateTime endDateTime, string? barcode = null)
        {
            try
            {
                IQueryable<ReceiveCbmsDataTransaction> existingCbms = _db.ReceiveCbmsDataTransactions
                    .Include(i => i.TransactionContainerPrepares)
                        .ThenInclude(ti => ti.TransactionPreparation)
                        .ThenInclude(tp => tp.TransactionReconcileTran)
                    .Where(w => w.ContainerId == containerCode &&
                                w.DepartmentId == departmentId &&
                                w.InstitutionId == institutionId &&
                                w.DenominationId == denominationId &&
                                w.SendDate >= startDateTime && w.SendDate <= endDateTime)
                    .AsNoTracking();

                if (!string.IsNullOrWhiteSpace(barcode))
                {
                    existingCbms = existingCbms.Where(w => w.BarCode == barcode);
                }

                return await existingCbms.Select(s => new ReceiveCbmsDataTransaction
                {
                    ReceiveId = s.ReceiveId,
                    DepartmentId = s.DepartmentId,
                    BnTypeInput = s.BnTypeInput,
                    BarCode = s.BarCode,
                    ContainerId = s.ContainerId,
                    SendDate = s.SendDate,
                    InstitutionId = s.InstitutionId,
                    DenominationId = s.DenominationId,
                    Qty = s.Qty,
                    UnfitQty = s.UnfitQty,
                    RemainingQty = s.RemainingQty,
                    CbBdcCode = s.CbBdcCode,
                    CreatedBy = s.CreatedBy,
                    CreatedDate = s.CreatedDate,
                    UpdatedBy = s.UpdatedBy,
                    UpdatedDate = s.UpdatedDate,
                    TransactionContainerPrepares = s.TransactionContainerPrepares
                        .Select(c => new TransactionContainerPrepare
                        {
                            ContainerPrepareId = c.ContainerPrepareId,
                            DepartmentId = c.DepartmentId,
                            MachineId = c.MachineId,
                            ContainerCode = c.ContainerCode,
                            BntypeId = c.BntypeId,
                            IsActive = c.IsActive,
                            CreatedBy = c.CreatedBy,
                            CreatedDate = c.CreatedDate,
                            UpdatedBy = c.UpdatedBy,
                            UpdatedDate = c.UpdatedDate,
                            ReceiveId = c.ReceiveId,
                            TransactionPreparation = c.TransactionPreparation.Select(p => new TransactionPreparation
                            {
                                PrepareId = p.PrepareId,
                                ContainerPrepareId = c.ContainerPrepareId,
                                HeaderCardCode = p.HeaderCardCode,
                                BundleCode = p.BundleCode,
                                InstId = p.InstId,
                                CashcenterId = p.CashcenterId,
                                ZoneId = p.ZoneId,
                                CashpointId = p.CashpointId,
                                DenoId = p.DenoId,
                                Qty = p.Qty,
                                Remark = p.Remark,
                                StatusId = p.StatusId,
                                PrepareDate = p.PrepareDate,
                                IsActive = p.IsActive,
                                CreatedBy = p.CreatedBy,
                                CreatedDate = p.CreatedDate,
                                UpdatedBy = p.UpdatedBy,
                                UpdatedDate = p.UpdatedDate,
                                IsReconcile = p.IsReconcile,
                                PackageCode = p.PackageCode,
                                TransactionUnsortCCId = p.TransactionUnsortCCId,
                                IsMatchMachine = p.IsMatchMachine,
                                TransactionReconcileTran = p.TransactionReconcileTran != null
                                    ? new TransactionReconcileTran
                                    {
                                        ReconcileTranId = p.TransactionReconcileTran.ReconcileTranId,
                                        DepartmentId = p.TransactionReconcileTran.DepartmentId,
                                        PrepareId = p.TransactionReconcileTran.PrepareId,
                                        MachineHdId = p.TransactionReconcileTran.MachineHdId,
                                        HeaderCardCode = p.TransactionReconcileTran.HeaderCardCode,
                                        HeaderParentId = p.TransactionReconcileTran.HeaderParentId,
                                        M7Qty = p.TransactionReconcileTran.M7Qty,
                                        ReconcileQty = p.TransactionReconcileTran.ReconcileQty,
                                        SupQty = p.TransactionReconcileTran.SupQty,
                                        BundleNumber = p.TransactionReconcileTran.BundleNumber,
                                        ReconcileTotalValue = p.TransactionReconcileTran.ReconcileTotalValue,
                                        StatusId = p.TransactionReconcileTran.StatusId,
                                        ApproveBy = p.TransactionReconcileTran.ApproveBy,
                                        ApproveDate = p.TransactionReconcileTran.ApproveDate,
                                        ReferenceCode = p.TransactionReconcileTran.ReferenceCode,
                                        SorterId = p.TransactionReconcileTran.SorterId,
                                        ShiftId = p.TransactionReconcileTran.ShiftId,
                                        Remark = p.TransactionReconcileTran.Remark,
                                        AlertRemark = p.TransactionReconcileTran.AlertRemark,
                                        IsDisplay = p.TransactionReconcileTran.IsDisplay,
                                        IsActive = p.TransactionReconcileTran.IsActive,
                                        IsRevoke = p.TransactionReconcileTran.IsRevoke,
                                        CreatedBy = p.TransactionReconcileTran.CreatedBy,
                                        CreatedDate = p.TransactionReconcileTran.CreatedDate,
                                        UpdatedBy = p.TransactionReconcileTran.UpdatedBy,
                                        UpdatedDate = p.TransactionReconcileTran.UpdatedDate,
                                        CountReconcile = p.TransactionReconcileTran.CountReconcile,
                                        IsWarning = p.TransactionReconcileTran.IsWarning,
                                        IsNotReconcile = p.TransactionReconcileTran.IsNotReconcile,
                                    }
                                    : null
                            }).ToList()
                        }).ToList()
                }).FirstOrDefaultAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}