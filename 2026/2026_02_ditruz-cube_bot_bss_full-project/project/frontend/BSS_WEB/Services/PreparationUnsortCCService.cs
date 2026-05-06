using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Preparation;

namespace BSS_WEB.Services
{
    public class PreparationUnsortCcService : BaseApiClient , IPreparationUnsortCcService
    {
        public PreparationUnsortCcService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<PreparationUnsortCcService> logger)
         : base(client, logger, contextAccessor)
        {
        }

        public async Task<BaseApiResponse<List<CheckValidateTransactionUnSortCcResult>>> CheckValidateTransactionUnSortCc(CheckValidateTransactionUnSortCcRequest request)
        {
            return await SendAsync<BaseApiResponse<List<CheckValidateTransactionUnSortCcResult>>>(
                HttpMethod.Post,
                "api/PreparationUnsortCC/CheckValidateTransactionUnSortCc",
                request
            );
        }

        public async Task<ApiResponse<PagedData<PreparationUnsortCCResult>>> GetPreparationUnsortCCsDetailAsync(PagedRequest<PreparationUnsortCCRequest> request)
        {
            var result = await SendAsync<ApiResponse<PagedData<PreparationUnsortCCResult>>>(HttpMethod.Post, $"api/PreparationUnsortCC/GetPreparationUnsortCC", request);
            return result;
        }

        public async Task<BaseApiResponse<List<EditPreparationUnsortCcResponse>>> EditPreparationUnsortCcAsync(List<EditPreparationUnsortCcRequest> request)
        {
            return await SendAsync<BaseApiResponse<List<EditPreparationUnsortCcResponse>>>(
                HttpMethod.Put,
                "api/PreparationUnsortCC/Edit",
                request
            );
        }

        public async Task<BaseApiResponse<List<DeletePreparationUnsortCcResponse>>> DeletePreparationUnsortCcAsync(List<DeletePreparationUnsortCcRequest> request)
        {
            return await SendAsync<BaseApiResponse<List<DeletePreparationUnsortCcResponse>>>(
                HttpMethod.Delete,
                "api/PreparationUnsortCC/Delete",
                request
            );
        }

        public async Task<ApiResponse<BarcodePreviewDisplay>?> PreviewUnsortCCGenerateBarcodeAsync(CreateContainerBarcodeRequest request)
        {
            return await SendAsync<ApiResponse<BarcodePreviewDisplay>>(
                HttpMethod.Post,
                "api/PreparationUnsortCC/GetPreviewUnsortCCGenerateBarcode",
                request
            );
        }

        public async Task<ApiResponse<TransactionContainerPrepareDisplay>?> CreatePreparationUnsortCCContainer(CreateContainerBarcodeRequest request)
        {
            return await SendAsync<ApiResponse<TransactionContainerPrepareDisplay>>(
                HttpMethod.Post,
                "api/PreparationUnsortCC/CreatePreparationUnSortCcContainer",
                request
            );
        }

        public Task<ApiResponse<UnsortCCResponse>?> GetPreparationUnsortCCById(long unsortCCId)
        {
            return SendAsync<ApiResponse<UnsortCCResponse>>(
                HttpMethod.Get,
                $"api/PreparationUnsortCC/GetById/{unsortCCId}"
            );
        }

        public async Task<ApiResponse<TransactionContainerPrepareDisplay>?> GetExistingTransactionContainerPrepare(ExistingTransactionContainerPrepareRequest request)
        {
            return await SendAsync<ApiResponse<TransactionContainerPrepareDisplay>>(
                HttpMethod.Post,
                "api/PreparationUnsortCC/GetExistingTransactionContainerPrepare",
                request
            );
        }
    }
}
