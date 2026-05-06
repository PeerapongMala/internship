namespace BSS_API.Services
{
    using Interface;
    using BSS_API.Repositories.Interface;
    
    public class TransactionSendUnsortCCHistoryService(IUnitOfWork unitOfWork) : ITransactionSendUnsortCCHistoryService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;
    }
}
