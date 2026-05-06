namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;
    using Models.RequestModels;
    using Microsoft.EntityFrameworkCore;

    public class TransactionUnsortCCRepository : GenericRepository<TransactionUnsortCC>, ITransactionUnsortCCRepository
    {
        private readonly ApplicationDbContext _db;

        public TransactionUnsortCCRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task<TransactionUnsortCC?> GetTransactionUnsortCCWithTransactionPrepareAsync(
            long unsortCcId)
        {
            return await _db.TransactionUnsortCCs.Include(i => i.TransactionPreparation)
                .Where(w => w.UnsortCCId == unsortCcId && w.IsActive == true)
                .FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<TransactionRegisterUnsort>> CheckValidateTransactionUnSortCcAsync(
            ValidateTransactionUnSortCcRequest request)
        {
            try
            {
                var queryData = await _db.TransactionRegisterUnsorts
                    .Include(x => x.MasterDepartment)
                    .Include(x => x.MasterStatus)
                    .Include(x => x.TransactionUnsortCCs)
                    .AsNoTracking()
                    .Where(x => x.DepartmentId == request.DepartmentId &&
                                x.ContainerCode == request.ContainerId.Trim() &&
                                x.CreatedDate >= request.StartDate &&
                                x.CreatedDate <= request.EndDate &&
                                x.IsActive == true)
                    .OrderByDescending(x => x.CreatedDate)
                    .ToListAsync();

                return queryData;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<TransactionUnsortCC?> GetUnsortCcTransactionContainerPrepareAndIncludePrepareWithReceiveIdAsync(long receiveId, int institutionId, int denominationId, int? cashCenterId = null, string? barcode = null)
        {
            IQueryable<TransactionUnsortCC> query = _db.TransactionUnsortCCs
                .Include(x => x.TransactionPreparation)
                .Where(w => w.UnsortCCId == receiveId && w.IsActive == true)
                .Where(w => w.TransactionPreparation.All(a => a.InstId == institutionId &&
                                                              a.DenoId == denominationId &&
                                                              a.IsActive == true))
                .AsQueryable();

            if (cashCenterId.HasValue)
            {
                query = query.Where(a => a.TransactionPreparation.All(all => all.CashcenterId == cashCenterId));
            }

            if (!string.IsNullOrWhiteSpace(barcode))
            {
                query = query.Where(a => a.TransactionPreparation.All(all => all.PackageCode == barcode));
            }

            return await query.FirstOrDefaultAsync();
        }
    }
}