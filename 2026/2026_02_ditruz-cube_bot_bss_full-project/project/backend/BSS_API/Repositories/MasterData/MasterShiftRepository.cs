using BSS_API.Helpers;
using BSS_API.Models;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_API.Repositories.Common;
using BSS_API.Repositories.Interface;
using DocumentFormat.OpenXml.Spreadsheet;
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

        public async Task<IEnumerable<ShiftInfoData>> GetCurrentShiftAsync()
        {
            var queryData = await _db.MasterShifts
                 .AsNoTracking()
                .Where(x => x.IsActive == true)
                .OrderByDescending(x => x.CreatedDate)
                .Select(x => new ShiftInfoData
                {
                    ShiftId = x.ShiftId,
                    ShiftCode = x.ShiftCode,
                    ShiftName = x.ShiftName,
                    ShiftStartTimeText = x.ShiftStartTime,
                    ShiftEndTimeText = x.ShiftEndTime,
                    ShiftStartTime = TimeSpan.Parse(x.ShiftStartTime),
                    ShiftEndTime = TimeSpan.Parse(x.ShiftEndTime)
                }).ToListAsync();

            return queryData;
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


        public async Task<ICollection<MasterShift>> GetMasterShiftWithSearchRequestAsync(
            SystemSearchRequest request)
        {
            return await _db.MasterShifts
                .AsNoTracking()
                .AsQueryable()
                .GenerateCondition(request)
                .Take(request.SelectItemCount)
                .ToListAsync();
        }

        public async Task<int?> GetShiftByTimeAsync(TimeSpan time)
        {
            var shifts = await _db.MasterShifts
                .AsNoTracking()
                .Where(x => x.IsActive == true)
                .ToListAsync();

            foreach (var shift in shifts)
            {
                if (!TimeSpan.TryParse(shift.ShiftStartTime, out var start) ||
                    !TimeSpan.TryParse(shift.ShiftEndTime, out var end))
                    continue;

                // Handle overnight shifts (e.g. 22:00 ~ 06:00)
                if (start < end)
                {
                    if (time >= start && time <= end)
                        return shift.ShiftId;
                }
                else
                {
                    if (time >= start || time <= end)
                        return shift.ShiftId;
                }
            }

            return null;
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
