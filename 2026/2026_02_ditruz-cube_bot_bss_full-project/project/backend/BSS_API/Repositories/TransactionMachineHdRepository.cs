namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;
    using Microsoft.EntityFrameworkCore;

    public class TransactionMachineHdRepository(ApplicationDbContext db)
        : GenericRepository<TransactionMachineHd>(db),
            ITransactionMachineHdRepository
    {
        private readonly ApplicationDbContext _db = db;

        public async Task<List<TransactionMachineHd>> GetByMachineIdAsync(int machineId)
        {
            return await _db.TransactionMachineHds
                .AsNoTracking()
                .Include(x => x.TransactionMachineHdDatas)
                .Where(x => x.MachineId == machineId && x.IsActive == true
                          && (x.IsMatchPrepare == null || x.IsMatchPrepare == false))
                .OrderByDescending(x => x.CreatedDate)
                .ToListAsync();
        }

        public async Task<List<TransactionMachineHd>> GetUnmatchedByDepartmentAsync(
            int departmentId, int? machineId)
        {
            var query = _db.TransactionMachineHds
                .Where(x => x.DepartmentId == departmentId
                          && x.IsActive == true
                          && (x.IsDuplicated == null || x.IsDuplicated == false)
                          && (x.IsMatchPrepare == null || x.IsMatchPrepare == false));

            if (machineId.HasValue)
                query = query.Where(x => x.MachineId == machineId.Value);

            return await query.OrderBy(x => x.CreatedDate).ToListAsync();
        }

        public async Task<List<TransactionMachineHd>> GetUnreconciledAsync(int departmentId, int machineId)
        {
            return await _db.TransactionMachineHds
                .Where(x => x.DepartmentId == departmentId
                          && x.MachineId == machineId
                          && x.IsActive == true
                          && (x.IsReconciled == null || x.IsReconciled == false))
                .ToListAsync();
        }

        public async Task<bool> ExistsDuplicateAsync(string headerCardCode, int machineId, DateTime cutoffDate)
        {
            return await _db.TransactionMachineHds.AnyAsync(x =>
                x.HeaderCardCode == headerCardCode
                && x.MachineId == machineId
                && x.IsActive == true
                && (x.IsDuplicated == null || x.IsDuplicated == false)
                && x.CreatedDate >= cutoffDate);
        }
    }
}
