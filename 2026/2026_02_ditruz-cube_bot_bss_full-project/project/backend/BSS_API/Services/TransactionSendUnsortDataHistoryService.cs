using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;

namespace BSS_API.Services
{
    public class TransactionSendUnsortDataHistoryService : ITransactionSendUnsortDataHistoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TransactionSendUnsortDataHistoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

    }
}
