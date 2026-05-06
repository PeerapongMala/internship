namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;

    public class TransactionMachineHdDataRepository(ApplicationDbContext db)
        : GenericRepository<TransactionMachineHdData>(db),
            ITransactionMachineHdDataRepository
    {
    }
}
