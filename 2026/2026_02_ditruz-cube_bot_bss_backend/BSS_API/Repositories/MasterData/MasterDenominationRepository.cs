using BSS_API.Helpers;
using BSS_API.Models;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_API.Repositories.Common;
using BSS_API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BSS_API.Repositories
{
    public class MasterDenominationRepository : GenericRepository<MasterDenomination>, IMasterDenominationRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterDenominationRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task<ICollection<MasterDenomination>> GetMasterDenominationWithSearchRequestAsync(
            SystemSearchRequest request)
        {
            return await _db.MasterDenominations
                .AsNoTracking()
                .AsQueryable()
                .GenerateCondition(request)
                .Take(request.SelectItemCount)
                .ToListAsync();
        }

        private IQueryable<MasterDenomination> MasterDenominationQuery()
               => _dbSet
                   .AsNoTracking();

        public Task<PagedData<MasterDenomination>> SearchMasterDenomination(
           PagedRequest<MasterDenominationRequest> request,
           CancellationToken ct = default)
           => MasterDenominationQuery() 
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.DenominationId != null)
                           query = query.Where(x => x.DenominationId == filter.DenominationId);
                       if (filter.DenominationCode != null)
                           query = query.Where(x => x.DenominationCode == filter.DenominationCode);


                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                            x.DenominationDesc.Contains(keyword)
                            || x.DenominationCurrency.Contains(keyword)
                       );
                   },
                   sortMap: MasterDenominationSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterDenomination, object>>>
                MasterDenominationSortMap
                    = new Dictionary<string, Expression<Func<MasterDenomination, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["DenominationId"] = x => x.DenominationId,
                        ["DenominationCode"] = x => x.DenominationCode,
                        ["DenominationPrice"] = x => x.DenominationPrice,
                        ["DenominationPrice"] = x => x.DenominationPrice,
                        ["DenominationDesc"] = x => x.DenominationDesc,
                        ["DenominationCurrency"] = x => x.DenominationCurrency,
                        ["IsActive"] = x => x.IsActive
                    };

        public async Task<List<MasterDenoUnsortCcViewData>> GetDenominationUnsortCcRequestAsync(SystemSearchRequest request)
        {
            int? registerId = null;
            var registerCond = request.SearchCondition?
                .FirstOrDefault(c =>
                    string.Equals(c.ColumnName, "UnsortCcId", StringComparison.OrdinalIgnoreCase)
                    && c.FilterValue != null);
            if (registerCond != null)
            {
                registerId = Convert.ToInt32(registerCond.FilterValue);
            }

            int? instId = null;
            var instCond = request.SearchCondition?
                .FirstOrDefault(c =>
                    string.Equals(c.ColumnName, "InstId", StringComparison.OrdinalIgnoreCase)
                    && c.FilterValue != null);
            if (instCond != null)
            {
                instId = Convert.ToInt32(instCond.FilterValue);
            }

            var query =
                from d in _db.MasterDenominations.AsNoTracking()
                join t in _db.TransactionUnsortCCs.AsNoTracking()
                    on d.DenominationId equals t.DenoId into tg
                from t in tg.DefaultIfEmpty()
                where
                    (!registerId.HasValue || t.RegisterUnsortId == registerId.Value)
                    && (!instId.HasValue || t.InstId == instId.Value)
                    && (t == null || t.RemainingQty != 0)
                select new MasterDenoUnsortCcViewData
                {
                    DenoId = d.DenominationId,
                    DenoPrice = d.DenominationPrice
                };

            return await query.ToListAsync();
        }
    }
}