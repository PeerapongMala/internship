namespace BSS_API.Repositories
{
    using BSS_API.Models.Common;
    using BSS_API.Models.RequestModels;
    using BSS_API.Repositories.Common;
    using Interface;
    using Microsoft.EntityFrameworkCore;
    using Models;
    using Models.Entities;
    using System.Linq.Expressions;

    public class MasterConfigTypeRepository(ApplicationDbContext db)
        : GenericRepository<MasterConfigType>(db), IMasterConfigTypeRepository
    {
        private readonly ApplicationDbContext _db = db;


        private IQueryable<MasterConfigType> MasterConfigTypeQuery()
               => _dbSet
                   .AsNoTracking();

        public Task<PagedData<MasterConfigType>> SearchMasterConfigType(
           PagedRequest<MasterConfigTypeRequest> request,
           CancellationToken ct = default)
           => MasterConfigTypeQuery() 
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.ConfigTypeId != null)
                           query = query.Where(x => x.ConfigTypeId == filter.ConfigTypeId);
                       if (! string.IsNullOrEmpty(filter.ConfigTypeCode))
                           query = query.Where(x => x.ConfigTypeCode == filter.ConfigTypeCode);

                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.ConfigTypeCode.Contains(keyword)  
                           || x.ConfigTypeDesc.Contains(keyword)
                       );
                   },
                   sortMap: MasterConfigTypeSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterConfigType, object>>>
                MasterConfigTypeSortMap
                    = new Dictionary<string, Expression<Func<MasterConfigType, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["ConfigTypeId"] = x => x.ConfigTypeId,
                        ["ConfigTypeCode"] = x => x.ConfigTypeCode,
                        ["ConfigTypeDesc"] = x => x.ConfigTypeDesc,
                        ["IsActive"] = x => x.IsActive
                    };
    }


}