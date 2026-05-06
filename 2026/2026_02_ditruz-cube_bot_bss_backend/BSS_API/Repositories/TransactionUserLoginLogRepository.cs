namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Core.Constants;
    using Models.Entities;
    using Microsoft.EntityFrameworkCore;
    
    public class TransactionUserLoginLogRepository(ApplicationDbContext db)
        : GenericRepository<TransactionUserLoginLog>(db), ITransactionUserLoginLogRepository
    {
        private readonly ApplicationDbContext _db = db;
        
        public async Task<TransactionUserLoginLog?> GetLastSupervisorLoginAsync(int department)
        {
            try
            {
                return await _dbSet
                    .Include(i => i.UserLogin)
                    .ThenInclude(ti => ti.MasterUserRole)
                    .ThenInclude(tir => tir.MasterRoleGroup)
                    .Where(w=> w.DepartmentId == department && 
                               w.IsActive == true &&
                               w.UserLogin.MasterUserRole.Any(a => a.MasterRoleGroup.RoleGroupCode == BssRoleGroupCodeConstants.Supervisor))
                    .OrderByDescending(o => o.CreatedDate)
                    .AsNoTracking()
                    .Select(s => new TransactionUserLoginLog
                    {
                        UserId = s.UserId,
                        UserLogin = s.UserLogin != null ? new MasterUser
                        {
                            FirstName = s.UserLogin.FirstName,
                            LastName = s.UserLogin.LastName
                        } : null,
                        DepartmentId = s.DepartmentId
                    })
                    .FirstOrDefaultAsync();
            }
            catch (Exception)
            {
               return null;
            }
        }
    }
}
