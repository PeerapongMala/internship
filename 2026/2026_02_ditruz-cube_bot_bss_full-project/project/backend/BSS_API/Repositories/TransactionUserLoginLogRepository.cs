namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Core.Constants;
    using Models.Entities;
    using Microsoft.EntityFrameworkCore;
    using System.Collections.Generic;
    using DocumentFormat.OpenXml.Bibliography;
    using BSS_API.Models.ObjectModels;
    using System.Reflection.PortableExecutable;
    using BSS_API.Models.RequestModels;
    using DocumentFormat.OpenXml.Spreadsheet;

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
                    .Where(w => w.DepartmentId == department &&
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

        public async Task<IEnumerable<UserLoginLogData>> GetLoginLogActiveByUserIdAsync(int userId, int departmentId)
        {
            try
            {
                var queryData = await _db.TransactionUserLoginLogs
                    .Include(u => u.UserLogin)
                    .Include(d => d.MasterDepartment)
                    .Include(m => m.MasterMachine)
                    .Where(w => w.DepartmentId == departmentId && w.UserId == userId && w.IsActive == true)
                    .OrderByDescending(o => o.CreatedDate)
                    .Take(1)
                    .AsNoTracking()
                    .Select(s => new UserLoginLogData
                    {
                        LoginLogId = s.LoginLogId,
                        UserId = s.UserId,
                        DepartmentId = departmentId,
                        DepartmentName = s.MasterDepartment.DepartmentName,
                        MachineId = s.MachineId,
                        MachineName = s.MasterMachine.MachineName,
                        FirstLogin = s.FirstLogin
                    })
                    .ToListAsync();

                return queryData;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<IEnumerable<UserLoginLogData>> GetLoginLogActiveByMachineAsync(CheckUserSessionByMachineActiveRequest request)
        {
            try
            {
                var queryData = await _db.TransactionUserLoginLogs
                    .Include(u => u.UserLogin)
                    .Include(d => d.MasterDepartment)
                    .Include(m => m.MasterMachine)
                    .Where(w => w.DepartmentId == request.DepartmentId && 
                                w.UserId == request.UserId && 
                                w.MachineId == request.MachineId && 
                                w.IsActive == true)
                    .OrderByDescending(o => o.CreatedDate)
                    .Take(1)
                    .AsNoTracking()
                    .Select(s => new UserLoginLogData
                    {
                        LoginLogId = s.LoginLogId,
                        UserId = s.UserId,
                        DepartmentId = s.DepartmentId,
                        DepartmentName = s.MasterDepartment.DepartmentName,
                        MachineId = s.MachineId,
                        MachineName = s.MasterMachine.MachineName,
                        FirstLogin = s.FirstLogin
                    })
                    .ToListAsync();

                return queryData;
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
