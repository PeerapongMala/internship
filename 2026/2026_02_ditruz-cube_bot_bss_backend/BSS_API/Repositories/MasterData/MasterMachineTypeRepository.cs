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
    public class MasterMachineTypeRepository : GenericRepository<MasterMachineType>, IMasterMachineTypeRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterMachineTypeRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        private IQueryable<MasterMachineType> MasterMachineTypeQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterMachineType>> SearchMasterMachineType(
           PagedRequest<MasterMachineTypeRequest> request,
           CancellationToken ct = default)
           => MasterMachineTypeQuery()
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.MachineTypeId != null)
                           query = query.Where(x => x.MachineTypeId == filter.MachineTypeId);
                       if (!string.IsNullOrEmpty(filter.MachineTypeCode))
                           query = query.Where(x => x.MachineTypeCode == filter.MachineTypeCode);


                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.MachineTypeCode.Contains(keyword) 
                           || x.MachineTypeName.Contains(keyword)
                       );
                   },
                   sortMap: MasterMachineTypeSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterMachineType, object>>>
                MasterMachineTypeSortMap
                    = new Dictionary<string, Expression<Func<MasterMachineType, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["MachineTypeId"] = x => x.MachineTypeId,
                        ["MachineTypeCode"] = x => x.MachineTypeCode,
                        ["MachineTypeName"] = x => x.MachineTypeName,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
