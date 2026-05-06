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
    public class MasterMSevenOutputRepository : GenericRepository<MasterMSevenOutput>, IMasterMSevenOutputRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterMSevenOutputRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        private IQueryable<MasterMSevenOutput> MasterMSevenOutputQuery()
   => _dbSet
       .AsNoTracking();

        public Task<PagedData<MasterMSevenOutput>> SearchMasterMSevenOutput(
           PagedRequest<MasterMSevenOutputRequest> request,
           CancellationToken ct = default)
           => MasterMSevenOutputQuery()
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.MSevenOutputId != null)
                           query = query.Where(x => x.MSevenOutputId == filter.MSevenOutputId);
 
                       if (!string.IsNullOrEmpty(filter.MSevenOutputCode))
                           query = query.Where(x => x.MSevenOutputCode == filter.MSevenOutputCode);


                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.MSevenOutputCode.Contains(keyword) 
                           || x.MSevenOutputDescrpt.Contains(keyword)
                       );
                   },
                   sortMap: MasterMSevenOutputSortMap,
                   selector: x => x,
                   ct: ct
               );



        public async Task<List<string>> GetActiveOutputCodesAsync()
        {
            return await _db.MasterMSevenOutputs
                .AsNoTracking()
                .Where(x => x.IsActive == true)
                .Select(x => x.MSevenOutputCode)
                .ToListAsync();
        }

        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterMSevenOutput, object>>>
                MasterMSevenOutputSortMap
                    = new Dictionary<string, Expression<Func<MasterMSevenOutput, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["MSevenOutputId"] = x => x.MSevenOutputId,
                        ["MSevenOutputCode"] = x => x.MSevenOutputCode,
                        ["MSevenOutputDescrpt"] = x => x.MSevenOutputDescrpt,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
