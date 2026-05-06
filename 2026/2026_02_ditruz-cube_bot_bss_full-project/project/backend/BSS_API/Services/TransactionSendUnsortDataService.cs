using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;

namespace BSS_API.Services
{
    public class TransactionSendUnsortDataService : ITransactionSendUnsortDataService
    {
        private readonly IUnitOfWork _unitOfWork;

        public TransactionSendUnsortDataService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

    }
}
