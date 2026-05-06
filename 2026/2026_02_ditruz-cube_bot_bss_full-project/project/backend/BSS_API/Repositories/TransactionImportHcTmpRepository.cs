namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;
    using Microsoft.EntityFrameworkCore;

    public class TransactionImportHcTmpRepository(ApplicationDbContext db)
        : GenericRepository<TransactionImportHcTmp>(db),
            ITransactionImportHcTmpRepository
    {
        private readonly ApplicationDbContext _db = db;

        public async Task<List<TransactionImportHcTmp>> GetByDepartmentAndDateAsync(
            int departmentId, int machineId, int userId, DateTime startDate, DateTime endDate)
        {
            return await _db.TransactionImportHcTmps
                .AsNoTracking()
                .Where(x => x.DepartmentId == departmentId
                          && x.MachineId == machineId
                          && x.CreatedBy == userId
                          && x.IsActive == true
                          && x.CreatedDate >= startDate
                          && x.CreatedDate <= endDate)
                .ToListAsync();
        }

        public async Task DeactivateOldRecordsAsync(int departmentId, int machineId, int userId)
        {
            var oldRecords = await _db.TransactionImportHcTmps
                .Where(x => x.DepartmentId == departmentId
                          && x.MachineId == machineId
                          && x.CreatedBy == userId
                          && x.IsActive == true)
                .ToListAsync();

            foreach (var record in oldRecords)
            {
                record.IsActive = false;
                record.UpdatedBy = userId;
                record.UpdatedDate = DateTime.Now;
            }
        }
    }
}
