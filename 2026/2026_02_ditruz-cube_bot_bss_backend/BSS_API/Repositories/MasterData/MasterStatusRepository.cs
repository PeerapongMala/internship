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
    public class MasterStatusRepository : GenericRepository<MasterStatus>, IMasterStatusRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterStatusRepository(ApplicationDbContext db):base(db)
        {
            _db = db;
        }

        private IQueryable<MasterStatus> MasterStatusQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterStatus>> SearchMasterStatus(
           PagedRequest<MasterStatusRequest> request,
           CancellationToken ct = default)
           => MasterStatusQuery()
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query; 

                       if (filter.StatusId != null)
                           query = query.Where(x => x.StatusId == filter.StatusId);
                       if (!string.IsNullOrEmpty(filter.StatusCode))
                           query = query.Where(x => x.StatusCode == filter.StatusCode);


                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.StatusCode.Contains(keyword) 
                           || x.StatusNameTh.Contains(keyword)
                           || x.StatusNameEn.Contains(keyword)
                       );
                   },
                   sortMap: MasterStatusSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterStatus, object>>>
                MasterStatusSortMap
                    = new Dictionary<string, Expression<Func<MasterStatus, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["StatusId"] = x => x.StatusId,
                        ["StatusCode"] = x => x.StatusCode,
                        ["StatusNameTh"] = x => x.StatusNameTh,
                        ["StatusNameEn"] = x => x.StatusNameEn,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
