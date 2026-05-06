using BSS_API.Helpers;
using BSS_API.Models;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_API.Repositories.Common;
using BSS_API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BSS_API.Repositories
{
    public class MasterRoleRepository : GenericRepository<MasterRole>, IMasterRoleRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterRoleRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public IQueryable<MasterRole> GetQueryable()
        {
            return _db.Set<MasterRole>().AsNoTracking();
        }

        public async Task<ICollection<MasterRole>> GetMasterRoleWithSearchRequestAsync(SystemSearchRequest request)
        {
            return await _db.MasterRoles
                .AsNoTracking()
                .Include(i => i.MasterRoleGroup.MasterUserRole)
                .ThenInclude(i => i.MasterUser)
                .AsQueryable()
                .GenerateCondition(request)
                .Take(request.SelectItemCount)
                .ToListAsync();
        }
        private IQueryable<MasterRole> MasterRoleQuery()
           => _dbSet
               .AsNoTracking();
        public Task<PagedData<MasterRole>> SearchRole(
           PagedRequest<MasterRoleRequest> request,
           CancellationToken ct = default)
           => MasterRoleQuery()
                .Include(x => x.MasterRoleGroup)
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;

                        
                       if (filter.RoleGroupId != null && filter.RoleGroupId>0)
                           query = query.Where(x => x.RoleGroupId == filter.RoleGroupId);

                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.RoleCode.Contains(keyword) || x.RoleName.Contains(keyword)
                       );
                   },
                   sortMap: MasterRoleSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterRole, object>>>
                MasterRoleSortMap
                    = new Dictionary<string, Expression<Func<MasterRole, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["roleId"] = x => x.RoleId,
                        ["roleGroupId"] = x => x.RoleGroupId,
                        ["roleGroupName"] = x => x.MasterRoleGroup.RoleGroupName,
                        ["roleCode"] = x => x.RoleCode,
                        ["roleName"] = x => x.RoleName,
                        ["roleDescription"] = x => x.RoleDescription,
                        ["isActive"] = x => x.IsActive
                    };
    }
}