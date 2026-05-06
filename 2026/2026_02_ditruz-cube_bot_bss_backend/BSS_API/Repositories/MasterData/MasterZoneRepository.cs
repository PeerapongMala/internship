namespace BSS_API.Repositories
{
    using System.Linq.Expressions;
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

    public class MasterZoneRepository(ApplicationDbContext db)
        : GenericRepository<MasterZone>(db), IMasterZoneRepository
    {
        private readonly ApplicationDbContext _db = db;

        public IQueryable<MasterZone> GetQueryable()
        {
            return _db.Set<MasterZone>().AsQueryable();
        }

        public async Task<ICollection<MasterZone>> GetMasterZoneWithSearchRequestAsync(SystemSearchRequest request)
        {
            IQueryable<MasterZone> queryable = _db.MasterZones
                .AsNoTracking()
                .GenerateCondition(request)
                .AsQueryable();

            if (request.DepartmentId.HasValue)
            {
                queryable = queryable.Where(x => x.DepartmentId == request.DepartmentId);
            }
            
            return await queryable
                .Take(request.SelectItemCount)
                .ToListAsync();
        }

        private IQueryable<MasterZone> MasterZoneQuery()
                => _dbSet
                .AsNoTracking();

        public Task<PagedData<MasterZone>> SearchMasterZone(
           PagedRequest<MasterZoneRequest> request,
           CancellationToken ct = default)
           => MasterZoneQuery()
               .Include(x=>x.MasterDepartment)
               .Include(x => x.MasterInstitution)
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.ZoneId != null)
                           query = query.Where(x => x.ZoneId == filter.ZoneId);
                       if (filter.DepartmentId != null)
                           query = query.Where(x => x.DepartmentId == filter.DepartmentId);
                       if (filter.InstId != null)
                           query = query.Where(x => x.InstId == filter.InstId);
                       if (!string.IsNullOrEmpty(filter.ZoneCode))
                           query = query.Where(x => x.ZoneCode == filter.ZoneCode);


                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.ZoneCode.Contains(keyword) 
                           || x.ZoneName.Contains(keyword)
                           || x.ZoneName.Contains(keyword)
                           || x.CbBcdCode.Contains(keyword)
                       );
                   },
                   sortMap: MasterZoneSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterZone, object>>>
                MasterZoneSortMap
                    = new Dictionary<string, Expression<Func<MasterZone, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["ZoneId"] = x => x.ZoneId,
                        ["DepartmentId"] = x => x.DepartmentId,
                        ["DepartmentName"] = x => x.MasterDepartment.DepartmentName,
                        ["InstId"] = x => x.InstId,
                        ["InstitutionNameTh"] = x => x.MasterInstitution.InstitutionNameTh,
                        ["InstitutionNameEn"] = x => x.MasterInstitution.InstitutionNameEn,
                        ["ZoneCode"] = x => x.ZoneCode,
                        ["ZoneName"] = x => x.ZoneName,
                        ["CbBcdCode"] = x => x.CbBcdCode,
                        ["IsActive"] = x => x.IsActive
                    };

        public async Task<List<MasterZoneUnsortCcViewData>> GetMasterZoneUnsortCcRequestAsync(SystemSearchRequest request)
        {
            int? instId = null;

            var instCond = request.SearchCondition?
                .FirstOrDefault(c =>
                    string.Equals(c.ColumnName, "InstId", StringComparison.OrdinalIgnoreCase)
                    && c.FilterValue != null);

            if (instCond != null)
                instId = Convert.ToInt32(instCond.FilterValue);

            var defaultZoneId = await _db.MasterZones
                .AsNoTracking()
                .Where(z =>
                    z.DepartmentId == request.DepartmentId &&
                    z.ZoneCode == "99" &&
                    z.CbBcdCode == request.CbBcdCode)
                .Select(z => (long?)z.ZoneId)
                .FirstOrDefaultAsync() ?? 0L;

            var query =
                from cp in _db.MasterCashPoints.AsNoTracking()
                join zcp in _db.MasterZoneCashpoints.AsNoTracking()
                    on cp.CashpointId equals zcp.CashpointId into zcpg
                from zcp in zcpg.DefaultIfEmpty()
                join z in _db.MasterZones.AsNoTracking()
                    on zcp.ZoneId equals z.ZoneId into zg
                from z in zg.DefaultIfEmpty()
                where
                    cp.DepartmentId == request.DepartmentId
                    && (cp.IsActive == true || cp.IsActive == null)
                    && (zcp == null || zcp.IsActive == true || zcp.IsActive == null)
                    && (z == null || z.IsActive == true || z.IsActive == null)
                    && (!instId.HasValue ||
                        cp.InstitutionId == instId.Value ||
                        cp.InstitutionId == null)
                    && cp.CbBcdCode == request.CbBcdCode

                select new
                {
                    ZoneId = z != null ? (long)z.ZoneId : defaultZoneId,
                    ZoneName = z != null ? z.ZoneName : null,
                    ZoneCode = z != null ? z.ZoneCode : null,
                    cp.DepartmentId,
                    cp.CbBcdCode
                };

            var result = await query
                .GroupBy(x => new
                {
                    x.ZoneId,
                    x.ZoneName,
                    x.ZoneCode,
                    x.DepartmentId,
                    x.CbBcdCode
                })
                .Select(g => new MasterZoneUnsortCcViewData
                {
                    ZoneId = g.Key.ZoneId,
                    ZoneName = g.Key.ZoneName ?? "ไม่มีการจัดการแบบโซน",
                    ZoneCode = g.Key.ZoneCode ?? "99",
                    DepartmentId = g.Key.DepartmentId,
                    CbBcdCode = g.Key.CbBcdCode
                })
                .ToListAsync();

            return result;
        }
    }
}