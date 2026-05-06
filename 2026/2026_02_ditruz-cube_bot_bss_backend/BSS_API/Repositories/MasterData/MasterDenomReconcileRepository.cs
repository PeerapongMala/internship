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
    public class MasterDenomReconcileRepository : GenericRepository<MasterDenomReconcile>, IMasterDenomReconcileRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterDenomReconcileRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        private IQueryable<MasterDenomReconcile> MasterDenomReconcileQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterDenomReconcile>> SearchMasterDenomReconcile(
           PagedRequest<MasterDenomReconcileRequest> request,
           CancellationToken ct = default)
           => MasterDenomReconcileQuery()
               .Include(x => x.MasterDenomination)
               .Include(x => x.MasterDepartment)
               .Include(x => x.MasterSeriesDenom)
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.DenomReconcileId != null)
                           query = query.Where(x => x.DenomReconcileId == filter.DenomReconcileId);
                       if (filter.DenoId != null)
                           query = query.Where(x => x.DenoId == filter.DenoId);
                       if (filter.DepartmentId != null)
                           query = query.Where(x => x.DepartmentId == filter.DepartmentId);

                       if (filter.SeriesDenomId != null)
                           query = query.Where(x => x.SeriesDenomId == filter.SeriesDenomId);
                       if (filter.SeqNo != null)
                           query = query.Where(x => x.SeqNo == filter.SeqNo);

                       if (filter.IsDefault != null)
                           query = query.Where(x => x.IsDefault == filter.IsDefault);
                       if (filter.IsDisplay != null)
                           query = query.Where(x => x.IsDisplay == filter.IsDisplay);
                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                            x.MasterDenomination.DenominationCode.ToString().Contains(keyword)
                            || x.MasterDenomination.DenominationDesc.Contains(keyword)
                            || x.MasterSeriesDenom.SeriesCode.Contains(keyword)
                            || x.MasterSeriesDenom.SerieDescrpt.Contains(keyword)
                            || x.MasterDepartment.DepartmentCode.Contains(keyword)
                            || x.MasterDepartment.DepartmentName.Contains(keyword)
                            || x.MasterDepartment.DepartmentShortName.Contains(keyword)
                            );
                   },
                   sortMap: MasterDenomReconcileSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterDenomReconcile, object>>>
                MasterDenomReconcileSortMap
                    = new Dictionary<string, Expression<Func<MasterDenomReconcile, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["DenomReconcileId"] = x => x.DenomReconcileId,
                        ["DenoId"] = x => x.DenoId,
                        ["DenominationCode"] = x => x.MasterDenomination.DenominationCode,
                        ["DenominationDesc"] = x => x.MasterDenomination.DenominationDesc,
                        ["DepartmentId"] = x => x.DepartmentId,
                        ["DepartmentName"] = x => x.MasterDepartment.DepartmentName,
                        ["SeriesDenomId"] = x => x.SeriesDenomId,
                        ["SeriesCode"] = x => x.MasterSeriesDenom.SeriesCode,
                        ["SeqNo"] = x => x.SeqNo,
                        ["IsDefault"] = x => x.IsDefault,
                        ["IsDisplay"] = x => x.IsDisplay,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
