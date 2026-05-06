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
    public class MasterCompanyDepartmentRepository : GenericRepository<MasterCompanyDepartment>, IMasterCompanyDepartmentRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterCompanyDepartmentRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        private IQueryable<MasterCompanyDepartment> MasterCompanyDepartmentQuery()
               => _dbSet
                   .AsNoTracking();

        public Task<PagedData<MasterCompanyDepartment>> SearchMasterCompanyDepartment(
           PagedRequest<MasterCompanyDepartmentRequest> request,
           CancellationToken ct = default)
           => MasterCompanyDepartmentQuery()
               .Include(x => x.MasterCompany)
               .Include(x => x.MasterDepartment)
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;


                       if (filter.ComdeptId != null)
                           query = query.Where(x => x.ComdeptId == filter.ComdeptId);
                       if (filter.CompanyId != null)
                           query = query.Where(x => x.CompanyId == filter.CompanyId);
                       if (filter.DepartmentId != null)
                           query = query.Where(x => x.DepartmentId == filter.DepartmentId);
                       if (!string.IsNullOrEmpty(filter.CbBcdCode))
                           query = query.Where(x => x.CbBcdCode == filter.CbBcdCode);


                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);
                       if (filter.IsPrepareCentral != null)
                           query = query.Where(x => x.IsPrepareCentral == filter.IsPrepareCentral);
                       if (filter.IsSendUnsortCC != null)
                           query = query.Where(x => x.IsSendUnsortCC == filter.IsSendUnsortCC);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.CbBcdCode.Contains(keyword)
                           || x.MasterCompany.CompanyName.Contains(keyword)
                           || x.MasterDepartment.DepartmentName.Contains(keyword)
                       );
                   },
                   sortMap: MasterCompanyDepartmentSortMap,
                   selector: x => x,
                   ct: ct
               );

        public async Task<string> GetCbBcdCode(int departmentId, int institutionId)
        {
            var now = DateTime.Now;
            var result = string.Empty;
            var companyDept = await GetAsync(x => x.DepartmentId == departmentId
                                                        && x.IsActive == true
                                                        && DateTime.Now >= x.StartDate && DateTime.Now <= x.EndDate
                                                        && x.MasterCompany.IsActive == true
                                                        && x.MasterCompany.MasterCompanyInstitution.Any(x => x.InstId == institutionId
                                                                                                            && x.IsActive == true
                                                                                                            && x.MasterInstitution.IsActive == true
                                                                                                        )

                                                        , orderBy: x => x.OrderByDescending(o => o.StartDate));
            if (companyDept != null)
            {
                result = companyDept.CbBcdCode;
            }
            return result;
        }

        public async Task<string> GetCbBcdCode(int companyId)
        {
            var now = DateTime.Now;
            var result = string.Empty;
            var companyDept = await GetAsync(x => x.CompanyId == companyId
                                                        && x.IsActive == true
                                                        && DateTime.Now >= x.StartDate && DateTime.Now <= x.EndDate
                                                        , orderBy: x => x.OrderByDescending(o => o.StartDate));
            if (companyDept != null)
            {
                result = companyDept.CbBcdCode;
            }
            return result;
        }

        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterCompanyDepartment, object>>>
                MasterCompanyDepartmentSortMap
                    = new Dictionary<string, Expression<Func<MasterCompanyDepartment, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["ComdeptId"] = x => x.ComdeptId,
                        ["CompanyId"] = x => x.CompanyId,
                        ["CompanyCode"] = x => x.MasterCompany.CompanyCode,
                        ["CompanyName"] = x => x.MasterCompany.CompanyName,
                        ["DepartmentId"] = x => x.DepartmentId,
                        ["DepartmentName"] = x => x.MasterDepartment.DepartmentName,
                        ["DepartmentShortName"] = x => x.MasterDepartment.DepartmentShortName,
                        ["CbBcdCode"] = x => x.CbBcdCode,
                        ["StartDate"] = x => x.StartDate,
                        ["EndDate"] = x => x.EndDate,
                        ["IsPrepareCentral"] = x => x.IsPrepareCentral,
                        ["IsSendUnsortCC"] = x => x.IsSendUnsortCC,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
