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
    public class MasterDepartmentRepository : GenericRepository<MasterDepartment>, IMasterDepartmentRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterDepartmentRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        private IQueryable<MasterDepartment> MasterDepartmentQuery()
            => _dbSet
                .AsNoTracking();

        public Task<PagedData<MasterDepartment>> SearchDepartment(
                PagedRequest<MasterDepartmentRequest> request,
                CancellationToken ct = default)
                => MasterDepartmentQuery()
                    .ToPagedDataAsync(
                        request: request,
                        applyFilter: (query, filter) =>
                        {
                            if (filter == null)
                                return query;
                            if (filter.DepartmentId != null)
                                query = query.Where(x => x.DepartmentId == filter.DepartmentId);

                            if (!string.IsNullOrEmpty(filter.DepartmentCode))
                                query = query.Where(x => x.DepartmentCode == filter.DepartmentCode);

                            if (filter.IsActive != null)
                                query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);


                            return query;
                        },
                        applySearch: (query, keyword) =>
                        {
                            if (string.IsNullOrWhiteSpace(keyword))
                                return query;

                            return query.Where(x =>
                                x.DepartmentCode.Contains(keyword) || x.DepartmentName.Contains(keyword)
                                    || x.DepartmentShortName.Contains(keyword)
                            );
                        },
                        sortMap: MasterDepartmentSortMap,
                        selector: x => x,
                        ct: ct
                    );

        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterDepartment, object>>>
                MasterDepartmentSortMap
                    = new Dictionary<string, Expression<Func<MasterDepartment, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["DepartmentId"] = x => x.DepartmentId,
                        ["DepartmentCode"] = x => x.DepartmentCode,
                        ["DepartmentName"] = x => x.DepartmentName,
                        ["DepartmentShortName"] = x => x.DepartmentShortName,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}