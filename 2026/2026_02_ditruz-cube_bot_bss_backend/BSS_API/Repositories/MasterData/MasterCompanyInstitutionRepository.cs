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
    public class MasterCompanyInstitutionRepository : GenericRepository<MasterCompanyInstitution>, IMasterCompanyInstitutionRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterCompanyInstitutionRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
            _dbSet = db.Set<MasterCompanyInstitution>();
        }

        public async Task<MasterCompanyInstitution?> GetByInstitutionByInstIdAsync(int companyId, int InstId)
        {
            return await _dbSet
                .FirstOrDefaultAsync(x => x.CompanyId == companyId && x.InstId == InstId);
        }
        private IQueryable<MasterCompanyInstitution> MasterCompanyInstitutionQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterCompanyInstitution>> SearchMasterCompanyInstitution(
           PagedRequest<MasterCompanyInstitutionRequest> request,
           CancellationToken ct = default)
                => MasterCompanyInstitutionQuery() 
               .Include(x=>x.MasterCompany)
               .Include(x=>x.MasterInstitution)
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.CompanyInstId != null)
                           query = query.Where(x => x.CompanyInstId == filter.CompanyInstId);
                       if (filter.CompanyId != null)
                           query = query.Where(x => x.CompanyId == filter.CompanyId);
                       if (filter.InstId != null)
                           query = query.Where(x => x.InstId == filter.InstId);


                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                            x.CbBcdCode.Contains(keyword)
                            || x.MasterCompany.CompanyCode.Contains(keyword) 
                            || x.MasterCompany.CompanyName.Contains(keyword)
                            || x.MasterInstitution.InstitutionCode.Contains(keyword)
                            || x.MasterInstitution.InstitutionNameTh.Contains(keyword)
                            || x.MasterInstitution.InstitutionNameEn.Contains(keyword)
                        ); 
                   },
                   sortMap: MasterCompanyInstitutionSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterCompanyInstitution, object>>>
                MasterCompanyInstitutionSortMap
                    = new Dictionary<string, Expression<Func<MasterCompanyInstitution, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["CompanyInstId"] = x => x.CompanyInstId,
                        ["CompanyId"] = x => x.CompanyId,
                        ["CompanyCode"] = x => x.MasterCompany.CompanyCode,
                        ["CompanyName"] = x => x.MasterCompany.CompanyName,
                        ["InstId"] = x => x.InstId,
                        ["CbBcdCode"] = x => x.CbBcdCode,
                        ["InstitutionCode"] = x => x.MasterInstitution.InstitutionCode,
                        ["InstitutionNameEn"] = x => x.MasterInstitution.InstitutionNameEn,
                        ["InstitutionNameTh"] = x => x.MasterInstitution.InstitutionNameTh,                        
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
