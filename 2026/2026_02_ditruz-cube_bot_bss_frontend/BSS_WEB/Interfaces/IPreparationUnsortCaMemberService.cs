using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Preparation;

namespace BSS_WEB.Interfaces
{
    public interface IPreparationUnsortCaMemberService
    {
        Task<ApiResponse<PagedData<PreparationUnsortCaMemberResponse>>> GetPreparationUnsortCaMemberAsync(PagedRequest<PreparationUnsortCaMemberRequest> request);
        Task<BaseApiResponse<List<DeletePreparationUnsortCaMemberResponse>>> DeletePreparationUnsortCaMemberAsync(List<DeletePreparationUnsortCaMemberRequest> request);
        Task<BaseApiResponse<List<EditPreparationUnsortCaMemberResponse>>> EditPreparationUnsortCaMemberAsync(List<EditPreparationUnsortCaMemberRequest> request);
        Task<ApiResponse<TransactionContainerPrepareDisplay>?> CreatePreparationCaMemberContainer(CreateContainerBarcodeRequest request);
        Task<ApiResponse<BarcodePreviewDisplay>?> GetPreviewCaMemberGenerateBarcodeAsync(CreateContainerBarcodeRequest request);

    }
}
