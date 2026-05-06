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
    public class MasterMSevendenomSeriesRepository : GenericRepository<MasterMSevendenomSeries> , IMasterMSevendenomSeriesRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterMSevendenomSeriesRepository(ApplicationDbContext db) : base(db) 
        {
            _db = db;
        }

        private IQueryable<MasterMSevendenomSeries> MasterMSevendenomSeriesQuery()
               =>   _dbSet
                   .AsNoTracking();

        public Task<PagedData<MasterMSevendenomSeries>> SearchMasterMSevendenomSeries(
           PagedRequest<MasterMSevendenomSeriesRequest> request,
           CancellationToken ct = default)
           => MasterMSevendenomSeriesQuery()
               .Include(x=>x.MasterSeriesDenom)
               .Include(x => x.MasterMSevenDenom )
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query; 


                       if (filter.MSevendenomSeriesId != null)
                           query = query.Where(x => x.MSevendenomSeriesId == filter.MSevendenomSeriesId);
                       if (filter.MSevenDenomId != null)
                           query = query.Where(x => x.MSevenDenomId == filter.MSevenDenomId);
                       if (filter.SeriesDenomId != null)
                           query = query.Where(x => x.SeriesDenomId == filter.SeriesDenomId);


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
                   sortMap: MasterMSevendenomSeriesSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterMSevendenomSeries, object>>>
                MasterMSevendenomSeriesSortMap
                    = new Dictionary<string, Expression<Func<MasterMSevendenomSeries, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["MSevendenomSeriesId"] = x => x.MSevendenomSeriesId,
                        ["MSevenDenomId"] = x => x.MSevenDenomId,
                        ["SeriesCode"] = x => x.MasterSeriesDenom.SeriesCode,
                        ["SerieDescrpt"] = x => x.MasterSeriesDenom.SerieDescrpt,
                        ["M7DenomCode"] = x => x.MasterMSevenDenom.M7DenomCode,
                        ["M7DenomName"] = x => x.MasterMSevenDenom.M7DenomName,
                        ["M7DenomDescrpt"] = x => x.MasterMSevenDenom.M7DenomDescrpt, 
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
