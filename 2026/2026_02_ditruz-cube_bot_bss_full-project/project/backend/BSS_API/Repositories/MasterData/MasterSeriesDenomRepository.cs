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
    public class MasterSeriesDenomRepository : GenericRepository<MasterSeriesDenom> , IMasterSeriesDenomRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterSeriesDenomRepository(ApplicationDbContext db) : base(db) 
        {
            _db = db;
        }
        private IQueryable<MasterSeriesDenom> MasterSeriesDenomQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterSeriesDenom>> SearchMasterSeriesDenom(
           PagedRequest<MasterSeriesDenomRequest> request,
           CancellationToken ct = default)
           => MasterSeriesDenomQuery()
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.SeriesDenomId != null)
                           query = query.Where(x => x.SeriesDenomId == filter.SeriesDenomId);
                       if (!string.IsNullOrEmpty(filter.SeriesCode))
                           query = query.Where(x => x.SeriesCode == filter.SeriesCode);


                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.SeriesCode.Contains(keyword)
                           || x.SerieDescrpt.Contains(keyword)
                       );
                   },
                   sortMap: MasterSeriesDenomSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterSeriesDenom, object>>>
                MasterSeriesDenomSortMap
                    = new Dictionary<string, Expression<Func<MasterSeriesDenom, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["SeriesDenomId"] = x => x.SeriesDenomId,
                        ["SeriesCode"] = x => x.SeriesCode,
                        ["SerieDescrpt"] = x => x.SerieDescrpt,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
