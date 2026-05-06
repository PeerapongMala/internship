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
    public class MasterMSevenQualityRepository : GenericRepository<MasterMSevenQuality>, IMasterMSevenQualityRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterMSevenQualityRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        private IQueryable<MasterMSevenQuality> MasterMSevenQualityQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterMSevenQuality>> SearchMasterMSevenQuality(
           PagedRequest<MasterMSevenQualityRequest> request,
           CancellationToken ct = default)
           => MasterMSevenQualityQuery()
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.M7QualityId != null)
                           query = query.Where(x => x.M7QualityId == filter.M7QualityId);

                       if (!string.IsNullOrEmpty(filter.M7QualityCode))
                           query = query.Where(x => x.M7QualityCode == filter.M7QualityCode);


                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.M7QualityCode.Contains(keyword) 
                           || x.M7QualityDescrpt.Contains(keyword)
                           || x.M7QualityCps.Contains(keyword)
                       );
                   },
                   sortMap: MasterMSevenQualitySortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterMSevenQuality, object>>>
                MasterMSevenQualitySortMap
                    = new Dictionary<string, Expression<Func<MasterMSevenQuality, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["M7QualityId"] = x => x.M7QualityId,
                        ["M7QualityCode"] = x => x.M7QualityCode,
                        ["M7QualityDescrpt"] = x => x.M7QualityDescrpt,
                        ["M7QualityCps"] = x => x.M7QualityCps,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
