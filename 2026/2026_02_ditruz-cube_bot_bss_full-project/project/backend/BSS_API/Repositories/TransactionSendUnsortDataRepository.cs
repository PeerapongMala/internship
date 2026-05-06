namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;
    using Microsoft.EntityFrameworkCore;

    public class TransactionSendUnsortDataRepository(ApplicationDbContext db)
        : GenericRepository<TransactionSendUnsortData>(db),
            ITransactionSendUnsortDataRepository
    {
        private readonly ApplicationDbContext _db = db;

        public async Task<ICollection<TransactionSendUnsortData>?>
            GetSendUnsortDataAndRegisterUnsortAndUnsortCCWithSendUnsortCCIdAsync(long sendUnsortCCId,
                bool tracked = false)
        {
            try
            {
                IQueryable<TransactionSendUnsortData> sendUnsortDataQueryable =
                    _db.TransactionSendUnsortDatas
                        .AsQueryable()
                        .Include(x => x.TransactionRegisterUnsort.TransactionUnsortCCs)
                        .Where(w => w.SendUnsortId == sendUnsortCCId && w.IsActive == true);

                if (tracked)
                {
                    sendUnsortDataQueryable = sendUnsortDataQueryable.AsTracking();
                }

                return await sendUnsortDataQueryable
                    .Select(s => new TransactionSendUnsortData
                    {
                        SendDataId = s.SendDataId,
                        SendUnsortId = s.SendUnsortId,
                        RegisterUnsortId = s.RegisterUnsortId,
                        IsActive = s.IsActive,
                        CreatedBy = s.CreatedBy,
                        CreatedDate = s.CreatedDate,
                        UpdatedBy = s.UpdatedBy,
                        UpdatedDate = s.UpdatedDate,
                        TransactionRegisterUnsort = s.TransactionRegisterUnsort != null
                            ? new TransactionRegisterUnsort
                            {
                                RegisterUnsortId = s.TransactionRegisterUnsort.RegisterUnsortId,
                                ContainerCode = s.TransactionRegisterUnsort.ContainerCode,
                                DepartmentId = s.TransactionRegisterUnsort.DepartmentId,
                                IsActive = s.TransactionRegisterUnsort.IsActive,
                                StatusId = s.TransactionRegisterUnsort.StatusId,
                                SupervisorReceived = s.TransactionRegisterUnsort.SupervisorReceived,
                                ReceivedDate = s.TransactionRegisterUnsort.ReceivedDate,
                                Remark = s.TransactionRegisterUnsort.Remark,
                                CreatedBy = s.TransactionRegisterUnsort.CreatedBy,
                                CreatedDate = s.TransactionRegisterUnsort.CreatedDate,
                                UpdatedBy = s.TransactionRegisterUnsort.UpdatedBy,
                                UpdatedDate = s.TransactionRegisterUnsort.UpdatedDate,
                                TransactionUnsortCCs = s.TransactionRegisterUnsort.TransactionUnsortCCs.Select(cc =>
                                    new TransactionUnsortCC
                                    {
                                        UnsortCCId = cc.UnsortCCId,
                                        RegisterUnsortId = cc.RegisterUnsortId,
                                        InstId = cc.InstId,
                                        DenoId = cc.DenoId,
                                        BanknoteQty = cc.BanknoteQty,
                                        RemainingQty = cc.RemainingQty,
                                        IsActive = cc.IsActive,
                                        CreatedBy = cc.CreatedBy,
                                        CreatedDate = cc.CreatedDate,
                                        UpdatedBy = cc.UpdatedBy,
                                        UpdatedDate = cc.UpdatedDate,
                                    }).ToList()
                            }
                            : null
                    })
                    .ToListAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}