using BSS_API.Models;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Repositories.Common;
using BSS_API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BSS_API.Repositories
{
    public class MasterCompanyRepository : GenericRepository<MasterCompany>, IMasterCompanyRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterCompanyRepository(ApplicationDbContext db):base(db)
        {
            _db = db;
        }

        private IQueryable<MasterCompany> MasterCompanyQuery()
            => _dbSet
                .AsNoTracking();

        public Task<PagedData<MasterCompany>> SearchCompany(
            PagedRequest<MasterCompanyRequest> request,
            CancellationToken ct = default)
            => MasterCompanyQuery()
                .ToPagedDataAsync(
                    request: request,
                    applyFilter: (query, filter) =>
                    {
                        if (filter == null)
                            return query;

                        if (filter.IsActive != null)
                            query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);


                        return query;
                    },
                    applySearch: (query, keyword) =>
                    {
                        if (string.IsNullOrWhiteSpace(keyword))
                            return query;

                        return query.Where(x =>
                            x.CompanyCode.Contains(keyword) || x.CompanyName.Contains(keyword) 
                        );
                    },
                    sortMap: MasterCompanySortMap,
                    selector: x => x,
                    ct: ct
                );
        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterCompany, object>>>
                MasterCompanySortMap
                    = new Dictionary<string, Expression<Func<MasterCompany, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["CompanyId"] = x => x.CompanyId,
                        ["CompanyCode"] = x => x.CompanyCode,
                        ["CompanyName"] = x => x.CompanyName,
                        ["IsActive"] = x => x.IsActive
                    };
 
    }
}
