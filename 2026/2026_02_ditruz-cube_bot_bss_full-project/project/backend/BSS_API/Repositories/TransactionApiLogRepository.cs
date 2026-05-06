namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;
    
    public class TransactionApiLogRepository(ApplicationDbContext db)
        : GenericRepository<TransactionApiLog>(db), ITransactionApiLogRepository
    {
    }
}