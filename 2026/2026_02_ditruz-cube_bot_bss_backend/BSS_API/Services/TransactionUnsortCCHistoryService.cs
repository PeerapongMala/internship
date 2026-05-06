using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;

namespace BSS_API.Services
{
    public class TransactionUnsortCCHistoryService : ITransactionUnsortCCHistoryService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TransactionUnsortCCHistoryService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

    }
}
