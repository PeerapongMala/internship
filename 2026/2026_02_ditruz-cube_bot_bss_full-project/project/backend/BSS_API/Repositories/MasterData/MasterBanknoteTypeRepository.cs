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
    public class MasterBanknoteTypeRepository : GenericRepository<MasterBanknoteType>, IMasterBanknoteTypeRepository
    {
        private readonly ApplicationDbContext _db;
        public MasterBanknoteTypeRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        private IQueryable<MasterBanknoteType> MasterBanknoteTypeQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterBanknoteType>> SearchBanknoteType(
           PagedRequest<MasterBankNoteTypeRequest> request,
           CancellationToken ct = default)
           => MasterBanknoteTypeQuery()
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.BanknoteTypeId != null)
                           query = query.Where(x => x.BanknoteTypeId == filter.BanknoteTypeId);
                       if (!string.IsNullOrEmpty(filter.BanknoteTypeCode))
                           query = query.Where(x => x.BanknoteTypeCode == filter.BanknoteTypeCode);
                       if (!string.IsNullOrEmpty(filter.BssBanknoteTypeCode))
                           query = query.Where(x => x.BssBanknoteTypeCode == filter.BssBanknoteTypeCode);

                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);
                       if (filter.IsDisplay != null)
                           query = query.Where(x => (x.IsDisplay ?? false) == filter.IsDisplay);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.BanknoteTypeCode.Contains(keyword)
                           || x.BanknoteTypeName.Contains(keyword)
                           || (x.BanknoteTypeDesc ?? string.Empty).Contains(keyword)
                           || x.BssBanknoteTypeCode.Contains(keyword)
                       );
                   },
                   sortMap: MasterBankNoteTypeSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterBanknoteType, object>>>
                MasterBankNoteTypeSortMap
                    = new Dictionary<string, Expression<Func<MasterBanknoteType, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["BanknoteTypeId"] = x => x.BanknoteTypeId,
                        ["BanknoteTypeCode"] = x => x.BanknoteTypeCode,
                        ["BssBanknoteTypeCode"] = x => x.BssBanknoteTypeCode,
                        ["BanknoteTypeDesc"] = x => x.BanknoteTypeDesc,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
