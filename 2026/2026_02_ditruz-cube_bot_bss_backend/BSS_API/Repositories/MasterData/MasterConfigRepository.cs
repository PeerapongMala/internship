namespace BSS_API.Repositories
{
    using BSS_API.Models.Common;
    using BSS_API.Models.RequestModels;
    using BSS_API.Repositories.Common;
    using Helpers;
    using Interface;
    using Microsoft.EntityFrameworkCore;
    using Models;
    using Models.Entities;
    using Models.SearchParameter;
    using System.Linq.Expressions;

    public class MasterConfigRepository(ApplicationDbContext db)
        : GenericRepository<MasterConfig>(db), IMasterConfigRepository
    {
        private readonly ApplicationDbContext _db = db;

        private IQueryable<MasterConfig> Query()
            => _db.Set<MasterConfig>()
                .Include(x => x.ConfigType)
                .AsNoTracking();

        public Task<List<MasterConfig>> GetAllAsync(CancellationToken ct = default)
            => Query().ToListAsync(ct);

        public Task<List<MasterConfig>> GetByConfigTypeCodeAsync(string configTypeCode)
            => Query()
                .Where(x => x.ConfigType.ConfigTypeCode == configTypeCode)
                .ToListAsync();

        public async Task<ICollection<MasterConfig>> GetMasterConfigWithSearchRequestAsync(SystemSearchRequest request)
        {
            return await _db.MasterConfigs
                .Include(x => x.ConfigType)
                .AsQueryable()
                .AsNoTracking()
                .GenerateCondition(request)
                .Take(request.SelectItemCount)
                .ToListAsync();
        }

        private IQueryable<MasterConfig> MasterConfigQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterConfig>> SearchMasterConfig(
            PagedRequest<MasterConfigRequest> request,
            CancellationToken ct = default)
            => MasterConfigQuery()
                .Include(x => x.ConfigType)
                .ToPagedDataAsync(
                    request: request,
                    applyFilter: (query, filter) =>
                    {
                        if (filter == null)
                            return query;
                        
                        if (filter.ConfigTypeId != null)
                            query = query.Where(x => x.ConfigTypeId == filter.ConfigTypeId);

                        if (filter.IsActive != null)
                            query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                        return query;
                    },
                    applySearch: (query, keyword) =>
                    {
                        if (string.IsNullOrWhiteSpace(keyword))
                            return query;

                        return query.Where(x =>
                            x.ConfigCode.Contains(keyword)
                            || x.ConfigDesc.Contains(keyword)
                            || x.ConfigValue.Contains(keyword) 
                        );
                    },
                    sortMap: MasterConfigSortMap,
                    selector: x => x,
                    ct: ct
                );
        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterConfig, object>>>
                MasterConfigSortMap
                    = new Dictionary<string, Expression<Func<MasterConfig, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["ConfigId"] = x => x.ConfigId,
                        ["ConfigTypeId"] = x => x.ConfigTypeId,
                        ["ConfigCode"] = x => x.ConfigCode,
                        ["ConfigTypeDesc"] = x => x.ConfigType.ConfigTypeDesc, 
                        ["ConfigDesc"] = x => x.ConfigDesc,
                        ["ConfigValue"] = x => x.ConfigValue,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}