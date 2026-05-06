using BSS_API.Models;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Common;
using BSS_API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace BSS_API.Repositories
{
    public class MasterShiftRepository : GenericRepository<MasterShift>, IMasterShiftRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterShiftRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public async Task<IEnumerable<ShiftInfoData>> GetShiftInfoActiveAsync()
        {
            var now = DateTime.Now.TimeOfDay;
            var shifts = _db.MasterShifts.Where(w => w.IsActive == true)
                .AsEnumerable()     
                .Select(s => new ShiftInfoData
                {
                    ShiftId = s.ShiftId,
                    ShiftCode = s.ShiftCode,
                    ShiftName = s.ShiftName,
                    ShiftStartTimeText = s.ShiftStartTime,
                    ShiftEndTimeText = s.ShiftEndTime,
                    ShiftStartTime = TimeSpan.Parse(s.ShiftStartTime),
                    ShiftEndTime = TimeSpan.Parse(s.ShiftEndTime)
                })
                .Where(x =>
                    (x.ShiftStartTime < x.ShiftEndTime && now >= x.ShiftStartTime && now <= x.ShiftEndTime) ||
                    (x.ShiftStartTime > x.ShiftEndTime && (now >= x.ShiftStartTime || now <= x.ShiftEndTime))
                )
                .ToList();

            await Task.Delay(100);
            return shifts;
        }


        private IQueryable<MasterShift> MasterShiftQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterShift>> SearchMasterShift(
           PagedRequest<MasterShiftRequest> request,
           CancellationToken ct = default)
           => MasterShiftQuery()
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.ShiftId != null)
                           query = query.Where(x => x.ShiftId == filter.ShiftId);
                       if (!string.IsNullOrEmpty(filter.ShiftCode))
                           query = query.Where(x => x.ShiftCode == filter.ShiftCode);


                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.ShiftCode.Contains(keyword) 
                           || x.ShiftName.Contains(keyword)
                       );
                   },
                   sortMap: MasterShiftSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterShift, object>>>
                MasterShiftSortMap
                    = new Dictionary<string, Expression<Func<MasterShift, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["ShiftId"] = x => x.ShiftId,
                        ["ShiftCode"] = x => x.ShiftCode,
                        ["ShiftName"] = x => x.ShiftName,
                        ["ShiftStartTime"] = x => x.ShiftStartTime,
                        ["ShiftEndTime"] = x => x.ShiftEndTime,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
