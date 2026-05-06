using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Preparation;
using BSS_WEB.Models.ServiceModel.ReceiveCbmsTransaction;

namespace BSS_WEB.Interfaces
{
    public interface IReceiveCbmsTransactionService
    {
        Task<BaseServiceResult> CreateReceiveCbmsDataAsync(CreateTransactionReceiveCbmsDataRequest request);
        Task<BaseServiceResult> UpdateReceiveCbmsDataAsync(UpdateTransactionReceiveCbmsDataRequest request);
        Task<BaseServiceResult> RemoveReceiveCbmsDataAsync(long Id);
        Task<GetAllReceiveCbmsDataResult> GetAllReceiveCbmsDataAsyn(int department);
        Task<GetReceiveCbmsDataByIdResult> GetReceiveCbmsDataByIdAsync(long receiveId);

        Task<CheckReceiveCbmsTransactionResult> CheckReceiveCbmsTransactionAsync(CheckReceiveCbmsTransactionRequest request);
        Task<BaseServiceResult> ReceiveCbmsIncreaseRemainingQtyAsync(UpdateRemainingQtyRequest request);
        Task<BaseServiceResult> ReceiveCbmsReduceRemainingQtyAsync(UpdateRemainingQtyRequest request);
        Task<ApiResponse<List<TransactionReceiveCbmsViewData>>?> ReceiveCbmsDataTransactionAsync(GetReceiveCbmsTransactionWithConditionRequest request);
        Task<ApiResponse<List<TransactionReceiveCbmsViewData>>?> ValidateCbmsDataTransactionAsync(ValidateCbmsDataRequest request);
    }
}
