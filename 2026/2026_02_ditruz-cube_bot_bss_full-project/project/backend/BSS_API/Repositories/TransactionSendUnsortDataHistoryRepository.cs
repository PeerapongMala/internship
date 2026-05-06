using BSS_API.Models.Entities;
using BSS_API.Models;
using BSS_API.Repositories.Interface;

namespace BSS_API.Repositories
{
    public class TransactionSendUnsortDataHistoryRepository : GenericRepository<TransactionSendUnsortDataHistory>, ITransactionSendUnsortDataHistoryRepository
    {
        private readonly ApplicationDbContext _db;

        public TransactionSendUnsortDataHistoryRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
    }
}
