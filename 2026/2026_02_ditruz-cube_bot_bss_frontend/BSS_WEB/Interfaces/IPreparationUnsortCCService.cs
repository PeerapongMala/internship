using BSS_WEB.Models.Common;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Preparation;

namespace BSS_WEB.Interfaces
{
    public interface IPreparationUnsortCcService
    {
        Task<BaseApiResponse<List<CheckValidateTransactionUnSortCcResult>>> CheckValidateTransactionUnSortCc(CheckValidateTransactionUnSortCcRequest request);
        Task<ApiResponse<PagedData<PreparationUnsortCCResult>>> GetPreparationUnsortCCsDetailAsync(PagedRequest<PreparationUnsortCCRequest> request);
        Task<BaseApiResponse<List<EditPreparationUnsortCcResponse>>> EditPreparationUnsortCcAsync(List<EditPreparationUnsortCcRequest> request);
        Task<BaseApiResponse<List<DeletePreparationUnsortCcResponse>>> DeletePreparationUnsortCcAsync(List<DeletePreparationUnsortCcRequest> request);
        Task<ApiResponse<BarcodePreviewDisplay>?> PreviewUnsortCCGenerateBarcodeAsync(CreateContainerBarcodeRequest request);
        Task<ApiResponse<TransactionContainerPrepareDisplay>?> CreatePreparationUnsortCCContainer(CreateContainerBarcodeRequest request);

        Task<ApiResponse<UnsortCCResponse>?> GetPreparationUnsortCCById(long unsortCCId);
        Task<ApiResponse<TransactionContainerPrepareDisplay>?> GetExistingTransactionContainerPrepare(ExistingTransactionContainerPrepareRequest request);
    }
}
