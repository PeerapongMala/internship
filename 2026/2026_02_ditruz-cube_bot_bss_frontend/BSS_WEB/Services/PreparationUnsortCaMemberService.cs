using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Preparation;

namespace BSS_WEB.Services
{
    public class PreparationUnsortCaMemberService :BaseApiClient,  IPreparationUnsortCaMemberService
    {

        public PreparationUnsortCaMemberService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<PreparationUnsortCaMemberService> logger)
           : base(client, logger, contextAccessor)
        {
        }
        public async Task<ApiResponse<PagedData<PreparationUnsortCaMemberResponse>>> GetPreparationUnsortCaMemberAsync(PagedRequest<PreparationUnsortCaMemberRequest> request)
        {
            return await SendAsync<ApiResponse<PagedData<PreparationUnsortCaMemberResponse>>>(HttpMethod.Post, $"api/PreparationUnsortCaMember/GetPreparationUnsortCaMember", request); 
        }

        public async Task<BaseApiResponse<List<DeletePreparationUnsortCaMemberResponse>>> DeletePreparationUnsortCaMemberAsync(List<DeletePreparationUnsortCaMemberRequest> request)
        {
            return await SendAsync<BaseApiResponse<List<DeletePreparationUnsortCaMemberResponse>>>(
                HttpMethod.Delete,
                "api/PreparationUnsortCaMember/Delete",
                request
            );
        }

        public async Task<BaseApiResponse<List<EditPreparationUnsortCaMemberResponse>>> EditPreparationUnsortCaMemberAsync(List<EditPreparationUnsortCaMemberRequest> request)
        {
            return await SendAsync<BaseApiResponse<List<EditPreparationUnsortCaMemberResponse>>>(
                HttpMethod.Put,
                "api/PreparationUnsortCaMember/Edit",
                request
            );
        }

        public async Task<ApiResponse<TransactionContainerPrepareDisplay>?> CreatePreparationCaMemberContainer(CreateContainerBarcodeRequest request)
        {
            return await SendAsync<ApiResponse<TransactionContainerPrepareDisplay>>(
                HttpMethod.Post,
                "api/PreparationUnsortCaMember/CreatePreparationCaMemberContainer",
                request
            );
        }

        public async Task<ApiResponse<BarcodePreviewDisplay>?> GetPreviewCaMemberGenerateBarcodeAsync(CreateContainerBarcodeRequest request)
        {
            return await SendAsync<ApiResponse<BarcodePreviewDisplay>>(
                HttpMethod.Post,
                "api/PreparationUnsortCaMember/GetPreviewCaMemberGenerateBarcode",
                request
            );
        }

    }
}
