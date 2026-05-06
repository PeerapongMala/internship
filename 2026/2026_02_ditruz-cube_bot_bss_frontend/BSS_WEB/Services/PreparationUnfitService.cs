using BSS_WEB.Interfaces;
using BSS_WEB.Models.Common;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using BSS_WEB.Models.ServiceModel.Preparation;

namespace BSS_WEB.Services
{
    public class PreparationUnfitService : BaseApiClient, IPreparationUnfitService
    {
        public PreparationUnfitService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<PreparationUnfitService> logger)
            :base(client, logger, contextAccessor)
        {
        }

        #region DummyBarcode

        public async Task<GenerateDummyBarCodeResult> GenerateDummyBarCodeAsync(CreateDummyBarcodeRequest request)
        {
            return await SendAsync<GenerateDummyBarCodeResult>(HttpMethod.Post, $"api/PreparationUnfit/GenerateDummyBarCode", request);
        }

        #endregion DummyBarcode

        public async Task<GetPreparationUnfitByDepartmentResult> GetPreparationUnfitByDepartmentAsyn(int departmentId)
        {
            return await SendAsync<GetPreparationUnfitByDepartmentResult>(HttpMethod.Get, $"api/PreparationUnfit/GetUnfit?departmentId={departmentId}");
        }



        public async Task<BaseServiceResult> CreatePreparationAsync(CreateTransactionPreparationRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/PreparationUnfit/CreatePreparation", request);
        }

        public async Task<BaseServiceResult> UpdatePreparationAsync(UpdateTransactionPreparationRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/PreparationUnfit/UpdatePreparation", request);
        }

        public async Task<BaseServiceResult> RemovePreparationAsync(long prepareId)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/PreparationUnfit/RemovePreparation?Id={prepareId}");
        }

        public async Task<GetAllPreparationResult> GetAllPreparationAsyn()
        {
            return await SendAsync<GetAllPreparationResult>(HttpMethod.Get, $"api/PreparationUnfit/GetAllPreparation");
        }

        public async Task<GetPreparationByIdResult> GetPreparationByIdAsync(long prepareId)
        {
            return await SendAsync<GetPreparationByIdResult>(HttpMethod.Get, $"api/PreparationUnfit/GetPreparationById?prepareId={prepareId}");

        }

        public async Task<BaseServiceResult> CreateContainerPrepareAsync(CreateTransactionContainerPrepareRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/PreparationUnfit/CreateContainerPrepare", request);
        }

        public async Task<BaseServiceResult> UpdateContainerPrepareAsync(UpdateTransactionContainerPrepareRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/PreparationUnfit/UpdateContainerPrepare", request);
        }

        public async Task<BaseServiceResult> RemoveContainerPrepareAsync(long Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/PreparationUnfit/RemoveContainerPrepare?Id={Id}");
        }

        public async Task<GetAllContainerPrepareResult> GetAllContainerPrepareAsyn(int department)
        {
            return await SendAsync<GetAllContainerPrepareResult>(HttpMethod.Get, $"api/PreparationUnfit/GetAllContainerPrepareId={department}");
        }

        public async Task<GetContainerPrepareByIdResult> GetContainerPrepareByIdAsync(long containerPrepareId)
        {
            return await SendAsync<GetContainerPrepareByIdResult>(HttpMethod.Get, $"api/PreparationUnfit/GetContainerPrepareById?containerPrepareId={containerPrepareId}");
        }

        public async Task<ValidateBarcodeResponse> ValidateBarcodeAsync(ValidateBarcodeRequest request)
        {
            return await SendAsync<ValidateBarcodeResponse>(HttpMethod.Post, $"api/ValidateBarcode/ValidateBarcode", request);
        }

        public async Task<BaseServiceResult> CreateReceiveCbmsDataAsync(CreateTransactionReceiveCbmsDataRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/PreparationUnfit/CreateReceiveCbmsData", request);
        }

        public async Task<BaseServiceResult> UpdateReceiveCbmsDataAsync(UpdateTransactionReceiveCbmsDataRequest request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Put, $"api/PreparationUnfit/UpdateReceiveCbmsData", request);
        }

        public async Task<BaseServiceResult> RemoveReceiveCbmsDataAsync(long Id)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Delete, $"api/PreparationUnfit/RemoveReceiveCbmsData?Id={Id}");
        }

        public async Task<GetAllReceiveCbmsDataResult> GetAllReceiveCbmsDataAsyn(int department)
        {
            return await SendAsync<GetAllReceiveCbmsDataResult>(HttpMethod.Get, $"api/PreparationUnfit/GetAllReceiveCbmsData?Id={department}" );
        }

        public async Task<GetReceiveCbmsDataByIdResult> GetReceiveCbmsDataByIdAsync(long receiveId)
        {
            return await SendAsync<GetReceiveCbmsDataByIdResult>(HttpMethod.Get, $"api/PreparationUnfit/GetReceiveCbmsDataById?receiveId={receiveId}");
        }
        public async Task<ApiResponse<PagedData<PreparationUnfitResult>>> GetPreparationUnfitsAsync(PagedRequest<PreparationUnfitRequest> request)
        {
            var result = await SendAsync<ApiResponse<PagedData<PreparationUnfitResult>>>(HttpMethod.Post, $"api/PreparationUnfit/GetPreparationUnfit",request);
            return result;
        }

        public async Task<BaseServiceResult> CreateContainerBarcodeAsync(SaveContainerPrepare request)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/PreparationUnfit/CreateContainerBarcode", request);
        }

        public async Task<GetCountPrepareByContainerResult?> GetCountPrepareByContainerAsync(CountPrepareByContainerRequest request)
        {
            return await SendAsync<GetCountPrepareByContainerResult>(HttpMethod.Post, "api/PreparationUnfit/GetCountPrepareByContainer", request);
        }

        public async Task<GetCountReconcileResult?> GetCountReconcileAsync(GetCountReconcileRequest request)
        {
            return await SendAsync<GetCountReconcileResult>(HttpMethod.Post, "api/PreparationUnfit/GetCountReconcile", request);
        }

        public async Task<BaseApiResponse<List<EditPreparationUnfitResponse>>> EditPreparationUnfitAsync(List<EditPreparationUnfitRequest> request)
        {
            return await SendAsync<BaseApiResponse<List<EditPreparationUnfitResponse>>>(
                HttpMethod.Put,
                "api/PreparationUnfit/EditPreparationUnfit",
                request
            );
        }

        public async Task<BaseApiResponse<List<DeletePreparationUnfitResponse>>> DeletePreparationUnfitAsync(List<DeletePreparationUnfitRequest> request)
        {
            return await SendAsync<BaseApiResponse<List<DeletePreparationUnfitResponse>>>(
                HttpMethod.Delete,
                "api/PreparationUnfit/DeletePreparationUnfit",
                request
            );
        }
    }
}
