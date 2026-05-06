using BSS_API.Models.Entities;
using BSS_API.Models;
using BSS_API.Repositories.Interface;

namespace BSS_API.Repositories
{
    public class MasterUserHistoryRepository : GenericRepository<MasterUserHistory>, IMasterUserHistoryRepository
    {
        private readonly ApplicationDbContext _db;
        public MasterUserHistoryRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }
    }
}
