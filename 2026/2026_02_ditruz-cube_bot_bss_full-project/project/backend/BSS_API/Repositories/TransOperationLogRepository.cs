using BSS_API.Models;
using BSS_API.Models.Entities;
using BSS_API.Repositories.Interface;

namespace BSS_API.Repositories
{
    public class TransOperationLogRepository : GenericRepository<TransOperationLog> , ITransOperationLogRepository
    {
        private readonly ApplicationDbContext _db;

        public TransOperationLogRepository(ApplicationDbContext db) : base(db) 
        {
            _db = db;
        }
    }
}
