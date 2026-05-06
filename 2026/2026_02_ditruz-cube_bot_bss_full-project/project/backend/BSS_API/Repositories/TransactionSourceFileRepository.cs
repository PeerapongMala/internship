namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;
    using Microsoft.EntityFrameworkCore;

    public class TransactionSourceFileRepository(ApplicationDbContext db)
        : GenericRepository<TransactionSourceFile>(db),
            ITransactionSourceFileRepository
    {
        private readonly ApplicationDbContext _db = db;

        public async Task<bool> IsDuplicateFileAsync(string fileName, int machineId)
        {
            return await _db.TransactionSourceFiles
                .AsNoTracking()
                .AnyAsync(x => x.FileName == fileName && x.MachineId == machineId && x.IsActive == true);
        }
    }
}
