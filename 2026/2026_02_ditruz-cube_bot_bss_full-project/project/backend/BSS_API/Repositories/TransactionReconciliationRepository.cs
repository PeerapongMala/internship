namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;

    public class TransactionReconciliationRepository(ApplicationDbContext db)
        : GenericRepository<TransactionReconcile>(db),
            ITransactionReconciliationRepository
    {
    }
}
