namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;

    public class BssTransactionNotiRecipientRepository(ApplicationDbContext db)
        : GenericRepository<BssTransactionNotiRecipient>(db), IBssTransactionNotiRecipientRepository;
}