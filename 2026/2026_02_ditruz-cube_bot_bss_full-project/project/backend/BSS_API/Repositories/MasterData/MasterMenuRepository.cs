using BSS_API.Models;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Common;
using BSS_API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BSS_API.Repositories
{
    public class MasterMenuRepository : GenericRepository<MasterMenu>, IMasterMenuRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterMenuRepository(ApplicationDbContext db)
            : base(db)
        {
            _db = db;
        }
                

        private IQueryable<MasterMenu> MasterMenuQuery()
           => _dbSet
               .AsNoTracking();


        public Task<PagedData<MasterMenuViewData>> SearchMenu(
           PagedRequest<MasterMenuRequest> request,
           CancellationToken ct = default)
           => MasterMenuQuery()
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
                           x.MenuName.Contains(keyword) || x.ControllerName.Contains(keyword)
                           || x.ActionName.Contains(keyword) || x.MenuPath.Contains(keyword)
                           || x.DisplayOrder.ToString() == keyword
                       );
                   },
                   sortMap: MasterMenuSortMap,
                   selector: x => new MasterMenuViewData
                   {
                       MenuId = x.MenuId,
                       MenuName = x.MenuName,
                       MenuPath=x.MenuPath,
                       ControllerName = x.ControllerName,
                       ActionName = x.ActionName,                       
                       DisplayOrder = x.DisplayOrder,
                       ParentMenuId=x.ParentMenuId,
                       IsActive = x.IsActive,
                       CreatedBy = x.CreatedBy,
                       CreatedDate = x.CreatedDate,
                       UpdatedBy = x.UpdatedBy,
                       UpdatedDate = x.UpdatedDate
                   },
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterMenu, object>>>
                MasterMenuSortMap
                    = new Dictionary<string, Expression<Func<MasterMenu, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["MenuId"] = x => x.MenuId,
                        ["MenuName"] = x => x.MenuName,
                        ["ControllerName"] = x => x.ControllerName,
                        ["ActionName"] = x => x.ActionName,
                        ["ParentMenuId"] = x => x.ParentMenuId,
                        ["MenuPath"] = x => x.MenuPath,
                        ["DisplayOrder"] = x => x.DisplayOrder,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
