namespace BSS_API.Services;

using Interface;
using BSS_API.Core.Constants;
using BSS_API.Repositories.Interface;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Models;
using Microsoft.EntityFrameworkCore;

public class ManualKeyInService(IUnitOfWork unitOfWork, ApplicationDbContext dbContext) : IManualKeyInService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly ApplicationDbContext _db = dbContext;

    public async Task<ManualKeyInHeaderCardInfoResponse?> GetHeaderCardInfoAsync(
        string headerCardCode, CancellationToken ct = default)
    {
        // Find the preparation by header card code
        var prepare = await _unitOfWork.TransactionPreparationRepos
            .GetFirstOrDefaultAsNoTrackingAsync(
                x => x.HeaderCardCode == headerCardCode && x.IsActive == true,
                x => x.MasterInstitution,
                x => x.MasterCashPoint,
                x => x.MasterDenomination,
                x => x.MasterStatus,
                x => x.TransactionContainerPrepare);

        if (prepare == null) return null;

        // Get machine info from container prepare
        var container = prepare.TransactionContainerPrepare;
        string? machineName = null;
        int machineHdId = 0;
        int shiftId = 0;
        int departmentId = 0;

        if (container != null)
        {
            departmentId = container.DepartmentId;
            machineHdId = container.MachineId ?? 0;

            var machine = await _unitOfWork.MachineRepos
                .GetFirstOrDefaultAsNoTrackingAsync(x => x.MachineId == container.MachineId);
            machineName = machine?.MachineName;
        }

        // Get user names
        string? prepareName = null;
        if (prepare.CreatedBy.HasValue)
        {
            var user = await _unitOfWork.UserRepos
                .GetFirstOrDefaultAsNoTrackingAsync(x => x.UserId == prepare.CreatedBy.Value);
            prepareName = user != null ? $"{user.FirstName} {user.LastName}" : null;
        }

        return new ManualKeyInHeaderCardInfoResponse
        {
            PrepareId = prepare.PrepareId,
            HeaderCardCode = prepare.HeaderCardCode,
            Date = prepare.CreatedDate,
            BarcodePack = prepare.PackageCode,
            BarcodeBundle = prepare.BundleCode,
            BankName = prepare.MasterInstitution?.InstitutionNameTh,
            CashpointName = prepare.MasterCashPoint?.CashpointName,
            PrepareDate = prepare.PrepareDate,
            CountDate = prepare.CreatedDate,
            PrepareName = prepareName,
            DepartmentId = departmentId,
            MachineHdId = machineHdId,
            MachineName = machineName,
            ShiftId = shiftId,
            StatusId = prepare.StatusId,
            StatusName = prepare.MasterStatus?.StatusNameTh,
        };
    }

    public async Task<ManualKeyInDenominationResponse> GetDenominationsAsync(
        long prepareId, CancellationToken ct = default)
    {
        // Find reconcile_tran by prepare_id
        var reconcileTran = await _db.Set<TransactionReconcileTran>()
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.PrepareId == prepareId && x.IsActive == true, ct);

        if (reconcileTran == null)
            return new ManualKeyInDenominationResponse();

        // Get manual_tmp rows for this reconcile_tran
        var tmpRows = await _db.TransactionManualTmp
            .AsNoTracking()
            .Where(x => x.ReconcileTranId == reconcileTran.ReconcileTranId)
            .ToListAsync(ct);

        if (!tmpRows.Any())
            return new ManualKeyInDenominationResponse();

        var items = tmpRows.Select(x => new ManualKeyInDenominationItem
        {
            Denom = x.DenoPrice,
            Type = x.BnType,
            Series = x.DenomSeries,
            BeforeQty = x.TmpQty,
            AfterQty = x.TmpQty,
            IsChanged = false
        }).ToList();

        return new ManualKeyInDenominationResponse
        {
            Items = items,
            TotalBeforeQty = items.Sum(x => x.BeforeQty),
            TotalAfterQty = items.Sum(x => x.AfterQty)
        };
    }

    public async Task<ManualKeyInSaveResponse> SaveAsync(
        ManualKeyInSaveRequest request, CancellationToken ct = default)
    {
        return await _unitOfWork.ExecuteInTransactionAsync(async () =>
        {
            // Find reconcile_tran by prepare_id + header_card_code
            var reconcileTran = await _db.Set<TransactionReconcileTran>()
                .FirstOrDefaultAsync(x =>
                    x.PrepareId == request.PrepareId
                    && x.HeaderCardCode == request.HeaderCardCode
                    && x.IsActive == true);

            if (reconcileTran == null)
            {
                return new ManualKeyInSaveResponse
                {
                    ReconcileTranId = 0,
                    IsSuccess = false,
                    Message = "ไม่พบข้อมูล Reconcile Transaction สำหรับ Header Card นี้"
                };
            }

            var now = DateTime.Now;
            var changedItems = request.Items.Where(i => i.IsChanged).ToList();

            // Update reconcile_tran fields
            reconcileTran.UpdatedBy = request.CreatedBy;
            reconcileTran.UpdatedDate = now;
            reconcileTran.StatusId = BssStatusConstants.ManualKeyIn;

            // Delete old manual_tmp rows for this reconcile_tran
            var oldTmpRows = await _db.TransactionManualTmp
                .Where(x => x.ReconcileTranId == reconcileTran.ReconcileTranId)
                .ToListAsync();
            if (oldTmpRows.Any())
            {
                _db.TransactionManualTmp.RemoveRange(oldTmpRows);
            }

            // Create new manual_tmp rows for changed items
            foreach (var item in changedItems)
            {
                var tmp = new TransactionManualTmp
                {
                    ReconcileTranId = reconcileTran.ReconcileTranId,
                    DenoPrice = item.Denom,
                    BnType = item.Type,
                    DenomSeries = item.Series,
                    TmpQty = item.AfterQty,
                    TmpValue = item.Denom * item.AfterQty,
                    TmpAction = "EDIT",
                    ManualDate = now,
                };

                // Try to find matching reconcile record for reconcile_id
                var reconcile = await _db.Set<TransactionReconcile>()
                    .AsNoTracking()
                    .FirstOrDefaultAsync(r =>
                        r.ReconcileTranId == reconcileTran.ReconcileTranId
                        && r.DenoPrice == item.Denom
                        && r.BnType == item.Type
                        && r.DenomSeries == item.Series
                        && r.IsActive == true);

                if (reconcile != null)
                {
                    tmp.ReconcileId = reconcile.ReconcileId;
                }

                _db.TransactionManualTmp.Add(tmp);

                // Create manual_history if we have a reconcile_id
                if (reconcile != null)
                {
                    var history = new TransactionManualHistory
                    {
                        ReconcileId = reconcile.ReconcileId,
                        OldDenoPrice = item.Denom,
                        NewDenoPrice = item.Denom,
                        OldBnType = item.Type,
                        NewBnType = item.Type,
                        OldDenomSeries = item.Series,
                        NewDenomSeries = item.Series,
                        OldQty = item.BeforeQty,
                        NewQty = item.AfterQty,
                        OldValue = item.Denom * item.BeforeQty,
                        NewValue = item.Denom * item.AfterQty,
                        SupAction = "EDIT",
                        OfficerId = request.CreatedBy,
                        IsManualKey = true,
                        CreatedBy = request.CreatedBy,
                        CreatedDate = now,
                    };
                    _db.TransactionManualHistory.Add(history);
                }
            }

            await _db.SaveChangesAsync();

            // Update preparation status
            var preparation = await _unitOfWork.TransactionPreparationRepos
                .GetFirstOrDefaultAsync(x => x.PrepareId == request.PrepareId);
            if (preparation != null)
            {
                preparation.StatusId = BssStatusConstants.ManualKeyIn;
                preparation.UpdatedBy = request.CreatedBy;
                preparation.UpdatedDate = now;
                _unitOfWork.TransactionPreparationRepos.Update(preparation);
                await _unitOfWork.SaveChangeAsync();
            }

            return new ManualKeyInSaveResponse
            {
                ReconcileTranId = reconcileTran.ReconcileTranId,
                IsSuccess = true,
                Message = "บันทึกข้อมูลสำเร็จ"
            };
        });
    }

    public async Task<ManualKeyInSaveResponse> SubmitForApprovalAsync(
        ManualKeyInSubmitRequest request, CancellationToken ct = default)
    {
        var entity = await _unitOfWork.TransactionReconcileTranRepos
            .GetReconcileTranByIdAsync(request.ReconcileTranId);

        if (entity == null)
        {
            return new ManualKeyInSaveResponse
            {
                ReconcileTranId = request.ReconcileTranId,
                IsSuccess = false,
                Message = "ไม่พบข้อมูล"
            };
        }

        if (entity.StatusId != BssStatusConstants.ManualKeyIn)
        {
            return new ManualKeyInSaveResponse
            {
                ReconcileTranId = request.ReconcileTranId,
                IsSuccess = false,
                Message = "สถานะไม่ถูกต้อง ไม่สามารถส่งอนุมัติได้"
            };
        }

        // OTP is validated by FE via Notification/VerifyOtp before calling this endpoint

        // Update reconcile_tran
        entity.Remark = request.Remark;
        entity.UpdatedBy = request.UpdatedBy;
        entity.UpdatedDate = DateTime.Now;

        _unitOfWork.TransactionReconcileTranRepos.Update(entity);
        await _unitOfWork.SaveChangeAsync();

        return new ManualKeyInSaveResponse
        {
            ReconcileTranId = entity.ReconcileTranId,
            IsSuccess = true,
            Message = "ส่งอนุมัติสำเร็จ"
        };
    }
}
