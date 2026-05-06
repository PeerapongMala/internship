namespace BSS_API.Repositories
{
    using BSS_API.Models.Common;
    using BSS_API.Models.ObjectModels;
    using BSS_API.Models.RequestModels;
    using BSS_API.Repositories.Common;
    using Helpers;
    using Interface;
    using Microsoft.EntityFrameworkCore;
    using Models;
    using Models.Entities;
    using Models.SearchParameter;
    using System.Linq.Expressions;

    public class MasterCashPointRepository(ApplicationDbContext db)
        : GenericRepository<MasterCashPoint>(db), IMasterCashPointRepository
    {
        private readonly ApplicationDbContext _db = db;

        public async Task<List<MasterCashPoint>> GetMasterCashPointWithSearchRequestAsync(SystemSearchRequest request)
        {
            IQueryable<MasterCashPoint> query = _db.MasterCashPoints
                .AsQueryable()
                .AsNoTracking()
                .GenerateCondition(request);

            if (request.DepartmentId.HasValue)
            {
                query = query.Where(x => x.DepartmentId == request.DepartmentId);
            }
            
            return await query
                .Take(request.SelectItemCount)
                .ToListAsync();
        }

        private IQueryable<MasterCashPoint> MasterCashPointQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterCashPoint>> SearchMasterCashPoint(
           PagedRequest<MasterCashPointRequest> request,
           CancellationToken ct = default)
           => MasterCashPointQuery()
               .Include(x => x.MasterInstitution)
               .Include(x => x.MasterDepartment)
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.CashpointId != null)
                           query = query.Where(x => x.CashpointId == filter.CashpointId);
                       if (filter.DepartmentId != null)
                           query = query.Where(x => x.DepartmentId == filter.DepartmentId);
                       if (filter.InstitutionId != null)
                           query = query.Where(x => x.InstitutionId == filter.InstitutionId);
                       if (!string.IsNullOrEmpty(filter.BranchCode))
                           query = query.Where(x => x.BranchCode == filter.BranchCode);

                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.BranchCode.Contains(keyword) 
                           || x.CashpointName.Contains(keyword) 
                           || x.CbBcdCode.Contains(keyword)
                       );
                   },
                   sortMap: MasterCashPointSortMap,
                   selector: x => x,
                   ct: ct
               );

        

        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterCashPoint, object>>>
                MasterCashPointSortMap
                    = new Dictionary<string, Expression<Func<MasterCashPoint, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["CashpointId"] = x => x.CashpointId,
                        ["CashpointName"] = x => x.CashpointName,
                        ["BranchCode"] = x => x.BranchCode,
                        ["CbBcdCode"] = x => x.CbBcdCode,
                        ["DepartmentName"] = x => x.MasterDepartment.DepartmentName,
                        ["InstitutionNameTh"] = x => x.MasterInstitution.InstitutionNameTh,
                        ["InstitutionNameEn"] = x => x.MasterInstitution.InstitutionNameEn,
                        ["CbBcdCode"] = x => x.CbBcdCode,
                        ["IsActive"] = x => x.IsActive
                    };

        public async Task<List<MasterCashPointUnsortCcViewData>> GetMasterCashPointUnsortCcRequestAsync(SystemSearchRequest request)
        {
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
                from cp in _db.MasterCashPoints.AsNoTracking()
                join zcp in _db.MasterZoneCashpoints.AsNoTracking()
                    on cp.CashpointId equals zcp.CashpointId into zcpg
                from zcp in zcpg.DefaultIfEmpty()
                join z in _db.MasterZones.AsNoTracking()
                    on zcp.ZoneId equals z.ZoneId into zg
                from z in zg.DefaultIfEmpty()
                where
                    // department
                    (!request.DepartmentId.HasValue || cp.DepartmentId == request.DepartmentId.Value)

                    // instId
                    && (!instId.HasValue || cp.InstitutionId == instId.Value)

                    // cb_bcd_code
                    && cp.CbBcdCode == request.CbBcdCode

                    // (T1.is_active = 1 OR T1.is_active IS NULL)
                    && (cp.IsActive == true || cp.IsActive == null)

                    // (T2.is_active = 1 OR T2.is_active IS NULL)
                    && (zcp == null || zcp.IsActive == true || zcp.IsActive == null)

                    // (T3.is_active = 1 OR T3.is_active IS NULL)
                    && (z == null || z.IsActive == true || z.IsActive == null)

                orderby (z != null ? z.ZoneCode : "99")
                select new MasterCashPointUnsortCcViewData
                {
                    BranchCode = cp.BranchCode,
                    CashpointName = cp.CashpointName,
                    CashpointId = cp.CashpointId,
                    ZoneCode = z != null ? z.ZoneCode : "99",
                    DepartmentId = cp.DepartmentId,
                    CbBcdCode = cp.CbBcdCode
                };

            return await query.ToListAsync();
        }
    }
}
