using BSS_API.Core.Constants;

namespace BSS_API.Repositories
{
    using Azure;
    using BSS_API.Models.Common;
    using BSS_API.Models.ObjectModels;
    using BSS_API.Models.RequestModels;
    using BSS_API.Repositories.Common;
    using Helpers;
    using Interface;
    using Microsoft.EntityFrameworkCore;
    using Models;
    using Models.Entities;
    using Models.SearchParameter;
    using System.Linq.Expressions;

    public class MasterUserRepository(ApplicationDbContext db)
        : GenericRepository<MasterUser>(db), IMasterUserRepository
    {
        private readonly ApplicationDbContext _db = db;

        public IQueryable<MasterUser> GetQueryable()
        {
            return _db.Set<MasterUser>().AsNoTracking();
        }

        public async Task<ICollection<MasterUser>> GetUserLoginDropdownAsync()
        {
            return await _dbSet
                .Include(d => d.MasterDepartment)
                .Include(i => i.MasterUserRole)
                .ThenInclude(t => t.MasterRoleGroup)
                .Where(w => w.IsActive == true &&
                            w.MasterUserRole.Any(w => w.IsActive == true))
                .AsNoTracking()
                .ToListAsync();
        }


        public async Task<MasterUser?> GetFirstSupervisorFromDepartmentAsync(int departmentId)
        {
            return await _dbSet
                .Include(i => i.MasterUserRole)
                .ThenInclude(t => t.MasterRoleGroup)
                .Where(w => w.DepartmentId == departmentId && 
                            w.IsActive == true &&
                            w.MasterUserRole.Any(w => w.MasterRoleGroup.RoleGroupCode == BssRoleGroupCodeConstants.Supervisor))
                .AsNoTracking()
                .FirstOrDefaultAsync();
        }

        public async Task<ICollection<MasterUser>> GetMasterUserWithSearchRequestAsync(SystemSearchRequest request)
        {
            return await _db.MasterUsers
                .Include(i => i.MasterDepartment)
                .Include(i => i.MasterUserRole)
                .ThenInclude(t => t.MasterRoleGroup.MasterRole)
                .AsNoTracking()
                .AsQueryable()
                .GenerateCondition(request)
                .Where(w => w.IsActive == true)
                .Take(request.SelectItemCount)
                .ToListAsync();
        }

        private IQueryable<MasterUser> MasterUserQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterUserViewData>> SearchMasterUser(
           PagedRequest<MasterUserRequest> request,
           CancellationToken ct = default)
           => MasterUserQuery()
               .AsNoTracking()
               .ToPagedDataAsync(
                   request: request,

                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;

                       if (filter.UserId != null)
                           query = query.Where(x => x.UserId == filter.UserId);

                       if (filter.DepartmentId != null)
                           query = query.Where(x => x.DepartmentId == filter.DepartmentId);

                       if (filter.RoleGroupId != null)
                           query = query.Where(x => x.MasterUserRole.Any(r => r.RoleGroupId == filter.RoleGroupId));

                       if (!string.IsNullOrEmpty(filter.UserName))
                           query = query.Where(x => x.UserName == filter.UserName);

                       if (!string.IsNullOrEmpty(filter.UserEmail))
                           query = query.Where(x => x.UserEmail == filter.UserEmail);

                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);


                       return query;
                   },

                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.FirstName.Contains(keyword)
                           || x.LastName.Contains(keyword)
                           || x.UsernameDisplay.Contains(keyword)
                       );
                   },

                   sortMap: MasterUserSortMap,

                   
                   selector: x => new MasterUserViewData
                   {
                       UserId = x.UserId,
                       UserName = x.UserName,
                       UsernameDisplay = x.UsernameDisplay,
                       UserEmail = x.UserEmail,
                       IsActive = x.IsActive,
                       FirstName= x.FirstName,
                       LastName=x.LastName,
                       DepartmentId = x.DepartmentId,
                       DepartmentName=x.MasterDepartment.DepartmentName,
                       StartDate=x.StartDate,
                       EndDate=x.EndDate,
                       //requirement confirm that only one role group is allow
                       RoleGroupId = x.MasterUserRole
                        .Where(r => r.IsActive == true)
                        .OrderBy(r => r.RoleGroupId)
                        .Select(r => (int?)r.RoleGroupId)
                        .FirstOrDefault() ?? 0,
                       RoleGroupName = x.MasterUserRole
                        .Where(r => r.IsActive == true)
                        .OrderBy(r => r.RoleGroupId)
                        .Select(r => r.MasterRoleGroup.RoleGroupName)
                        .FirstOrDefault() ?? string.Empty
                   },
                   ct: ct
               );

       

        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterUser, object>>>
                MasterUserSortMap
                    = new Dictionary<string, Expression<Func<MasterUser, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["UserId"] = x => x.UserId,
                        ["UserName"] = x => x.UserName,
                        ["UsernameDisplay"] = x => x.UsernameDisplay,
                        ["UserEmail"] = x => x.UserEmail,
                        ["FirstName"] = x => x.FirstName,
                        ["LastName"] = x => x.LastName,
                        ["StartDate"] = x => x.StartDate,
                        ["EndDate"] = x => x.EndDate,
                        ["IsActive"] = x => x.IsActive ,
                        ["DepartmentName"] = x => x.MasterDepartment.DepartmentName 
                    };
    }
}
