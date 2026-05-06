namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Core.Constants;
    using Models.Entities;
    using Models.RequestModels;
    using Models.ResponseModels;
    using Microsoft.EntityFrameworkCore;

    public class TransactionSendUnsortCCRepository(ApplicationDbContext db)
        : GenericRepository<TransactionSendUnsortCC>(db), ITransactionSendUnsortCCRepository
    {
        private readonly ApplicationDbContext _db = db;

        public async Task<bool> CheckSendUnsortCCExistWithDeliveryCodeAsync(string deliveryCode)
        {
            return await db.TransactionSendUnsortCCs
                .AsQueryable()
                .AsNoTracking()
                .Where(w => w.SendUnsortCode == deliveryCode && w.IsActive == true)
                .AnyAsync();
        }

        public async Task<List<SendUnsortCCResponse>> GetSendUnsortCCDetailsAsync(int departmentId,
            DateTime startDateTime, DateTime endDateTime, CancellationToken ct = default)
        {
            var allowStatuses = new[]
            {
                BssStatusConstants.Received,
                BssStatusConstants.Returned,
                BssStatusConstants.NotAccepted
            };

            var result = await Query()
                .Where(x =>
                        x.IsActive == true && // where IsActive = 1
                        x.DepartmentId == departmentId &&
                        allowStatuses.Contains(x.StatusId) //&&
                    // x.CreatedDate >= startDateTime && // SendDate อยู่ระหว่าง startDateTime
                    //x.CreatedDate <= endDateTime
                )
                .Include(x => x.TransactionSendUnsortData)
                .ThenInclude(x => x.TransactionRegisterUnsort.TransactionUnsortCCs)
                .ThenInclude(x => x.MasterInstitution)
                .Include(x => x.TransactionSendUnsortData)
                .ThenInclude(x => x.TransactionRegisterUnsort.TransactionUnsortCCs)
                .ThenInclude(x => x.MasterDenomination)
                .Select(x => new SendUnsortCCResponse
                {
                    SendUnsortId = x.SendUnsortId,
                    DepartmentId = x.DepartmentId,
                    SendUnsortCode = x.SendUnsortCode,
                    Remark = x.Remark,
                    RefCode = x.RefCode,
                    OldRefCode = x.OldRefCode,
                    StatusId = x.StatusId,
                    StatusName = x.MasterStatus.StatusNameTh,
                    IsActive = x.IsActive,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate,
                    SendDate = x.SendDate,
                    ReceivedDate = x.ReceivedDate,

                    ContainerData = x.TransactionSendUnsortData
                        .Where(cc =>
                            cc.IsActive == true &&
                            cc.SendUnsortId == x.SendUnsortId
                        )
                        .Select(cc => new ContainerBySendUnsortIdResponse
                        {
                            SendUnsortId = x.SendUnsortId,
                            SendUnsortCode = x.SendUnsortCode,
                            RegisterUnsortId = cc.RegisterUnsortId,
                            ContainerCode = cc.TransactionRegisterUnsort.ContainerCode,
                            BanknoteQty = cc.TransactionRegisterUnsort.TransactionUnsortCCs
                                .Where(m => m.IsActive == true)
                                .Sum(m => (int?)m.BanknoteQty) ?? 0,
                            IsActive = cc.TransactionRegisterUnsort.IsActive,
                            CreatedBy = cc.TransactionRegisterUnsort.CreatedBy,
                            CreatedDate = cc.TransactionRegisterUnsort.CreatedDate,
                            UpdatedBy = cc.TransactionRegisterUnsort.UpdatedBy,
                            UpdatedDate = cc.TransactionRegisterUnsort.UpdatedDate,

                            UnsortCCReceiveData = cc.TransactionRegisterUnsort.TransactionUnsortCCs
                                .Where(unsortCc =>
                                    unsortCc.IsActive == true && unsortCc.RegisterUnsortId == cc.RegisterUnsortId)
                                .Select(unsortCc => new UnsortCCReceiveResponse
                                {
                                    UnsortCCId = unsortCc.UnsortCCId,
                                    RegisterUnsortId = cc.RegisterUnsortId,
                                    ContainerCode = cc.TransactionRegisterUnsort.ContainerCode,
                                    InstId = unsortCc.InstId,
                                    InstNameTh = unsortCc.MasterInstitution != null
                                        ? unsortCc.MasterInstitution.InstitutionNameTh
                                        : string.Empty,
                                    InstShortNameTh = unsortCc.MasterInstitution != null
                                        ? unsortCc.MasterInstitution.InstitutionShortName
                                        : string.Empty,
                                    denoId = unsortCc.DenoId,
                                    DenoPrice = unsortCc.MasterDenomination != null
                                        ? unsortCc.MasterDenomination.DenominationPrice
                                        : 0,
                                    BanknoteQty = unsortCc.BanknoteQty,
                                    RemainingQty = unsortCc.RemainingQty,
                                    AdjustQty = unsortCc.AdjustQty ?? 0,
                                    IsActive = (bool)unsortCc.IsActive,
                                    CreatedBy = unsortCc.CreatedBy,
                                    CreatedDate = unsortCc.CreatedDate,
                                }).ToList()
                        }).ToList()
                })
                .OrderByDescending(x => x.ReceivedDate)
                .ToListAsync(ct);

            return result;
        }

        public async Task<List<ContainerBySendUnsortIdResponse>> GetContainerBySendUnsortId(string SendUnsortId,
            CancellationToken ct = default)
        {
            var allowStatuses = new[]
            {
                BssStatusConstants.Received,
                BssStatusConstants.Returned
            };

            var result = await Query()
                .Where(x =>
                    x.IsActive == true
                )
                .Select(x => new ContainerBySendUnsortIdResponse
                {
                    SendUnsortId = x.SendUnsortId,
                    SendUnsortCode = x.SendUnsortCode,

                    IsActive = x.IsActive,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate,
                })
                .OrderByDescending(x => x.SendUnsortCode)
                .ToListAsync(ct);


            return result;
        }

        public async Task<SendUnsortCCResponse> GetReceiveBySendUnsortCode(string SendUnsortCode, int departmentId,
            DateTime startDateTime, DateTime endDateTime, CancellationToken ct = default)
        {
            var allowStatuses = new[]
            {
                BssStatusConstants.Delivered
            };

            var result = await Query()
                .Where(x =>
                    x.IsActive == true &&
                    x.DepartmentId == departmentId &&
                    allowStatuses.Contains(x.StatusId) &&
                    //x.CreatedDate >= startDateTime &&
                    //x.CreatedDate <= endDateTime &&
                    x.SendUnsortCode == SendUnsortCode)
                .Select(x => new SendUnsortCCResponse
                {
                    SendUnsortId = x.SendUnsortId,
                    DepartmentId = x.DepartmentId,
                    SendUnsortCode = x.SendUnsortCode,
                    Remark = x.Remark,
                    RefCode = x.RefCode,
                    OldRefCode = x.OldRefCode,
                    StatusId = x.StatusId,
                    StatusName = x.MasterStatus.StatusNameTh,
                    IsActive = x.IsActive,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate,
                    SendDate = x.SendDate,
                    ReceivedDate = x.ReceivedDate,

                    ContainerData = x.TransactionSendUnsortData
                        .Where(cc =>
                            cc.IsActive == true &&
                            cc.SendUnsortId == x.SendUnsortId
                        )
                        .Select(cc => new ContainerBySendUnsortIdResponse
                        {
                            SendUnsortId = x.SendUnsortId,
                            SendUnsortCode = x.SendUnsortCode,
                            RegisterUnsortId = cc.RegisterUnsortId,
                            ContainerCode = cc.TransactionRegisterUnsort.ContainerCode,
                            BanknoteQty = cc.TransactionRegisterUnsort.TransactionUnsortCCs
                                .Where(m => m.IsActive == true)
                                .Sum(m => (int?)m.BanknoteQty) ?? 0,
                            IsActive = cc.TransactionRegisterUnsort.IsActive,
                            CreatedBy = cc.TransactionRegisterUnsort.CreatedBy,
                            CreatedDate = cc.TransactionRegisterUnsort.CreatedDate,
                            UpdatedBy = cc.TransactionRegisterUnsort.UpdatedBy,
                            UpdatedDate = cc.TransactionRegisterUnsort.UpdatedDate,
                        }).ToList()
                })
                .OrderByDescending(x => x.ReceivedDate).FirstOrDefaultAsync(ct);

            return result;
        }

        public async Task<TransactionSendUnsortCC?>
            GetTransactionSendUnsortCCAndIncludeDataForPrintReportBySendUnsortIdAsync(
                long sendUnsortId)
        {
            try
            {
                return await _db.TransactionSendUnsortCCs
                    .AsNoTracking()
                    .AsQueryable()
                    .Include(i => i.TransactionSendUnsortData)
                    .ThenInclude(ti => ti.TransactionRegisterUnsort.TransactionUnsortCCs)
                    .ThenInclude(ti => ti.MasterInstitution)
                    .Include(i => i.TransactionSendUnsortData)
                    .ThenInclude(ti => ti.TransactionRegisterUnsort.TransactionUnsortCCs)
                    .ThenInclude(ti => ti.MasterDenomination)
                    .Where(w => w.SendUnsortId == sendUnsortId && w.IsActive == true)
                    .Select(s => new TransactionSendUnsortCC
                    {
                        SendUnsortId = s.SendUnsortId,
                        DepartmentId = s.DepartmentId,
                        SendUnsortCode = s.SendUnsortCode,
                        RefCode = s.RefCode,
                        OldRefCode = s.OldRefCode,
                        Remark = s.Remark,
                        StatusId = s.StatusId,
                        SendDate = s.SendDate,
                        ReceivedDate = s.ReceivedDate,
                        IsActive = s.IsActive,
                        CreatedBy = s.CreatedBy,
                        CreatedDate = s.CreatedDate,
                        UpdatedBy = s.UpdatedBy,
                        UpdatedDate = s.UpdatedDate,
                        TransactionSendUnsortData = s.TransactionSendUnsortData != null
                            ? s.TransactionSendUnsortData.Where(w => w.IsActive == true)
                                .Select(dt => new TransactionSendUnsortData
                                {
                                    SendDataId = dt.SendDataId,
                                    SendUnsortId = dt.SendUnsortId,
                                    RegisterUnsortId = dt.RegisterUnsortId,
                                    IsActive = dt.IsActive,
                                    TransactionRegisterUnsort = dt.TransactionRegisterUnsort != null
                                        ? new TransactionRegisterUnsort
                                        {
                                            RegisterUnsortId = dt.TransactionRegisterUnsort.RegisterUnsortId,
                                            ContainerCode = dt.TransactionRegisterUnsort.ContainerCode,
                                            DepartmentId = dt.TransactionRegisterUnsort.DepartmentId,
                                            IsActive = dt.TransactionRegisterUnsort.IsActive,
                                            StatusId = dt.TransactionRegisterUnsort.StatusId,
                                            SupervisorReceived = dt.TransactionRegisterUnsort.SupervisorReceived,
                                            ReceivedDate = dt.TransactionRegisterUnsort.ReceivedDate,
                                            Remark = dt.TransactionRegisterUnsort.Remark,
                                            TransactionUnsortCCs = dt.TransactionRegisterUnsort.TransactionUnsortCCs
                                                .Where(w => w.IsActive == true)
                                                .Select(cc => new TransactionUnsortCC
                                                {
                                                    UnsortCCId = cc.UnsortCCId,
                                                    RegisterUnsortId = cc.RegisterUnsortId,
                                                    InstId = cc.InstId,
                                                    MasterInstitution = cc.MasterInstitution != null
                                                        ? new MasterInstitution
                                                        {
                                                            InstitutionId = cc.MasterInstitution.InstitutionId,
                                                            InstitutionCode = cc.MasterInstitution.InstitutionCode,
                                                            BankCode = cc.MasterInstitution.BankCode,
                                                            InstitutionNameTh = cc.MasterInstitution.InstitutionNameTh,
                                                            InstitutionNameEn = cc.MasterInstitution.InstitutionNameEn,
                                                            InstitutionShortName =
                                                                cc.MasterInstitution.InstitutionShortName,
                                                        }
                                                        : null,
                                                    DenoId = cc.DenoId,
                                                    MasterDenomination = cc.MasterDenomination != null
                                                        ? new MasterDenomination
                                                        {
                                                            DenominationId = cc.MasterDenomination.DenominationId,
                                                            DenominationCode = cc.MasterDenomination.DenominationCode,
                                                            DenominationPrice = cc.MasterDenomination.DenominationPrice,
                                                            DenominationCurrency =
                                                                cc.MasterDenomination.DenominationCurrency,
                                                            DenominationDesc = cc.MasterDenomination.DenominationDesc,
                                                        }
                                                        : null,
                                                    BanknoteQty = cc.BanknoteQty,
                                                    RemainingQty = cc.RemainingQty,
                                                    AdjustQty = cc.AdjustQty,
                                                    IsActive = cc.IsActive,
                                                })
                                                .ToList()
                                        }
                                        : null
                                }).ToList()
                            : null
                    })
                    .FirstOrDefaultAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<TransactionSendUnsortCC?> GetTransactionSendUnsortCCAndIncludeDataBySendUnsortIdAsync(
            long sendUnsortId)
        {
            try
            {
                return await _db.TransactionSendUnsortCCs
                    .AsNoTracking()
                    .AsQueryable()
                    .Include(i => i.TransactionSendUnsortData)
                    .ThenInclude(ti => ti.TransactionRegisterUnsort.TransactionUnsortCCs)
                    .Include(i => i.TransactionSendUnsortData)
                    .ThenInclude(ti => ti.TransactionRegisterUnsort.TransactionUnsortCCs)
                    .Where(w => w.SendUnsortId == sendUnsortId && w.IsActive == true)
                    .Select(s => new TransactionSendUnsortCC
                    {
                        SendUnsortId = s.SendUnsortId,
                        DepartmentId = s.DepartmentId,
                        SendUnsortCode = s.SendUnsortCode,
                        RefCode = s.RefCode,
                        OldRefCode = s.OldRefCode,
                        Remark = s.Remark,
                        StatusId = s.StatusId,
                        SendDate = s.SendDate,
                        ReceivedDate = s.ReceivedDate,
                        IsActive = s.IsActive,
                        CreatedBy = s.CreatedBy,
                        CreatedDate = s.CreatedDate,
                        UpdatedBy = s.UpdatedBy,
                        UpdatedDate = s.UpdatedDate,
                        TransactionSendUnsortData = s.TransactionSendUnsortData != null
                            ? s.TransactionSendUnsortData.Where(w => w.IsActive == true)
                                .Select(dt => new TransactionSendUnsortData
                                {
                                    SendDataId = dt.SendDataId,
                                    SendUnsortId = dt.SendUnsortId,
                                    RegisterUnsortId = dt.RegisterUnsortId,
                                    IsActive = dt.IsActive,
                                    TransactionRegisterUnsort = dt.TransactionRegisterUnsort != null
                                        ? new TransactionRegisterUnsort
                                        {
                                            RegisterUnsortId = dt.TransactionRegisterUnsort.RegisterUnsortId,
                                            ContainerCode = dt.TransactionRegisterUnsort.ContainerCode,
                                            DepartmentId = dt.TransactionRegisterUnsort.DepartmentId,
                                            IsActive = dt.TransactionRegisterUnsort.IsActive,
                                            StatusId = dt.TransactionRegisterUnsort.StatusId,
                                            SupervisorReceived = dt.TransactionRegisterUnsort.SupervisorReceived,
                                            ReceivedDate = dt.TransactionRegisterUnsort.ReceivedDate,
                                            Remark = dt.TransactionRegisterUnsort.Remark,
                                            TransactionUnsortCCs = dt.TransactionRegisterUnsort.TransactionUnsortCCs
                                                .Where(w => w.IsActive == true)
                                                .Select(cc => new TransactionUnsortCC
                                                {
                                                    UnsortCCId = cc.UnsortCCId,
                                                    RegisterUnsortId = cc.RegisterUnsortId,
                                                    InstId = cc.InstId,
                                                    DenoId = cc.DenoId,
                                                    BanknoteQty = cc.BanknoteQty,
                                                    RemainingQty = cc.RemainingQty,
                                                    AdjustQty = cc.AdjustQty,
                                                    IsActive = cc.IsActive,
                                                })
                                                .ToList()
                                        }
                                        : null
                                }).ToList()
                            : null
                    })
                    .FirstOrDefaultAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<TransactionSendUnsortCC?>
            GetTransactionSendUnsortCCAndIncludeDataForEditSendUnsortDeliveryAsync(
                long sendUnsortId, int departmentId)
        {
            try
            {
                return await _db.TransactionSendUnsortCCs
                    .AsNoTracking()
                    .AsQueryable()
                    .Include(i => i.TransactionSendUnsortData)
                    .ThenInclude(ti => ti.TransactionRegisterUnsort.MasterStatus)
                    .Include(i => i.TransactionSendUnsortData)
                    .ThenInclude(ti => ti.TransactionRegisterUnsort.TransactionUnsortCCs)
                    .ThenInclude(tii => tii.MasterInstitution)
                    .Include(i => i.TransactionSendUnsortData)
                    .ThenInclude(ti => ti.TransactionRegisterUnsort.TransactionUnsortCCs)
                    .ThenInclude(tii => tii.MasterDenomination)
                    .Where(w => w.SendUnsortId == sendUnsortId && w.DepartmentId == departmentId && w.IsActive == true)
                    .Select(s => new TransactionSendUnsortCC
                    {
                        SendUnsortId = s.SendUnsortId,
                        DepartmentId = s.DepartmentId,
                        SendUnsortCode = s.SendUnsortCode,
                        RefCode = s.RefCode,
                        OldRefCode = s.OldRefCode,
                        Remark = s.Remark,
                        StatusId = s.StatusId,
                        SendDate = s.SendDate,
                        ReceivedDate = s.ReceivedDate,
                        IsActive = s.IsActive,
                        CreatedBy = s.CreatedBy,
                        CreatedDate = s.CreatedDate,
                        UpdatedBy = s.UpdatedBy,
                        UpdatedDate = s.UpdatedDate,
                        TransactionSendUnsortData = s.TransactionSendUnsortData != null
                            ? s.TransactionSendUnsortData.Where(w => w.IsActive == true)
                                .Select(dt => new TransactionSendUnsortData
                                {
                                    SendDataId = dt.SendDataId,
                                    SendUnsortId = dt.SendUnsortId,
                                    RegisterUnsortId = dt.RegisterUnsortId,
                                    IsActive = dt.IsActive,
                                    TransactionRegisterUnsort = dt.TransactionRegisterUnsort != null
                                        ? new TransactionRegisterUnsort
                                        {
                                            RegisterUnsortId = dt.TransactionRegisterUnsort.RegisterUnsortId,
                                            ContainerCode = dt.TransactionRegisterUnsort.ContainerCode,
                                            DepartmentId = dt.TransactionRegisterUnsort.DepartmentId,
                                            IsActive = dt.TransactionRegisterUnsort.IsActive,
                                            StatusId = dt.TransactionRegisterUnsort.StatusId,
                                            MasterStatus = dt.TransactionRegisterUnsort.MasterStatus != null
                                                ? new MasterStatus
                                                {
                                                    StatusId = dt.TransactionRegisterUnsort.MasterStatus.StatusId,
                                                    StatusCode = dt.TransactionRegisterUnsort.MasterStatus.StatusCode,
                                                    StatusNameTh = dt.TransactionRegisterUnsort.MasterStatus
                                                        .StatusNameTh,
                                                    StatusNameEn = dt.TransactionRegisterUnsort.MasterStatus
                                                        .StatusNameEn,
                                                    IsActive = dt.TransactionRegisterUnsort.MasterStatus.IsActive,
                                                }
                                                : null,
                                            SupervisorReceived = dt.TransactionRegisterUnsort.SupervisorReceived,
                                            ReceivedDate = dt.TransactionRegisterUnsort.ReceivedDate,
                                            Remark = dt.TransactionRegisterUnsort.Remark,
                                            TransactionUnsortCCs = dt.TransactionRegisterUnsort.TransactionUnsortCCs
                                                .Where(w => w.IsActive == true)
                                                .Select(cc => new TransactionUnsortCC
                                                {
                                                    UnsortCCId = cc.UnsortCCId,
                                                    RegisterUnsortId = cc.RegisterUnsortId,
                                                    InstId = cc.InstId,
                                                    MasterInstitution = cc.MasterInstitution != null
                                                        ? new MasterInstitution
                                                        {
                                                            InstitutionId = cc.MasterInstitution.InstitutionId,
                                                            InstitutionCode = cc.MasterInstitution.InstitutionCode,
                                                            BankCode = cc.MasterInstitution.BankCode,
                                                            InstitutionNameTh = cc.MasterInstitution.InstitutionNameTh,
                                                            InstitutionNameEn = cc.MasterInstitution.InstitutionNameEn,
                                                            InstitutionShortName =
                                                                cc.MasterInstitution.InstitutionShortName,
                                                        }
                                                        : null,
                                                    DenoId = cc.DenoId,
                                                    MasterDenomination = cc.MasterDenomination != null
                                                        ? new MasterDenomination
                                                        {
                                                            DenominationId = cc.MasterDenomination.DenominationId,
                                                            DenominationCode = cc.MasterDenomination.DenominationCode,
                                                            DenominationPrice = cc.MasterDenomination.DenominationPrice,
                                                            DenominationCurrency =
                                                                cc.MasterDenomination.DenominationCurrency,
                                                            DenominationDesc = cc.MasterDenomination.DenominationDesc,
                                                        }
                                                        : null,
                                                    BanknoteQty = cc.BanknoteQty,
                                                    RemainingQty = cc.RemainingQty,
                                                    AdjustQty = cc.AdjustQty,
                                                    IsActive = cc.IsActive,
                                                })
                                                .ToList()
                                        }
                                        : null
                                }).ToList()
                            : null
                    })
                    .FirstOrDefaultAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }


        public async Task<ICollection<TransactionSendUnsortCC>?> GetSendUnsortCCForRegisterUnsortDeliverAsync(
            int departmentId, ICollection<int> statusIn,
            DateTime startDateTime, DateTime endDateTime)
        {
            try
            {
                return await _db.TransactionSendUnsortCCs
                    .AsQueryable()
                    .AsNoTracking()
                    .Include(i => i.TransactionSendUnsortData)
                    .ThenInclude(ti => ti.TransactionRegisterUnsort.MasterStatus)
                    .Include(i => i.TransactionSendUnsortData)
                    .ThenInclude(ti => ti.TransactionRegisterUnsort.TransactionUnsortCCs)
                    .ThenInclude(ti => ti.MasterInstitution)
                    .Include(i => i.TransactionSendUnsortData)
                    .ThenInclude(ti => ti.TransactionRegisterUnsort.TransactionUnsortCCs)
                    .ThenInclude(ti => ti.MasterDenomination)
                    .Where(w => w.DepartmentId == departmentId && statusIn.Contains(w.StatusId) &&
                                w.CreatedDate >= startDateTime && w.CreatedDate <= endDateTime && w.IsActive == true)
                    .Select(s => new TransactionSendUnsortCC
                    {
                        SendUnsortId = s.SendUnsortId,
                        DepartmentId = s.DepartmentId,
                        SendUnsortCode = s.SendUnsortCode,
                        Remark = s.Remark,
                        RefCode = s.RefCode,
                        OldRefCode = s.OldRefCode,
                        StatusId = s.StatusId,
                        MasterStatus = s.MasterStatus != null
                            ? new MasterStatus
                            {
                                StatusId = s.StatusId,
                                StatusCode = s.MasterStatus.StatusCode,
                                StatusNameTh = s.MasterStatus.StatusNameTh,
                                StatusNameEn = s.MasterStatus.StatusNameEn,
                                IsActive = s.MasterStatus.IsActive,
                            }
                            : null,
                        SendDate = s.SendDate,
                        ReceivedDate = s.ReceivedDate,
                        IsActive = s.IsActive,
                        CreatedBy = s.CreatedBy,
                        CreatedDate = s.CreatedDate,
                        UpdatedBy = s.UpdatedBy,
                        UpdatedDate = s.UpdatedDate,
                        TransactionSendUnsortData = s.TransactionSendUnsortData != null
                            ? s.TransactionSendUnsortData.Where(w => w.IsActive == true)
                                .Select(dt => new TransactionSendUnsortData
                                {
                                    SendDataId = dt.SendDataId,
                                    SendUnsortId = dt.SendUnsortId,
                                    RegisterUnsortId = dt.RegisterUnsortId,
                                    IsActive = dt.IsActive,
                                    TransactionRegisterUnsort = dt.TransactionRegisterUnsort != null
                                        ? new TransactionRegisterUnsort
                                        {
                                            RegisterUnsortId = dt.TransactionRegisterUnsort.RegisterUnsortId,
                                            ContainerCode = dt.TransactionRegisterUnsort.ContainerCode,
                                            DepartmentId = dt.TransactionRegisterUnsort.DepartmentId,
                                            IsActive = dt.TransactionRegisterUnsort.IsActive,
                                            StatusId = dt.TransactionRegisterUnsort.StatusId,
                                            SupervisorReceived = dt.TransactionRegisterUnsort.SupervisorReceived,
                                            ReceivedDate = dt.TransactionRegisterUnsort.ReceivedDate,
                                            Remark = dt.TransactionRegisterUnsort.Remark,
                                            TransactionUnsortCCs = dt.TransactionRegisterUnsort.TransactionUnsortCCs
                                                .Where(w => w.IsActive == true)
                                                .Select(cc => new TransactionUnsortCC
                                                {
                                                    UnsortCCId = cc.UnsortCCId,
                                                    RegisterUnsortId = cc.RegisterUnsortId,
                                                    InstId = cc.InstId,
                                                    DenoId = cc.DenoId,
                                                    MasterDenomination = cc.MasterDenomination != null
                                                        ? new MasterDenomination
                                                        {
                                                            DenominationId = cc.MasterDenomination.DenominationId,
                                                            DenominationCode = cc.MasterDenomination.DenominationCode,
                                                            DenominationPrice = cc.MasterDenomination.DenominationPrice,
                                                            DenominationCurrency =
                                                                cc.MasterDenomination.DenominationCurrency,
                                                            DenominationDesc = cc.MasterDenomination.DenominationDesc,
                                                        }
                                                        : null,
                                                    BanknoteQty = cc.BanknoteQty,
                                                    RemainingQty = cc.RemainingQty,
                                                    AdjustQty = cc.AdjustQty,
                                                    IsActive = cc.IsActive,
                                                    MasterInstitution = cc.MasterInstitution != null
                                                        ? new MasterInstitution
                                                        {
                                                            InstitutionId = cc.MasterInstitution.InstitutionId,
                                                            BankCode = cc.MasterInstitution.BankCode,
                                                            InstitutionCode = cc.MasterInstitution.InstitutionCode,
                                                            InstitutionNameTh = cc.MasterInstitution.InstitutionNameTh,
                                                            InstitutionNameEn = cc.MasterInstitution.InstitutionNameEn,
                                                            InstitutionShortName =
                                                                cc.MasterInstitution.InstitutionShortName,
                                                        }
                                                        : null
                                                })
                                                .ToList()
                                        }
                                        : null
                                }).ToList()
                            : null
                    })
                    .OrderByDescending(x => x.CreatedDate)
                    .ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> RemoveBinContainerNotPrepareData(int RegisterUnsortId, int UserId,
            CancellationToken ct = default)
        {
            var result = false;
            var rowData = await _db.TransactionSendUnsortDatas
                .Where(x => x.RegisterUnsortId == RegisterUnsortId && x.IsActive == true)
                .FirstOrDefaultAsync(ct);

            if (rowData != null)
            {
                var now = System.DateTime.Now;
                var sendUnsortId = rowData.SendUnsortId; // เก็บค่า ID แม่ไว้ตรวจสอบตอนท้าย

                // 1. ปิดสถานะในตาราง SendUnsort (Data ที่เชื่อมตู้กับรอบการส่ง)
                rowData.IsActive = false;
                rowData.UpdatedBy = UserId;
                rowData.UpdatedDate = now;
                _db.TransactionSendUnsortDatas.Update(rowData);

                // 2. ปิดสถานะในตาราง RegisterUnsort (ตัวตู้คอนเทนเนอร์เอง)
                var registerData = await _db.TransactionRegisterUnsorts
                    .Where(x => x.RegisterUnsortId == RegisterUnsortId && x.IsActive == true)
                    .FirstOrDefaultAsync(ct);

                if (registerData != null)
                {
                    registerData.StatusId = 1; // กลับเป็นสถานะว่าง/ปกติ
                    registerData.UpdatedBy = UserId;
                    registerData.UpdatedDate = now;
                    _db.TransactionRegisterUnsorts.Update(registerData);
                }

                // --- เพิ่ม Logic ตรวจสอบเพื่ออัปเดตตารางแม่ (CC) ---

                // ตรวจสอบว่าในรอบการส่งนี้ (sendUnsortId) ยังมีตู้อื่นที่ Active อยู่ไหม
                // ต้องเช็กโดยยกเว้นตู้ปัจจุบันที่กำลังจะปิด (RegisterUnsortId != RegisterUnsortId)
                var hasOtherActiveContainers = await _db.TransactionSendUnsortDatas
                    .AnyAsync(x => x.SendUnsortId == sendUnsortId
                                   && x.IsActive == true
                                   && x.RegisterUnsortId != RegisterUnsortId, ct);

                // ถ้าไม่มีตู้เหลืออยู่แล้ว ให้ไปอัปเดตตารางแม่ TransactionSendUnsortCCs
                if (!hasOtherActiveContainers)
                {
                    var masterData = await _db.TransactionSendUnsortCCs
                        .FirstOrDefaultAsync(x => x.SendUnsortId == sendUnsortId, ct);

                    if (masterData != null)
                    {
                        // อัปเดตสถานะแม่ เช่น เปลี่ยนเป็น 8 หรือตาม Business Logic
                        masterData.IsActive = false;
                        masterData.UpdatedBy = UserId;
                        masterData.UpdatedDate = now;
                        _db.TransactionSendUnsortCCs.Update(masterData);
                    }
                }
                // -------------------------------------------------

                await _db.SaveChangesAsync(ct);
                result = true;
            }

            return result;
        }

        public async Task<bool> UpdateSendUnsortStatusAsync(int SendUnsortId, int UserId, int statusId, string? note,
            CancellationToken ct = default)
        {
            // 1. ดึง Execution Strategy ออกมา
            var strategy = _db.Database.CreateExecutionStrategy();

            // 2. รันการทำงานทั้งหมดผ่าน Strategy
            return await strategy.ExecuteAsync(async () =>
            {
                // 3. สร้าง Transaction ภายในนี้
                using var transaction = await _db.Database.BeginTransactionAsync(ct);
                try
                {
                    var now = DateTime.Now;

                    // --- Logic การอัปเดตข้อมูล ---
                    // 4. อัปเดตตารางหลัก
                    var rowData = await _db.TransactionSendUnsortCCs
                        .FirstOrDefaultAsync(x => x.SendUnsortId == SendUnsortId, ct);

                    if (rowData == null)
                    {
                        return false;
                    }

                    if ((statusId == 6|| statusId == 5) && rowData.CreatedBy == UserId)
                    {
                        // ถ้าเป็นคนเดียวกัน ไม่ให้ผ่าน
                        return false;
                    }

                    rowData.StatusId = statusId;
                    rowData.UpdatedBy = UserId;
                    rowData.UpdatedDate = now;

                    if (statusId == 6)
                    {
                        rowData.ReceivedDate = now;
                    }

                    if (statusId == 5 || statusId == 31)
                    {
                        rowData.Remark = note;
                    }

                    // 5. อัปเดตตารางย่อย
                    var listData = await _db.TransactionSendUnsortDatas
                        .Where(x => x.SendUnsortId == SendUnsortId)
                        .ToListAsync(ct);

                    foreach (var item in listData)
                    {
                        var registerData = await _db.TransactionRegisterUnsorts
                            .FirstOrDefaultAsync(x => x.RegisterUnsortId == item.RegisterUnsortId && x.IsActive == true,
                                ct);

                        if (registerData != null)
                        {
                            registerData.StatusId = statusId;
                            registerData.UpdatedBy = UserId;
                            registerData.UpdatedDate = now;
                        }
                    }

                    await _db.SaveChangesAsync(ct);

                    // Commit Transaction
                    await transaction.CommitAsync(ct);
                    return true;
                }
                catch (Exception)
                {
                    // Rollback ถ้าเกิด Error
                    await transaction.RollbackAsync(ct);
                    throw; // ต้อง Throw เพื่อให้ Strategy รับรู้ว่าเกิด Error และพิจารณาการ Retry
                }
            });
        }

        public async Task<UnsortCCReceiveResponse?> UpdateRemainingQtyReceive(UpdateRemainingQtyReceiveRequest request,
            CancellationToken ct = default)
        {
            var strategy = _db.Database.CreateExecutionStrategy();

            return await strategy.ExecuteAsync(async () =>
            {
                using var transaction = await _db.Database.BeginTransactionAsync(ct);
                try
                {
                    // 1. ดึงข้อมูล Entity (ตรวจสอบว่าเอา [Required] ออกจาก Entity แล้ว)
                    var rowData = await _db.TransactionUnsortCCs
                        .Include(x => x.MasterInstitution) // Include ถ้าต้องการชื่อสถาบัน
                        .Include(x => x.MasterDenomination) // Include ถ้าต้องการราคาหน้าธนบัตร
                        .FirstOrDefaultAsync(x => x.RegisterUnsortId == request.RegisterUnsortId
                                                  && x.InstId == request.InstId
                                                  && x.DenoId == request.DenoId, ct);

                    if (rowData == null) return null;

                    // --- [CHECK] ตรวจสอบเงื่อนไข: ค่าใหม่ต้องไม่มากกว่าค่าเดิม ---
                    if (request.RemainingQty > rowData.RemainingQty)
                    {
                        // คุณอาจจะ Throw Exception หรือ Return Error Message ตามความเหมาะสมของโปรเจกต์
                        throw new Exception("ไม่สามารถอัปเดตค่าได้: จำนวนใหม่ต้องไม่มากกว่าจำนวนเดิม");
                    }
                    // ------------------------------------------------------

                    // 2. Logic การอัปเดต
                    int oldRemaining = rowData.RemainingQty;
                    int oldAdjust = rowData.AdjustQty ?? 0;
                    rowData.RemainingQty = request.RemainingQty;
                    //edit 2026/02/24 เพิ่ม Adjust เดิมเข้าไปด้วย
                    rowData.AdjustQty = oldRemaining - request.RemainingQty + oldAdjust;
                    rowData.UpdatedBy = request.CreatedBy;
                    rowData.UpdatedDate = DateTime.Now;

                    await _db.SaveChangesAsync(ct);

                    // --- เพิ่มส่วนตรวจสอบ "ทุกตัวใน RegisterUnsortId" ---

                    // ดึงรายการทั้งหมดที่มี RegisterUnsortId เดียวกันมาเช็ค
                    var allItemsInGroup = await _db.TransactionUnsortCCs
                        .Where(x => x.RegisterUnsortId == request.RegisterUnsortId && x.IsActive == true)
                        .ToListAsync(ct);

                    // ตรวจสอบว่าทุกตัว (All) มี RemainingQty == 0 หรือไม่
                    if (allItemsInGroup.All(x => x.RemainingQty == 0))
                    {
                        var now = DateTime.Now;

                        //อัปเดตตาราง bss_txn_send_unsort_data 
                        // ให้ is_active = 0
                        var sendUnsortRecords = await _db.TransactionSendUnsortDatas
                            .Where(x => x.RegisterUnsortId == request.RegisterUnsortId)
                            .ToListAsync(ct);

                        foreach (var item in sendUnsortRecords)
                        {
                            item.IsActive = false; // 0
                            item.UpdatedBy = request.CreatedBy;
                            item.UpdatedDate = now;
                        }

                        //อัปเดตตาราง bss_txn_register_unsort 
                        // ให้ status_id = 8
                        var registerUnsort = await _db.TransactionRegisterUnsorts
                            .FirstOrDefaultAsync(x => x.RegisterUnsortId == request.RegisterUnsortId, ct);

                        if (registerUnsort != null)
                        {
                            registerUnsort.StatusId = 8; // 8 = ลบภาชนะ
                            registerUnsort.UpdatedBy = request.CreatedBy;
                            registerUnsort.UpdatedDate = now;
                        }

                        // --- [เพิ่มส่วนนี้] อัปเดตตารางแม่ TransactionSendUnsortCCs ---
                        // ค้นหา SendUnsortId จากรายการข้อมูลในตู้ที่เพิ่งปิดไป
                        var sendUnsortId = sendUnsortRecords.FirstOrDefault()?.SendUnsortId;
                        if (sendUnsortId.HasValue)
                        {
                            // ตรวจสอบว่าในรอบการส่งนี้ (SendUnsortId) ยังมีตู้ (Container) อื่นที่ยัง Active อยู่ไหม
                            var remainingActiveContainers = await _db.TransactionSendUnsortDatas
                                .AnyAsync(
                                    x => x.SendUnsortId == sendUnsortId && x.IsActive == true &&
                                         x.RegisterUnsortId != request.RegisterUnsortId, ct);

                            // ถ้าไม่มีตู้ไหน Active แล้ว (ตู้สุดท้ายเพิ่งโดน IsActive = false ไปเมื่อกี้)
                            if (!remainingActiveContainers)
                            {
                                var masterSendUnsort = await _db.TransactionSendUnsortCCs
                                    .FirstOrDefaultAsync(x => x.SendUnsortId == sendUnsortId, ct);

                                if (masterSendUnsort != null)
                                {
                                    masterSendUnsort.StatusId = 8;
                                    masterSendUnsort.UpdatedBy = request.CreatedBy;
                                    masterSendUnsort.UpdatedDate = now;
                                }
                            }
                        }
                        // ---------------------------------------------------------

                        // บันทึกการเปลี่ยนแปลงของทั้ง 2 ตาราง
                        await _db.SaveChangesAsync(ct);
                    }

                    // ----------------------------------------------

                    await transaction.CommitAsync(ct);

                    // 3. Map ค่ากลับเป็น UnsortCCReceiveResponse
                    return new UnsortCCReceiveResponse
                    {
                        UnsortCCId = rowData.UnsortCCId,
                        RegisterUnsortId = rowData.RegisterUnsortId,
                        InstId = (long)rowData.InstId,
                        InstNameTh = rowData.MasterInstitution?.InstitutionNameTh ?? string.Empty,
                        InstShortNameTh = rowData.MasterInstitution?.InstitutionShortName ?? string.Empty,
                        denoId = rowData.DenoId,
                        DenoPrice = rowData.MasterDenomination?.DenominationPrice ?? 0,
                        BanknoteQty = rowData.BanknoteQty,
                        RemainingQty = rowData.RemainingQty,
                        AdjustQty = rowData.AdjustQty, // ตอนนี้เป็น int? ทั้งคู่แล้ว
                        IsActive = rowData.IsActive ?? false,
                        CreatedBy = rowData.CreatedBy,
                        CreatedDate = rowData.CreatedDate,
                        // ข้อมูลเพิ่มเติมตามที่ Response ต้องการ
                        CanEdit = true
                    };
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync(ct);
                    throw;
                }
            });
        }
    }
}