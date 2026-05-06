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
    public class MasterBanknoteTypeSendRepository : GenericRepository<MasterBanknoteTypeSend>, IMasterBanknoteTypeSendRepository
    {
        private readonly ApplicationDbContext _db;
        public MasterBanknoteTypeSendRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
        private IQueryable<MasterBanknoteTypeSend> MasterBankNoteTypeSendQuery()
           => _dbSet
               .AsNoTracking();

        public Task<PagedData<MasterBanknoteTypeSend>> SearchBanknoteTypeSend(
           PagedRequest<MasterBanknoteTypeSendRequest> request,
           CancellationToken ct = default)
           => MasterBankNoteTypeSendQuery()
               .ToPagedDataAsync(
                   request: request,
                   applyFilter: (query, filter) =>
                   {
                       if (filter == null)
                           return query;



                       if (filter.BanknoteTypeSendId != null)
                           query = query.Where(x => x.BanknoteTypeSendId == filter.BanknoteTypeSendId);
                       if (!string.IsNullOrEmpty(filter.BanknoteTypeSendCode))
                           query = query.Where(x => x.BanknoteTypeSendCode == filter.BanknoteTypeSendCode);
                       if (!string.IsNullOrEmpty(filter.BssBntypeCode))
                           query = query.Where(x => x.BssBntypeCode == filter.BssBntypeCode);

                       if (filter.IsActive != null)
                           query = query.Where(x => (x.IsActive ?? false) == filter.IsActive);

                       return query;
                   },
                   applySearch: (query, keyword) =>
                   {
                       if (string.IsNullOrWhiteSpace(keyword))
                           return query;

                       return query.Where(x =>
                           x.BanknoteTypeSendCode.Contains(keyword)
                           || x.BssBntypeCode.Contains(keyword)
                           || (x.BanknoteTypeSendDesc ?? string.Empty).Contains(keyword)
                       );
                   },
                   sortMap: MasterBankNoteTypeSendSortMap,
                   selector: x => x,
                   ct: ct
               );



        private static readonly IReadOnlyDictionary<string, Expression<Func<MasterBanknoteTypeSend, object>>>
                MasterBankNoteTypeSendSortMap
                    = new Dictionary<string, Expression<Func<MasterBanknoteTypeSend, object>>>(StringComparer
                        .OrdinalIgnoreCase)
                    {
                        ["BanknoteTypeSendId"] = x => x.BanknoteTypeSendId,
                        ["BanknoteTypeSendCode"] = x => x.BanknoteTypeSendCode,
                        ["BssBntypeCode"] = x => x.BssBntypeCode,
                        ["BanknoteTypeSendDesc"] = x => x.BanknoteTypeSendDesc,
                        ["IsActive"] = x => x.IsActive
                    };
    }
}
