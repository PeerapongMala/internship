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
    public class MasterCashTypeRepository : GenericRepository<MasterCashType>, IMasterCashTypeRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterCashTypeRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        private IQueryable<MasterCashType> MasterCashTypeQuery()
           => _dbSet
               .AsNoTracking();
        public Task<PagedData<MasterCashType>> SearchMasterCashType(
               PagedRequest<MasterCashTypeRequest> request,
               CancellationToken ct = default)
               => MasterCashTypeQuery() 
                   .ToPagedDataAsync(
                       request: request,
                       applyFilter: (query, filter) =>
                       {
                           if (filter == null)
                               return query;



                           if (filter.CashTypeId != null)
                               query = query.Where(x => x.CashTypeId == filter.CashTypeId);                           
                           if (!string.IsNullOrEmpty(filter.CashTypeCode))
                               query = query.Where(x => x.CashTypeCode == filter.CashTypeCode);


                           if (filter.IsActive != null)
                               query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                           return query;
                       },
                       applySearch: (query, keyword) =>
                       {
                           if (string.IsNullOrWhiteSpace(keyword))
                               return query;

                           return query.Where(x =>
                               x.CashTypeCode.Contains(keyword) || x.CashTypeName.Contains(keyword)
                           );
                       },
                       sortMap: MasterCashTypeSortMap,
                       selector: x => x,
                       ct: ct
                   );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterCashType, object>>>
                MasterCashTypeSortMap
                    = new Dictionary<string, Expression<Func<MasterCashType, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["CashTypeId"] = x => x.CashTypeId,
                        ["CashTypeCode"] = x => x.CashTypeCode,
                        ["CashTypeName"] = x => x.CashTypeName,
                        ["CashTypeDesc"] = x => x.CashTypeDesc,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
