using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Preparation;
using BSS_WEB.Models.ServiceModel.ReceiveCbmsTransaction;

namespace BSS_WEB.Services
{
    public class ReceiveCbmsTransactionService : BaseApiClient, IReceiveCbmsTransactionService
    {
        public ReceiveCbmsTransactionService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<ReceiveCbmsTransactionService> logger) 
            : base(client, logger, contextAccessor)
        {
        }
        public async Task<BaseServiceResult> CreateReceiveCbmsDataAsync(CreateTransactionReceiveCbmsDataRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/ReceiveCbmsTransaction/CreateReceiveCbmsData", request);
        }

        public async Task<BaseServiceResult> UpdateReceiveCbmsDataAsync(UpdateTransactionReceiveCbmsDataRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/ReceiveCbmsTransaction/UpdateReceiveCbmsData", request);
        }

        public async Task<BaseServiceResult> RemoveReceiveCbmsDataAsync(long Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/ReceiveCbmsTransaction/RemoveReceiveCbmsData?Id={Id}");
        }

        public async Task<GetAllReceiveCbmsDataResult> GetAllReceiveCbmsDataAsyn(int department)
        {
            return await SendAsync<GetAllReceiveCbmsDataResult>(HttpMethod.Get, $"api/ReceiveCbmsTransaction/GetAllReceiveCbmsData?department={department}");
        }

        public async Task<GetReceiveCbmsDataByIdResult> GetReceiveCbmsDataByIdAsync(long receiveId)
        {
            return await SendAsync<GetReceiveCbmsDataByIdResult>(HttpMethod.Get, $"api/ReceiveCbmsTransaction/GetReceiveCbmsDataById?receiveId={receiveId}");
        }


        public async Task<CheckReceiveCbmsTransactionResult> CheckReceiveCbmsTransactionAsync(CheckReceiveCbmsTransactionRequest request)
        {
            return await SendAsync<CheckReceiveCbmsTransactionResult>(HttpMethod.Post, $"api/ReceiveCbmsTransaction/CheckReceiveCbmsTransaction", request);
        }

        public async Task<BaseServiceResult> ReceiveCbmsIncreaseRemainingQtyAsync(UpdateRemainingQtyRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/ReceiveCbmsTransaction/ReceiveCbmsIncreaseRemainingQty", request);
        }

        public async Task<BaseServiceResult> ReceiveCbmsReduceRemainingQtyAsync(UpdateRemainingQtyRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/ReceiveCbmsTransaction/ReceiveCbmsReduceRemainingQty", request);
        }

        public async Task<ApiResponse<List<TransactionReceiveCbmsViewData>>?> ReceiveCbmsDataTransactionAsync(GetReceiveCbmsTransactionWithConditionRequest request)
        {
            return await SendAsync<ApiResponse<List<TransactionReceiveCbmsViewData>>?>(HttpMethod.Get, $"api/ReceiveCbmsTransaction/ReceiveCbmsWithCondition?{request.ToQueryParamStringSkipEmpty()}");
        }
        public async Task<ApiResponse<List<TransactionReceiveCbmsViewData>>?> ValidateCbmsDataTransactionAsync(ValidateCbmsDataRequest request)
        {
            return await SendAsync<ApiResponse<List<TransactionReceiveCbmsViewData>>?>(HttpMethod.Post, $"api/ReceiveCbmsTransaction/ValidateCbmsData", request);
        }
    }
}
