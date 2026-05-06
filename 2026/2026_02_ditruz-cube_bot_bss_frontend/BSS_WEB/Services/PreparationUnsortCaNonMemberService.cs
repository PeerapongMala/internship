using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Preparation;

namespace BSS_WEB.Services
{
    public class PreparationUnsortCaNonMemberService : BaseApiClient, IPreparationUnsortCaNonMemberService
    {
        public PreparationUnsortCaNonMemberService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<PreparationUnsortCaNonMemberService> logger)
           : base(client, logger, contextAccessor)
        {
        }

        public async Task<BaseApiResponse<List<DeletePreparationUnsortCaNonMemberResponse>>> DeletePreparationUnsortCaNonMemberAsync(List<DeletePreparationUnsortCaNonMemberRequest> request)
        {
            return await SendAsync<BaseApiResponse<List<DeletePreparationUnsortCaNonMemberResponse>>>(
                HttpMethod.Delete,
                "api/PreparationUnsortCaNonMember/Delete",
                request
            );
        }

        public async Task<BaseApiResponse<List<EditPreparationUnsortCaNonMemberResponse>>> EditPreparationUnsortCaNonMemberAsync(List<EditPreparationUnsortCaNonMemberRequest> request)
        {
            return await SendAsync<BaseApiResponse<List<EditPreparationUnsortCaNonMemberResponse>>>(
                HttpMethod.Put,
                "api/PreparationUnsortCaNonMember/Edit",
                request
            );
        }

        public async Task<ApiResponse<PagedData<PreparationUnsortCaNonMemberResult>>> GetPreparationUnsortCaNonMemberAsync(PagedRequest<PreparationUnsortCaNonMemberRequest> request)
        {
            var result = await SendAsync<ApiResponse<PagedData<PreparationUnsortCaNonMemberResult>>>(HttpMethod.Post, $"api/PreparationUnsortCaNonMember/GetPreparationUnsortCaNonMember", request);
            return result;
        }

        public async Task<ApiResponse<BarcodePreviewDisplay>?> PreviewCaNonMemberGenerateBarcodeAsync(CreateContainerBarcodeRequest request)
        {
            return await SendAsync<ApiResponse<BarcodePreviewDisplay>>(
                HttpMethod.Post,
                "api/PreparationUnsortCaNonMember/GetPreviewCaNonMemberGenerateBarcode",
                request
            );
        }

        public async Task<ApiResponse<TransactionContainerPrepareDisplay>?> CreatePreparationCaNonMemberContainer(CreateContainerBarcodeRequest request)
        {
            return await SendAsync<ApiResponse<TransactionContainerPrepareDisplay>>(
                HttpMethod.Post,
                "api/PreparationUnsortCaNonMember/CreatePreparationCaNonMemberContainer",
                request
            );
        }

        public async Task<ApiResponse<TransactionContainerPrepareDisplay>?> GetExistingTransactionContainerPrepare(ExistingTransactionContainerPrepareRequest request)
        {
            return await SendAsync<ApiResponse<TransactionContainerPrepareDisplay>>(
                HttpMethod.Post,
                "api/PreparationUnsortCaNonMember/GetExistingTransactionContainerPrepare",
                request
            );
        }
    }
}
