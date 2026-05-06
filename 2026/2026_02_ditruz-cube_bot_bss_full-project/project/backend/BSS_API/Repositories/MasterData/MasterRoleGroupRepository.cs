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
    public class MasterRoleGroupRepository : GenericRepository<MasterRoleGroup>, IMasterRoleGroupRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterRoleGroupRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }


        public async Task<MasterRoleGroup?> GetRoleGroupByIdAsync(int roleGroupId)
        {
            IQueryable<MasterRoleGroup> query = _db.MasterRoleGroups.AsQueryable()
                .Where(w => w.RoleGroupId == roleGroupId);

            return await query.FirstOrDefaultAsync();
        }

        public IQueryable<MasterRoleGroup> GetQueryable()
        {
            return _db.Set<MasterRoleGroup>().AsNoTracking();
        }
        private IQueryable<MasterRoleGroup> MasterRoleGroupQuery()
           => _dbSet
               .AsNoTracking(); 

        public Task<PagedData<MasterRoleGroup>> SearchRoleGroup(
            PagedRequest<MasterRoleGroupRequest> request,
            CancellationToken ct = default)
            => MasterRoleGroupQuery()
                .ToPagedDataAsync(
                    request: request,
                    applyFilter: (query, filter) =>
                    {
                        if (filter == null)
                            return query;

                        if (filter.IsActive != null)
                            query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);


                        return query;
                    },
                    applySearch: (query, keyword) =>
                    {
                        if (string.IsNullOrWhiteSpace(keyword))
                            return query;

                        return query.Where(x =>
                            x.RoleGroupCode.Contains(keyword) || x.RoleGroupName.Contains(keyword)
                        );
                    },
                    sortMap: MasterRoleGroupSortMap,
                    selector: x => x,
                    ct: ct
                );

 

        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterRoleGroup, object>>>
                MasterRoleGroupSortMap
                    = new Dictionary<string, Expression<Func<MasterRoleGroup, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["RoleGroupId"] = x => x.RoleGroupId,
                        ["RoleGroupCode"] = x => x.RoleGroupCode,
                        ["RoleGroupName"] = x => x.RoleGroupName, 
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
