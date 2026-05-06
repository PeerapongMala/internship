using BSS_WEB.Models.Common;
using BSS_WEB.Models.ServiceModel.Preparation;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.DisplayModel;

namespace BSS_WEB.Interfaces
{
    public interface IPreparationUnsortCaNonMemberService
    {
        Task<BaseApiResponse<List<EditPreparationUnsortCaNonMemberResponse>>> EditPreparationUnsortCaNonMemberAsync(List<EditPreparationUnsortCaNonMemberRequest> request);
        Task<BaseApiResponse<List<DeletePreparationUnsortCaNonMemberResponse>>> DeletePreparationUnsortCaNonMemberAsync(List<DeletePreparationUnsortCaNonMemberRequest> request);
        Task<ApiResponse<PagedData<PreparationUnsortCaNonMemberResult>>> GetPreparationUnsortCaNonMemberAsync(PagedRequest<PreparationUnsortCaNonMemberRequest> request);
        Task<ApiResponse<BarcodePreviewDisplay>?> PreviewCaNonMemberGenerateBarcodeAsync(CreateContainerBarcodeRequest request);
        Task<ApiResponse<TransactionContainerPrepareDisplay>?> CreatePreparationCaNonMemberContainer(CreateContainerBarcodeRequest request);
        Task<ApiResponse<TransactionContainerPrepareDisplay>?> GetExistingTransactionContainerPrepare(ExistingTransactionContainerPrepareRequest request);
    }
}
