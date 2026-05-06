using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Preparation;

namespace BSS_WEB.Interfaces
{
    public interface IPreparationUnfitService
    {
        Task<GetPreparationUnfitByDepartmentResult> GetPreparationUnfitByDepartmentAsyn(int departmentId);
        Task<GenerateDummyBarCodeResult> GenerateDummyBarCodeAsync(CreateDummyBarcodeRequest request);
        Task<BaseServiceResult> CreateContainerBarcodeAsync(SaveContainerPrepare request);
        Task<BaseServiceResult> CreatePreparationAsync(CreateTransactionPreparationRequest request);
        Task<BaseServiceResult> UpdatePreparationAsync(UpdateTransactionPreparationRequest request);
        Task<BaseServiceResult> RemovePreparationAsync(long prepareId);
        Task<GetAllPreparationResult> GetAllPreparationAsyn();
        Task<GetPreparationByIdResult> GetPreparationByIdAsync(long prepareId);

        Task<BaseServiceResult> CreateContainerPrepareAsync(CreateTransactionContainerPrepareRequest request);
        Task<BaseServiceResult> UpdateContainerPrepareAsync(UpdateTransactionContainerPrepareRequest request);
        Task<BaseServiceResult> RemoveContainerPrepareAsync(long Id);
        Task<GetAllContainerPrepareResult> GetAllContainerPrepareAsyn(int department);
        Task<GetContainerPrepareByIdResult> GetContainerPrepareByIdAsync(long containerPrepareId);
        Task<ValidateBarcodeResponse> ValidateBarcodeAsync(ValidateBarcodeRequest request);

        Task<BaseServiceResult> CreateReceiveCbmsDataAsync(CreateTransactionReceiveCbmsDataRequest request);
        Task<BaseServiceResult> UpdateReceiveCbmsDataAsync(UpdateTransactionReceiveCbmsDataRequest request);
        Task<BaseServiceResult> RemoveReceiveCbmsDataAsync(long Id);
        Task<GetAllReceiveCbmsDataResult> GetAllReceiveCbmsDataAsyn(int department);
        Task<GetReceiveCbmsDataByIdResult> GetReceiveCbmsDataByIdAsync(long receiveId);
        Task<ApiResponse<PagedData<PreparationUnfitResult>>> GetPreparationUnfitsAsync(PagedRequest<PreparationUnfitRequest> request);

        Task<GetCountPrepareByContainerResult?> GetCountPrepareByContainerAsync(CountPrepareByContainerRequest request);
        Task<GetCountReconcileResult?> GetCountReconcileAsync(GetCountReconcileRequest request);


        Task<BaseApiResponse<List<EditPreparationUnfitResponse>>> EditPreparationUnfitAsync(List<EditPreparationUnfitRequest> request);
        Task<BaseApiResponse<List<DeletePreparationUnfitResponse>>> DeletePreparationUnfitAsync(List<DeletePreparationUnfitRequest> request);

    }
}
