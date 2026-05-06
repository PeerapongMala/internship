using BSS_API.Models.Entities;
using BSS_API.Models;
using BSS_API.Repositories.Interface;

namespace BSS_API.Repositories
{
    public class TransactionUnsortCCHistoryRepository : GenericRepository<TransactionUnsortCCHistory>, ITransactionUnsortCCHistoryRepository
    {
        private readonly ApplicationDbContext _db;

        public TransactionUnsortCCHistoryRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
    }
}
