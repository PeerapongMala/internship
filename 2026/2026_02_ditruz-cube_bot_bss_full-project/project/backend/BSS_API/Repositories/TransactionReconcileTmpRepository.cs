namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;

    public class TransactionReconcileTmpRepository(ApplicationDbContext db)
        : GenericRepository<TransactionReconcileTmp>(db),
            ITransactionReconcileTmpRepository
    {
    }
}
