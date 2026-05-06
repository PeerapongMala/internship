using BSS_API.Core.Constants;
using BSS_API.Models;
using BSS_API.Models.Entities;
using BSS_API.Models.ResponseModels;
using BSS_API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace BSS_API.Repositories
{
    public class TransactionRegisterUnsortRepository(ApplicationDbContext db)
        : GenericRepository<TransactionRegisterUnsort>(db),
            ITransactionRegisterUnsortRepository
    {
        private readonly ApplicationDbContext _db = db;


        public async Task<TransactionRegisterUnsort?> GetRegisterUnsortDuplicateAsync(string containerCode,
            int departmentId)
        {
            var notInStatus = new[]
            {
                BssStatusConstants.Finished,
                BssStatusConstants.DeletedPrePrepare
            };

            DateTime startDate = DateTime.Today.AddHours(8);
            return await db.TransactionRegisterUnsorts
                .AsQueryable()
                .AsNoTracking()
                .Where(x =>
                    x.ContainerCode == containerCode &&
                    x.DepartmentId == departmentId &&
                    notInStatus.Contains(x.StatusId) &&
                    x.ReceivedDate >= startDate && x.ReceivedDate <= DateTime.Now &&
                    x.IsActive == true)
                .FirstOrDefaultAsync();
        }

        public async Task<List<RegisterUnsortResponse>> GetRegisterUnsortDetailsWhereStatusAndDateAsync(
            int departmentId,
            ICollection<int> statusIn, DateTime? startDateTime,
            DateTime? endDateTime, CancellationToken ct = default)
        {
            IQueryable<TransactionRegisterUnsort> query = Query();
            if (startDateTime.HasValue && endDateTime.HasValue)
            {
                query = query.Where(x => x.CreatedDate >= startDateTime && x.CreatedDate <= endDateTime);
            }

            var result = await query
                .Where(x =>
                    x.DepartmentId == departmentId &&
                    statusIn.Contains(x.StatusId) &&
                    x.IsActive == true
                )
                .Select(x => new RegisterUnsortResponse
                {
                    RegisterUnsortId = x.RegisterUnsortId,
                    ContainerCode = x.ContainerCode,
                    DepartmentId = x.DepartmentId,
                    IsActive = x.IsActive,
                    StatusId = x.StatusId,
                    StatusNameTh = x.MasterStatus.StatusNameTh,
                    ReceivedDate = x.ReceivedDate,
                    Remark = x.Remark ?? string.Empty,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate,

                    UnsortCC = x.TransactionUnsortCCs
                        .Where(cc => cc.IsActive == true)
                        .Select(cc => new RegisterUnsortCCResponse
                        {
                            UnsortCCId = cc.UnsortCCId,
                            RegisterUnsortId = cc.RegisterUnsortId,
                            InstId = cc.InstId,
                            InstNameTh = cc.MasterInstitution.InstitutionNameTh,
                            DenoId = cc.DenoId,
                            DenoName = cc.MasterDenomination.DenominationPrice,
                            BanknoteQty = cc.BanknoteQty,
                            RemainingQty = cc.RemainingQty,
                            AdjustQty = cc.AdjustQty,
                            IsActive = cc.IsActive,
                            CreatedBy = cc.CreatedBy,
                            CreatedDate = cc.CreatedDate,
                            UpdatedBy = cc.UpdatedBy,
                            UpdatedDate = cc.UpdatedDate
                        })
                        .ToList()
                })
                .OrderByDescending(x => x.CreatedDate)
                .ToListAsync(ct);

            return result;
        }
        
        public async Task<List<RegisterUnsortResponse>> GetRegisterUnsortDetailsForCreateSendUnsortAsync(
            int departmentId,
            DateTime startDateTime, DateTime endDateTime, CancellationToken ct = default)
        {
            var allowStatuses = new[]
            {
                BssStatusConstants.Registered
            };

            var result = await Query()
                .Where(x =>
                    x.DepartmentId == departmentId &&
                    allowStatuses.Contains(x.StatusId) &&
                    x.CreatedDate >= startDateTime && x.CreatedDate <= endDateTime &&
                    x.IsActive == true
                )
                .Select(x => new RegisterUnsortResponse
                {
                    RegisterUnsortId = x.RegisterUnsortId,
                    ContainerCode = x.ContainerCode,
                    DepartmentId = x.DepartmentId,
                    IsActive = x.IsActive,
                    StatusId = x.StatusId,
                    StatusNameTh = x.MasterStatus.StatusNameTh,
                    ReceivedDate = x.ReceivedDate,
                    Remark = x.Remark ?? string.Empty,
                    CreatedBy = x.CreatedBy,
                    CreatedDate = x.CreatedDate,
                    UpdatedBy = x.UpdatedBy,
                    UpdatedDate = x.UpdatedDate,

                    UnsortCC = x.TransactionUnsortCCs
                        .Where(cc => cc.IsActive == true)
                        .Select(cc => new RegisterUnsortCCResponse
                        {
                            UnsortCCId = cc.UnsortCCId,
                            RegisterUnsortId = cc.RegisterUnsortId,
                            InstId = cc.InstId,
                            InstNameTh = cc.MasterInstitution.InstitutionNameTh,
                            DenoId = cc.DenoId,
                            DenoName = cc.MasterDenomination.DenominationPrice,
                            BanknoteQty = cc.BanknoteQty,
                            RemainingQty = cc.RemainingQty,
                            IsActive = cc.IsActive,
                            CreatedBy = cc.CreatedBy,
                            CreatedDate = cc.CreatedDate,
                            UpdatedBy = cc.UpdatedBy,
                            UpdatedDate = cc.UpdatedDate
                        })
                        .ToList()
                })
                .OrderByDescending(x => x.ReceivedDate)
                .ToListAsync(ct);

            return result;
        }

        public async Task<List<TransactionRegisterUnsort>?> GetRegisterUnsortIncludeUnsortCCForEditSendUnsortCCAsync(
            int departmentId, List<int> statusList, DateTime startDateTime,
            DateTime endDateTime)
        {
            try
            {
                return await db.TransactionRegisterUnsorts
                    .AsQueryable()
                    .AsNoTracking()
                    .Include(i => i.MasterStatus)
                    .Include(x => x.TransactionUnsortCCs)
                    .ThenInclude(ti => ti.MasterInstitution)
                    .Include(x => x.TransactionUnsortCCs)
                    .ThenInclude(ti => ti.MasterDenomination)
                    .Where(w => w.DepartmentId == departmentId && statusList.Contains(w.StatusId) &&
                                w.CreatedDate >= startDateTime && w.CreatedDate <= endDateTime &&
                                w.IsActive == true)
                    .Select(s => new TransactionRegisterUnsort
                    {
                        RegisterUnsortId = s.RegisterUnsortId,
                        ContainerCode = s.ContainerCode,
                        DepartmentId = s.DepartmentId,
                        IsActive = s.IsActive,
                        StatusId = s.StatusId,
                        MasterStatus = s.MasterStatus != null
                            ? new MasterStatus
                            {
                                StatusId = s.MasterStatus.StatusId,
                                StatusCode = s.MasterStatus.StatusCode,
                                StatusNameTh = s.MasterStatus.StatusNameTh,
                                StatusNameEn = s.MasterStatus.StatusNameEn,
                                IsActive = s.MasterStatus.IsActive,
                            }
                            : null,
                        SupervisorReceived = s.SupervisorReceived,
                        ReceivedDate = s.ReceivedDate,
                        Remark = s.Remark,
                        CreatedBy = s.CreatedBy,
                        CreatedDate = s.CreatedDate,
                        TransactionUnsortCCs = s.TransactionUnsortCCs.Where(w => w.IsActive == true).Select(cc =>
                            new TransactionUnsortCC
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
                                        InstitutionShortName = cc.MasterInstitution.InstitutionShortName,
                                        InstitutionNameTh = cc.MasterInstitution.InstitutionNameTh,
                                        InstitutionNameEn = cc.MasterInstitution.InstitutionNameEn,
                                        IsActive = cc.MasterInstitution.IsActive,
                                    }
                                    : null,
                                DenoId = cc.DenoId,
                                MasterDenomination = cc.MasterDenomination != null
                                    ? new MasterDenomination
                                    {
                                        DenominationId = cc.MasterDenomination.DenominationId,
                                        DenominationCode = cc.MasterDenomination.DenominationCode,
                                        DenominationPrice = cc.MasterDenomination.DenominationPrice,
                                        DenominationDesc = cc.MasterDenomination.DenominationDesc,
                                        DenominationCurrency = cc.MasterDenomination.DenominationCurrency,
                                        IsActive = cc.MasterDenomination.IsActive,
                                    }
                                    : null,
                                BanknoteQty = cc.BanknoteQty,
                                RemainingQty = cc.RemainingQty,
                                IsActive = cc.IsActive,
                                CreatedBy = cc.CreatedBy,
                                CreatedDate = cc.CreatedDate,
                            }).ToList()
                    })
                    .ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }

        private IQueryable<TransactionRegisterUnsort> Query()
            => _dbSet
                .AsNoTracking()
                .Include(x => x.TransactionUnsortCCs)
                .ThenInclude(cc => cc.MasterInstitution)
                .Include(x => x.TransactionUnsortCCs)
                .ThenInclude(cc => cc.MasterDenomination)
                .Include(x => x.MasterDepartment)
                .Include(x => x.MasterStatus);

        public async Task<TransactionRegisterUnsort?> ImportCbmsCheckDuplicateInRegisterUnSortAsync(
            string containerCode, int DepartmentId, DateTime startDateTime,
            DateTime endDateTime, List<int> statusList)
        {
            return await db.TransactionRegisterUnsorts.FirstOrDefaultAsync(x =>
                x.ContainerCode == containerCode &&
                x.DepartmentId == DepartmentId &&
                !statusList.Contains(x.StatusId) &&
                x.CreatedDate >= startDateTime && x.CreatedDate <= endDateTime &&
                x.IsActive == true);
        }

        public async Task<TransactionRegisterUnsort?> GetRegisterUnsortByRegisterUnsortIdForConfirmAsync(
            long registerUnsortId)
        {
            return await db.TransactionRegisterUnsorts
                .AsQueryable()
                .Select(s => new TransactionRegisterUnsort
                {
                    RegisterUnsortId = s.RegisterUnsortId,
                    ContainerCode = s.ContainerCode,
                    DepartmentId = s.DepartmentId,
                    IsActive = s.IsActive,
                    StatusId = s.StatusId,
                    SupervisorReceived = s.SupervisorReceived,
                    ReceivedDate = s.ReceivedDate,
                    Remark = s.Remark,
                    CreatedBy = s.CreatedBy,
                    CreatedDate = s.CreatedDate,
                    UpdatedBy = s.UpdatedBy,
                    UpdatedDate = s.UpdatedDate,
                    TransactionUnsortCCs = s.TransactionUnsortCCs.Where(w => w.IsActive == true).Select(ss =>
                        new TransactionUnsortCC
                        {
                            UnsortCCId = ss.UnsortCCId,
                            RegisterUnsortId = ss.RegisterUnsortId,
                            InstId = ss.InstId,
                            DenoId = ss.DenoId,

                            BanknoteQty = ss.BanknoteQty,
                            RemainingQty = ss.RemainingQty,
                            IsActive = ss.IsActive,
                            CreatedBy = ss.CreatedBy,
                            CreatedDate = ss.CreatedDate,
                            UpdatedBy = ss.UpdatedBy,
                        }).ToList()
                })
                .FirstOrDefaultAsync(x => x.RegisterUnsortId == registerUnsortId &&
                                          x.IsActive == true);
        }

        public async Task<TransactionRegisterUnsort?> GetRegisterUnsortByRegisterUnsortIdForPrintAsync(
            long registerUnsortId)
        {
            return await db.TransactionRegisterUnsorts
                .AsQueryable()
                .AsNoTracking()
                .Include(x => x.TransactionUnsortCCs)
                .ThenInclude(ti => ti.MasterInstitution)
                .Include(ii => ii.TransactionUnsortCCs)
                .ThenInclude(ti => ti.MasterDenomination)
                .Include(x => x.MasterDepartment)
                .Select(s => new TransactionRegisterUnsort
                {
                    RegisterUnsortId = s.RegisterUnsortId,
                    ContainerCode = s.ContainerCode,
                    DepartmentId = s.DepartmentId,
                    MasterDepartment = new MasterDepartment
                    {
                        DepartmentId = s.DepartmentId,
                        DepartmentCode = s.MasterDepartment.DepartmentCode,
                        DepartmentName = s.MasterDepartment.DepartmentName,
                        DepartmentShortName = s.MasterDepartment.DepartmentShortName
                    },
                    IsActive = s.IsActive,
                    StatusId = s.StatusId,
                    SupervisorReceived = s.SupervisorReceived,
                    ReceivedDate = s.ReceivedDate,
                    Remark = s.Remark,
                    CreatedBy = s.CreatedBy,
                    CreatedUser = s.CreatedUser != null
                        ? new MasterUser
                        {
                            FirstName = s.CreatedUser.FirstName ?? string.Empty,
                            LastName = s.CreatedUser.LastName ?? string.Empty,
                        }
                        : null,
                    CreatedDate = s.CreatedDate,
                    UpdatedBy = s.UpdatedBy,
                    UpdatedDate = s.UpdatedDate,
                    TransactionUnsortCCs = s.TransactionUnsortCCs.Where(w => w.IsActive == true).Select(ss =>
                        new TransactionUnsortCC
                        {
                            UnsortCCId = ss.UnsortCCId,
                            RegisterUnsortId = ss.RegisterUnsortId,
                            InstId = ss.InstId,
                            MasterInstitution = new MasterInstitution
                            {
                                InstitutionId = ss.InstId,
                                InstitutionCode = ss.MasterInstitution.InstitutionCode,
                                BankCode = ss.MasterInstitution.BankCode,
                                InstitutionShortName = ss.MasterInstitution.InstitutionShortName,
                                InstitutionNameTh = ss.MasterInstitution.InstitutionNameTh,
                                InstitutionNameEn = ss.MasterInstitution.InstitutionNameEn
                            },
                            DenoId = ss.DenoId,
                            MasterDenomination = new MasterDenomination
                            {
                                DenominationId = ss.DenoId,
                                DenominationCode = ss.MasterDenomination.DenominationCode,
                                DenominationPrice = ss.MasterDenomination.DenominationPrice,
                                DenominationDesc = ss.MasterDenomination.DenominationDesc
                            },
                            BanknoteQty = ss.BanknoteQty,
                            RemainingQty = ss.RemainingQty,
                            IsActive = ss.IsActive,
                            CreatedBy = ss.CreatedBy,
                            CreatedByUser = ss.CreatedByUser != null
                                ? new MasterUser
                                {
                                    FirstName = ss.CreatedByUser.FirstName ?? string.Empty,
                                    LastName = ss.CreatedByUser.LastName ?? string.Empty,
                                }
                                : null,
                            CreatedDate = ss.CreatedDate,
                            UpdatedBy = ss.UpdatedBy,
                        }).ToList()
                })
                .FirstOrDefaultAsync(x => x.RegisterUnsortId == registerUnsortId &&
                                          x.IsActive == true);
        }
    }
}