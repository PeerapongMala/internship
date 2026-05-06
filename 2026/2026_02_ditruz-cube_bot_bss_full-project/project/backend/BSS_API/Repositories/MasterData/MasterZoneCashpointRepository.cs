using BSS_API.Helpers;
using Microsoft.EntityFrameworkCore;

namespace BSS_API.Repositories
{
    using BSS_API.Models.Common;
    using BSS_API.Models.RequestModels;
    using BSS_API.Repositories.Common;
    using Interface;
    using Models;
    using Models.Entities;
    using Models.SearchParameter;
    using System.Linq.Expressions;

    public class MasterZoneCashpointRepository(ApplicationDbContext db)
        : GenericRepository<MasterZoneCashpoint>(db), IMasterZoneCashpointRepository
    {
        private readonly ApplicationDbContext _db = db;

        public async Task<List<MasterZoneCashpoint>> GetMasterZoneCashpointWithSearchRequestAsync(SystemSearchRequest request)
        {
            return await db.MasterZoneCashpoints
                .AsNoTracking()
                .AsQueryable()
                .GenerateCondition(request)
                .ToListAsync();
        }

        private IQueryable<MasterZoneCashpoint> MasterZoneCashpointQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterZoneCashpoint>> SearchMasterZoneCashpoint(
           PagedRequest<MasterZoneCashpointRequest> request,
           CancellationToken ct = default)
           => MasterZoneCashpointQuery()
               .Include(x=>x.MasterZone)
               .Include(x => x.MasterCashPoint)
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.ZoneCashpointId != null)
                           query = query.Where(x => x.ZoneCashpointId == filter.ZoneCashpointId);
                       if (filter.ZoneId != null)
                           query = query.Where(x => x.ZoneId == filter.ZoneId);
                       if (filter.CashpointId != null)
                           query = query.Where(x => x.CashpointId == filter.CashpointId);
 
                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.MasterZone.ZoneCode.Contains(keyword)
                           || x.MasterZone.ZoneName.Contains(keyword)
                           || x.MasterCashPoint.CashpointName.Contains(keyword));
                   },
                   sortMap: MasterZoneCashpointSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterZoneCashpoint, object>>>
                MasterZoneCashpointSortMap
                    = new Dictionary<string, Expression<Func<MasterZoneCashpoint, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["ZoneCashpointId"] = x => x.ZoneCashpointId,
                        ["ZoneId"] = x => x.ZoneId,
                        ["ZoneCode"] = x => x.MasterZone.ZoneCode,
                        ["ZoneName"] = x => x.MasterZone.ZoneName,
                        ["CashpointId"] = x => x.CashpointId,
                        ["CashpointName"] = x => x.MasterCashPoint.CashpointName,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
