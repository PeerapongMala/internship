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
    public class MasterMSevenDenomRepository : GenericRepository<MasterMSevenDenom>, IMasterMSevenDenomRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterMSevenDenomRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        private IQueryable<MasterMSevenDenom> MasterMSevenDenomQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterMSevenDenom>> SearchMasterMSevenDenom(
           PagedRequest<MasterMSevenDenomRequest> request,
           CancellationToken ct = default)
           => MasterMSevenDenomQuery()
               .Include(x => x.MasterDenomination)
                .Include(x => x.MasterSeriesDenom)
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.M7DenomId != null)
                           query = query.Where(x => x.M7DenomId == filter.M7DenomId);
                       if (filter.DenoId != null)
                           query = query.Where(x => x.DenoId == filter.DenoId);
                       if (!string.IsNullOrEmpty(filter.M7DenomCode))
                           query = query.Where(x => x.M7DenomCode == filter.M7DenomCode);
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

                       return query.Where(x =>
                           x.M7DenomCode.Contains(keyword)
                           || x.M7DenomName.Contains(keyword)
                           || x.M7DenomDescrpt.Contains(keyword)
                           || x.M7DenomBms.Contains(keyword)
                           || x.M7DnBms.Contains(keyword)
                           || x.MasterDenomination.DenominationCode.ToString().Contains(keyword)
                           || x.MasterDenomination.DenominationDesc.Contains(keyword)
                       );
                   },
                   sortMap: MasterMSevenDenomSortMap,
                   selector: x => x,
                   ct: ct
               );



        public async Task<(string? SeriesCode, int? DenoId, int? SeriesDenomId)> LookupDenomAsync(
            string m7DenomCode, string m7DenomName, int denomPrice)
        {
            var result = await _db.MasterMSevenDenom
                .AsNoTracking()
                .Include(m => m.MasterDenomination)
                .Include(m => m.MasterSeriesDenom)
                .Where(m => m.M7DenomCode == m7DenomCode
                         && m.M7DenomName == m7DenomName
                         && m.MasterDenomination.DenominationPrice == denomPrice
                         && m.IsActive == true)
                .Select(m => new
                {
                    m.MasterSeriesDenom.SeriesCode,
                    m.DenoId,
                    m.SeriesDenomId
                })
                .FirstOrDefaultAsync();

            if (result == null)
                return (null, null, null);

            return (result.SeriesCode, result.DenoId, result.SeriesDenomId);
        }

        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterMSevenDenom, object>>>
                MasterMSevenDenomSortMap
                    = new Dictionary<string, Expression<Func<MasterMSevenDenom, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["M7DenomId"] = x => x.M7DenomId,
                        ["DenoId"] = x => x.DenoId,
                        ["DenominationCode"] = x => x.MasterDenomination.DenominationCode,
                        ["DenominationDesc"] = x => x.MasterDenomination.DenominationDesc,
                        ["M7DenomCode"] = x => x.M7DenomCode,
                        ["M7DenomName"] = x => x.M7DenomName,
                        ["M7DenomDescrpt"] = x => x.M7DenomDescrpt,
                        ["M7DenomBms"] = x => x.M7DenomBms,
                        ["M7DnBms"] = x => x.M7DnBms,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
