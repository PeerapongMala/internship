using BSS_API.Helpers;
using BSS_API.Models;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_API.Repositories.Common;
using BSS_API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BSS_API.Repositories
{
    public class MasterInstitutionRepository : GenericRepository<MasterInstitution>, IMasterInstitutionRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterInstitutionRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
            _dbSet = db.Set<MasterInstitution>();
        }

        public async Task<MasterInstitution?> GetMasterInstitutionByCodeAsync(string institutionCode)
        {
            return await GetFirstOrDefaultAsNoTrackingAsync(mi => mi.InstitutionCode == institutionCode && mi.IsActive == true);
        }

        public async Task<MasterInstitution?> GetMasterInstitutionByInstIdAsync(int institutionId)
        {
            return await GetFirstOrDefaultAsNoTrackingAsync(mi => mi.InstitutionId == institutionId && mi.IsActive == true);
        }
        public async Task<ICollection<MasterInstitution>> GetMasterInstitutionWithSearchRequestAsync(
            SystemSearchRequest request)
        {
            return await _db.MasterInstitutions
                .AsNoTracking()
                .AsQueryable()
                .GenerateCondition(request)
                .Take(request.SelectItemCount)
                .ToListAsync();
        }
        private IQueryable<MasterInstitution> MasterInstitutionQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterInstitution>> SearchMasterInstitution(
           PagedRequest<MasterInstitutionRequest> request,
           CancellationToken ct = default)
           => MasterInstitutionQuery()
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.InstitutionId != null)
                           query = query.Where(x => x.InstitutionId == filter.InstitutionId);
 
                       if (!string.IsNullOrEmpty(filter.InstitutionCode))
                           query = query.Where(x => x.InstitutionCode == filter.InstitutionCode);
                       if (!string.IsNullOrEmpty(filter.BankCode))
                           query = query.Where(x => x.BankCode == filter.BankCode);


                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.InstitutionCode.Contains(keyword) 
                           || x.BankCode.Contains(keyword)
                           || x.InstitutionShortName.Contains(keyword)
                           || x.InstitutionNameTh.Contains(keyword)
                           || x.InstitutionNameEn.Contains(keyword)
                       );
                   },
                   sortMap: MasterInstitutionSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterInstitution, object>>>
                MasterInstitutionSortMap
                    = new Dictionary<string, Expression<Func<MasterInstitution, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["InstitutionId"] = x => x.InstitutionId,
                        ["InstitutionCode"] = x => x.InstitutionCode,
                        ["BankCode"] = x => x.BankCode,
                        ["InstitutionNameTh"] = x => x.InstitutionNameTh,
                        ["InstitutionShortName"] = x => x.InstitutionShortName,
                        ["InstitutionNameEn"] = x => x.InstitutionNameEn,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}