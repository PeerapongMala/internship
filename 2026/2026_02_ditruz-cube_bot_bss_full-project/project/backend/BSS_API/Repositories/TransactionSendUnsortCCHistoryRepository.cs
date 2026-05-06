using Microsoft.EntityFrameworkCore;

namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;

    public class TransactionSendUnsortCCHistoryRepository(ApplicationDbContext db)
        : GenericRepository<TransactionSendUnsortCCHistory>(db), ITransactionSendUnsortCCHistoryRepository
    {
        private readonly ApplicationDbContext _db = db;


        public async Task<TransactionSendUnsortCCHistory?> GetTransactionSendUnsortCCHistoryBySendUnsortHistoryIdAsync(
            long sendUnsortHistoryId)
        {
            try
            {
                return await db.TransactionSendUnsortCCHistorys
                    .AsQueryable()
                    .AsNoTracking()
                    .Include(i => i.TransactionSendUnsortCC.MasterStatus)
                    /*------------------------------------------------------------------------------------------------------------*/
                    .Include(i => i.TransactionSendUnsortDataHistory)
                    .ThenInclude(rc => rc.TransactionRegisterUnsort)
                    .Include(i => i.TransactionSendUnsortDataHistory)
                    .ThenInclude(ti => ti.TransactionUnsortCCHistorys)
                    .ThenInclude(tii => tii.MasterInstitution)
                    .Include(i => i.TransactionSendUnsortDataHistory)
                    .ThenInclude(rc => rc.TransactionRegisterUnsort)
                    .Include(i => i.TransactionSendUnsortDataHistory)
                    .ThenInclude(ti => ti.TransactionUnsortCCHistorys)
                    .ThenInclude(tii => tii.MasterDenomination)
                    .Where(w => w.HisUnsortId == sendUnsortHistoryId)
                    .Select(s => new TransactionSendUnsortCCHistory
                    {
                        HisUnsortId = s.HisUnsortId,
                        DepartmentId = s.DepartmentId,
                        SendUnsortId = s.SendUnsortId,
                        SendUnsortCode = s.SendUnsortCode,
                        RefCode = s.RefCode,
                        OldRefCode = s.OldRefCode,
                        CreatedBy = s.CreatedBy,
                        CreatedDate = s.CreatedDate,
                        UpdatedBy = s.UpdatedBy,
                        UpdatedDate = s.UpdatedDate,
                        TransactionSendUnsortCC = s.TransactionSendUnsortCC != null
                            ? new TransactionSendUnsortCC
                            {
                                SendUnsortId = s.TransactionSendUnsortCC.SendUnsortId,
                                DepartmentId = s.TransactionSendUnsortCC.DepartmentId,
                                SendUnsortCode = s.TransactionSendUnsortCC.SendUnsortCode,
                                Remark = s.TransactionSendUnsortCC.Remark,
                                RefCode = s.TransactionSendUnsortCC.RefCode,
                                OldRefCode = s.TransactionSendUnsortCC.OldRefCode,
                                StatusId = s.TransactionSendUnsortCC.StatusId,
                                SendDate = s.TransactionSendUnsortCC.SendDate,
                                MasterStatus = s.TransactionSendUnsortCC.MasterStatus != null
                                    ? new MasterStatus
                                    {
                                        StatusId = s.TransactionSendUnsortCC.MasterStatus.StatusId,
                                        StatusCode = s.TransactionSendUnsortCC.MasterStatus.StatusCode,
                                        StatusNameTh = s.TransactionSendUnsortCC.MasterStatus.StatusNameTh,
                                        StatusNameEn = s.TransactionSendUnsortCC.MasterStatus.StatusNameEn,
                                        IsActive = s.TransactionSendUnsortCC.MasterStatus.IsActive,
                                    }
                                    : null,
                                IsActive = s.TransactionSendUnsortCC.IsActive,
                            }
                            : null,
                        TransactionSendUnsortDataHistory = s.TransactionSendUnsortDataHistory != null
                            ? s.TransactionSendUnsortDataHistory.Select(d =>
                                new TransactionSendUnsortDataHistory
                                {
                                    HisDataId = d.HisDataId,
                                    HisUnsortId = d.HisUnsortId,
                                    RegisterUnsortId = d.RegisterUnsortId,
                                    ContainerCode = d.ContainerCode,
                                    CreatedBy = d.CreatedBy,
                                    CreatedDate = d.CreatedDate,
                                    UpdatedBy = d.UpdatedBy,
                                    UpdatedDate = d.UpdatedDate,
                                    TransactionRegisterUnsort = d.TransactionRegisterUnsort != null
                                        ? new TransactionRegisterUnsort
                                        {
                                            RegisterUnsortId = d.TransactionRegisterUnsort.RegisterUnsortId,
                                            ContainerCode = d.TransactionRegisterUnsort.ContainerCode,
                                            DepartmentId = d.TransactionRegisterUnsort.DepartmentId,
                                            IsActive = d.TransactionRegisterUnsort.IsActive,
                                            StatusId = d.TransactionRegisterUnsort.StatusId,
                                            SupervisorReceived = d.TransactionRegisterUnsort.SupervisorReceived,
                                            ReceivedDate = d.TransactionRegisterUnsort.ReceivedDate,
                                            Remark = d.TransactionRegisterUnsort.Remark,
                                            CreatedBy = d.TransactionRegisterUnsort.CreatedBy,
                                            CreatedDate = d.TransactionRegisterUnsort.CreatedDate,
                                            UpdatedBy = d.TransactionRegisterUnsort.UpdatedBy,
                                            UpdatedDate = d.TransactionRegisterUnsort.UpdatedDate,
                                        }
                                        : null,
                                    TransactionUnsortCCHistorys = d.TransactionUnsortCCHistorys != null
                                        ? d.TransactionUnsortCCHistorys.Select(ss => new TransactionUnsortCCHistory
                                        {
                                            HisCcId = ss.HisCcId,
                                            HisDataId = ss.HisDataId,
                                            InstId = ss.InstId,
                                            DenoId = ss.DenoId,
                                            MasterDenomination = ss.MasterDenomination != null
                                                ? new MasterDenomination
                                                {
                                                    DenominationId = ss.MasterDenomination.DenominationId,
                                                    DenominationCode = ss.MasterDenomination.DenominationCode,
                                                    DenominationPrice = ss.MasterDenomination.DenominationPrice,
                                                    DenominationDesc = ss.MasterDenomination.DenominationDesc,
                                                    DenominationCurrency = ss.MasterDenomination.DenominationCurrency,
                                                }
                                                : null,
                                            BanknoteQty = ss.BanknoteQty,
                                            RemainingQty = ss.RemainingQty,
                                            MasterInstitution = ss.MasterInstitution != null
                                                ? new MasterInstitution
                                                {
                                                    InstitutionId = ss.MasterInstitution.InstitutionId,
                                                    InstitutionCode = ss.MasterInstitution.InstitutionCode,
                                                    BankCode = ss.MasterInstitution.BankCode,
                                                    InstitutionNameTh = ss.MasterInstitution.InstitutionNameTh,
                                                    InstitutionNameEn = ss.MasterInstitution.InstitutionNameEn,
                                                    InstitutionShortName = ss.MasterInstitution.InstitutionShortName,
                                                    IsActive = ss.MasterInstitution.IsActive,
                                                }
                                                : null,
                                        }).ToList()
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

        public async Task<TransactionSendUnsortCCHistory?> GetLastTransactionSendUnsortCCHistoryBySendUnsortCCIdAsync(
            long sendUnsortCCId)
        {
            try
            {
                return await db.TransactionSendUnsortCCHistorys.AsQueryable().AsNoTracking()
                    .Where(x => x.SendUnsortId == sendUnsortCCId)
                    .OrderByDescending(x => x.CreatedDate).FirstOrDefaultAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<ICollection<TransactionSendUnsortCCHistory>?>
            GetSendUnsortCCHistoryForRegisterUnsortDeliverAsync(int departmentId, ICollection<int> statusIn,
                DateTime startDateTime,
                DateTime endDateTime)
        {
            try
            {
                return await db.TransactionSendUnsortCCHistorys
                    .AsQueryable()
                    .AsNoTracking()
                    .Include(i => i.TransactionSendUnsortCC.MasterStatus)
                    /*------------------------------------------------------------------------------------------------------------*/
                    .Include(i => i.TransactionSendUnsortDataHistory)
                    .ThenInclude(rc => rc.TransactionRegisterUnsort)
                    .Include(i => i.TransactionSendUnsortDataHistory)
                    .ThenInclude(ti => ti.TransactionUnsortCCHistorys)
                    .ThenInclude(tii => tii.MasterInstitution)
                    .Where(w => w.DepartmentId == departmentId && w.CreatedDate >= startDateTime &&
                                w.CreatedDate <= endDateTime)
                    .Select(s => new TransactionSendUnsortCCHistory
                    {
                        HisUnsortId = s.HisUnsortId,
                        DepartmentId = s.DepartmentId,
                        SendUnsortId = s.SendUnsortId,
                        SendUnsortCode = s.SendUnsortCode,
                        RefCode = s.RefCode,
                        OldRefCode = s.OldRefCode,
                        CreatedBy = s.CreatedBy,
                        CreatedDate = s.CreatedDate,
                        UpdatedBy = s.UpdatedBy,
                        UpdatedDate = s.UpdatedDate,
                        TransactionSendUnsortCC = s.TransactionSendUnsortCC != null
                            ? new TransactionSendUnsortCC
                            {
                                SendUnsortId = s.TransactionSendUnsortCC.SendUnsortId,
                                DepartmentId = s.TransactionSendUnsortCC.DepartmentId,
                                SendUnsortCode = s.TransactionSendUnsortCC.SendUnsortCode,
                                Remark = s.TransactionSendUnsortCC.Remark,
                                RefCode = s.TransactionSendUnsortCC.RefCode,
                                OldRefCode = s.TransactionSendUnsortCC.OldRefCode,
                                StatusId = s.TransactionSendUnsortCC.StatusId,
                                SendDate = s.TransactionSendUnsortCC.SendDate,
                                MasterStatus = s.TransactionSendUnsortCC.MasterStatus != null
                                    ? new MasterStatus
                                    {
                                        StatusId = s.TransactionSendUnsortCC.MasterStatus.StatusId,
                                        StatusCode = s.TransactionSendUnsortCC.MasterStatus.StatusCode,
                                        StatusNameTh = s.TransactionSendUnsortCC.MasterStatus.StatusNameTh,
                                        StatusNameEn = s.TransactionSendUnsortCC.MasterStatus.StatusNameEn,
                                        IsActive = s.TransactionSendUnsortCC.MasterStatus.IsActive,
                                    }
                                    : null,
                                IsActive = s.TransactionSendUnsortCC.IsActive,
                            }
                            : null,
                        TransactionSendUnsortDataHistory = s.TransactionSendUnsortDataHistory != null
                            ? s.TransactionSendUnsortDataHistory.Select(d =>
                                new TransactionSendUnsortDataHistory
                                {
                                    HisDataId = d.HisDataId,
                                    HisUnsortId = d.HisUnsortId,
                                    RegisterUnsortId = d.RegisterUnsortId,
                                    ContainerCode = d.ContainerCode,
                                    CreatedBy = d.CreatedBy,
                                    CreatedDate = d.CreatedDate,
                                    UpdatedBy = d.UpdatedBy,
                                    UpdatedDate = d.UpdatedDate,
                                    TransactionRegisterUnsort = d.TransactionRegisterUnsort != null
                                        ? new TransactionRegisterUnsort
                                        {
                                            RegisterUnsortId = d.TransactionRegisterUnsort.RegisterUnsortId,
                                            ContainerCode = d.TransactionRegisterUnsort.ContainerCode,
                                            DepartmentId = d.TransactionRegisterUnsort.DepartmentId,
                                            IsActive = d.TransactionRegisterUnsort.IsActive,
                                            StatusId = d.TransactionRegisterUnsort.StatusId,
                                            SupervisorReceived = d.TransactionRegisterUnsort.SupervisorReceived,
                                            ReceivedDate = d.TransactionRegisterUnsort.ReceivedDate,
                                            Remark = d.TransactionRegisterUnsort.Remark,
                                            CreatedBy = d.TransactionRegisterUnsort.CreatedBy,
                                            CreatedDate = d.TransactionRegisterUnsort.CreatedDate,
                                            UpdatedBy = d.TransactionRegisterUnsort.UpdatedBy,
                                            UpdatedDate = d.TransactionRegisterUnsort.UpdatedDate,
                                        }
                                        : null,
                                    TransactionUnsortCCHistorys = d.TransactionUnsortCCHistorys != null
                                        ? d.TransactionUnsortCCHistorys.Select(ss => new TransactionUnsortCCHistory
                                        {
                                            HisCcId = ss.HisCcId,
                                            HisDataId = ss.HisDataId,
                                            InstId = ss.InstId,
                                            DenoId = ss.DenoId,
                                            BanknoteQty = ss.BanknoteQty,
                                            RemainingQty = ss.RemainingQty,
                                            MasterInstitution = ss.MasterInstitution != null
                                                ? new MasterInstitution
                                                {
                                                    InstitutionId = ss.MasterInstitution.InstitutionId,
                                                    InstitutionCode = ss.MasterInstitution.InstitutionCode,
                                                    BankCode = ss.MasterInstitution.BankCode,
                                                    InstitutionNameTh = ss.MasterInstitution.InstitutionNameTh,
                                                    InstitutionNameEn = ss.MasterInstitution.InstitutionNameEn,
                                                    InstitutionShortName = ss.MasterInstitution.InstitutionShortName,
                                                    IsActive = ss.MasterInstitution.IsActive,
                                                }
                                                : null,
                                        }).ToList()
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
    }
}