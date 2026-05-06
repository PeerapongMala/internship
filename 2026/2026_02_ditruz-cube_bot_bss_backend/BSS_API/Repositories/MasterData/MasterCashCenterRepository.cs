using BSS_API.Helpers;
using BSS_API.Models;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_API.Repositories.Common;
using BSS_API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Linq.Expressions;

namespace BSS_API.Repositories
{
    public class MasterCashCenterRepository : GenericRepository<MasterCashCenter>, IMasterCashCenterRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterCashCenterRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }


        public async Task<ICollection<MasterCashCenter>> GetMasterCashCenterWithSearchRequestAsync(
            SystemSearchRequest request)
        {
            return await _db.MasterCashCenters
                .AsNoTracking()
                .AsQueryable()
                .GenerateCondition(request)
                .Take(request.SelectItemCount)
                .ToListAsync();
        }

        private IQueryable<MasterCashCenter> MasterCashCenterQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterCashCenter>> SearchCashCenter(
           PagedRequest<MasterCashCenterRequest> request,
           CancellationToken ct = default)
           => MasterCashCenterQuery()
               .Include(x => x.MasterInstitution)
               .Include(x => x.MasterDepartment)
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.CashCenterId != null)
                           query = query.Where(x => x.CashCenterId == filter.CashCenterId);
                       if (filter.DepartmentId != null)
                           query = query.Where(x => x.DepartmentId == filter.DepartmentId);
                       if (filter.InstitutionId != null)
                           query = query.Where(x => x.InstitutionId == filter.InstitutionId);
                       if (!string.IsNullOrEmpty(filter.CashCenterCode))
                           query = query.Where(x => x.CashCenterCode == filter.CashCenterCode);


                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.CashCenterCode.Contains(keyword) || x.CashCenterName.Contains(keyword)
                       );
                   },
                   sortMap: MasterCashCenterSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterCashCenter, object>>>
                MasterCashCenterSortMap
                    = new Dictionary<string, Expression<Func<MasterCashCenter, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["CashCenterId"] = x => x.CashCenterId,
                        ["CashCenterCode"] = x => x.CashCenterCode,
                        ["CashCenterName"] = x => x.CashCenterName, 
                        ["DepartmentName"] = x => x.MasterDepartment.DepartmentName,
                        ["InstitutionNameTh"] = x => x.MasterInstitution.InstitutionNameTh,
                        ["InstitutionNameEn"] = x => x.MasterInstitution.InstitutionNameEn,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}