using BSS_API.Models;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Common;
using BSS_API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BSS_API.Repositories
{
    public class MasterRolePermissionRepository : GenericRepository<MasterRolePermission>, IMasterRolePermissionRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterRolePermissionRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        private IQueryable<MasterRolePermission> MasterRolePermissionQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterRolePermission>> SearchMasterRolePermission(
           PagedRequest<MasterRolePermissionRequest> request,
           CancellationToken ct = default)
           => MasterRolePermissionQuery()
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.RolePermissionId != null)
                           query = query.Where(x => x.RolePermissionId == filter.RolePermissionId);
                       if (filter.RoleId != null)
                           query = query.Where(x => x.RoleId == filter.RoleId);
                       if (filter.MenuId != null)
                           query = query.Where(x => x.MenuId == filter.MenuId);


                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query;
                   },
                   sortMap: MasterRolePermissionSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterRolePermission, object>>>
                MasterRolePermissionSortMap
                    = new Dictionary<string, Expression<Func<MasterRolePermission, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["RolePermissionId"] = x => x.RolePermissionId,
                        ["RoleId"] = x => x.RoleId,
                        ["MenuId"] = x => x.MenuId,
                        ["AssignedDateTime"] = x => x.AssignedDateTime,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
