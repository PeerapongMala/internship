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
    public class MasterMachineRepository : GenericRepository<MasterMachine>, IMasterMachineRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterMachineRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task<List<MasterMachine>> GetMasterMachineWithSearchRequestAsync(SystemSearchRequest request)
        {
            return await _db.MasterMachine
                .AsQueryable()
                .AsNoTracking()
                .GenerateCondition(request)
                .Take(request.SelectItemCount)
                .ToListAsync();
        }
        public async Task<MasterMachine> GetById(int machineId)
        {
            return await _db.MasterMachine
                .Include(x => x.MasterDepartment)
                .Include(x => x.MasterMachineType)
                .AsNoTracking()
                .FirstAsync(x => x.MachineId == machineId);
        }

        private IQueryable<MasterMachine> MasterMachineQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterMachine>> SearchMasterMachine(
           PagedRequest<MasterMachineRequest> request,
           CancellationToken ct = default)
           => MasterMachineQuery()
               .Include(x=>x.MasterDepartment)
               .Include(x => x.MasterMachineType)
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.MachineId != null)
                           query = query.Where(x => x.MachineId == filter.MachineId);
                       if (filter.DepartmentId != null)
                           query = query.Where(x => x.DepartmentId == filter.DepartmentId);
                       if (filter.MachineTypeId != null)
                           query = query.Where(x => x.MachineTypeId == filter.MachineTypeId);
                       if (!string.IsNullOrEmpty(filter.MachineCode))
                           query = query.Where(x => x.MachineCode == filter.MachineCode);

                       if (filter.IsEmergency != null)
                           query = query.Where(x => x.IsEmergency == filter.IsEmergency);
                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.MachineName.Contains(keyword) 
                           || x.MachineCode.Contains(keyword)
                           || x.PathnameBss.Contains(keyword)
                       );
                   },
                   sortMap: MasterMachineSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterMachine, object>>>
                MasterMachineSortMap
                    = new Dictionary<string, Expression<Func<MasterMachine, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["MachineId"] = x => x.MachineId,
                        ["DepartmentId"] = x => x.DepartmentId,
                        ["DepartmentName"] = x => x.MasterDepartment.DepartmentName,
                        ["MachineTypeId"] = x => x.MachineTypeId,
                        ["MachineTypeName"] = x => x.MasterMachineType.MachineTypeName,
                        ["MachineCode"] = x => x.MachineCode,
                        ["MachineName"] = x => x.MachineName,
                        ["HcLength"] = x => x.HcLength,
                        ["PathnameBss"] = x => x.PathnameBss,
                        ["IsEmergency"] = x => x.IsEmergency,
                        ["IsActive"] = x => x.IsActive 
                    };
    }
}
