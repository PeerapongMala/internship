namespace BSS_WEB.Services
{
    using BSS_WEB.Interfaces;
    using BSS_WEB.Models.ObjectModel;
    using BSS_WEB.Models.SearchModel;
    using BSS_WEB.Models.ServiceModel;

    public class TransactionSendUnsortCCService : BaseApiClient, ITransactionSendUnsortCCService
    {
        public TransactionSendUnsortCCService(HttpClient client, IHttpContextAccessor contextAccessor, ILogger<TransactionSendUnsortCCService> logger) 
            : base(client, logger, contextAccessor)
        {
        }

        public async Task<BaseServiceResult> GetNewDeliveryCodeAsync(GetNewDeliveryCodeRequest getNewDeliveryCodeRequest)
        {
            return await SendAsync<BaseServiceResult>(HttpMethod.Post, $"api/TransactionSendUnsortCC/GetNewDeliveryCode", getNewDeliveryCodeRequest);
        }

        public async Task<BaseApiResponse<CreateSendUnsortResult>> LoadRegisterUnsortAsync(LoadRegisterUnsortRequest loadRegisterUnsortRequest)
        {
            return await SendAsync<BaseApiResponse<CreateSendUnsortResult>>(HttpMethod.Post, $"api/TransactionSendUnsortCC/LoadRegisterUnsort", loadRegisterUnsortRequest);
        }

        public async Task<BaseApiResponse<CreateSendUnsortCCRequest>> CreateSendUnsortCCAsync(CreateSendUnsortCCRequest createSendUnsortRequest)
        {
            return await SendAsync<BaseApiResponse<CreateSendUnsortCCRequest>>(HttpMethod.Post, $"api/TransactionSendUnsortCC/CreateSendUnsort", createSendUnsortRequest);
        }

        public async Task<BaseApiResponse<RegisterUnsortDeliverResponse>> GetRegisterUnsortDeliverAsync(RegisterUnsortDeliverRequest registerUnsortDeliverRequest)
        {
            return await SendAsync<BaseApiResponse<RegisterUnsortDeliverResponse>>(HttpMethod.Post, $"api/TransactionSendUnsortCC/GetRegisterUnsortDeliver", registerUnsortDeliverRequest);
        }

        public async Task<BaseApiResponse<ConfirmRegisterUnsortDeliverRequest>> ConfirmRegisterUnsortDeliverAsync(ConfirmRegisterUnsortDeliverRequest confirmRegisterUnsortDeliverRequest)
        {
            return await SendAsync<BaseApiResponse<ConfirmRegisterUnsortDeliverRequest>>(HttpMethod.Post, $"api/TransactionSendUnsortCC/ConfirmRegisterUnsortDeliver", confirmRegisterUnsortDeliverRequest);
        }

        public async Task<BaseApiResponse<ConfirmRegisterUnsortDeliverRequest>> DeleteRegisterUnsortDeliverAsync(ConfirmRegisterUnsortDeliverRequest confirmRegisterUnsortDeliverRequest)
        {
            return await SendAsync<BaseApiResponse<ConfirmRegisterUnsortDeliverRequest>>(HttpMethod.Delete, $"api/TransactionSendUnsortCC/DeleteRegisterUnsortDeliver", confirmRegisterUnsortDeliverRequest);
        }

        #region EditSendUnsortDelivery

        public async Task<BaseApiResponse<EditSendUnsortDeliveryResponse>> GetEditSendUnsortDeliveryAsync(EditSendUnsortDeliveryRequest editSendUnsortDeliveryRequest)
        {
            return await SendAsync<BaseApiResponse<EditSendUnsortDeliveryResponse>>(HttpMethod.Post, $"api/TransactionSendUnsortCC/GetEditSendUnsortDelivery", editSendUnsortDeliveryRequest);
        }

        public async Task<BaseApiResponse<EditSendUnsortDataBarcodeContainerRequest>> EditBarcodeContainerSendUnsortDataAsync(EditSendUnsortDataBarcodeContainerRequest editSendUnsortDataBarcodeContainerRequest)
        {
            return await SendAsync<BaseApiResponse<EditSendUnsortDataBarcodeContainerRequest>>(HttpMethod.Post, $"api/TransactionSendUnsortCC/EditBarcodeContainerSendUnsortData", editSendUnsortDataBarcodeContainerRequest);
        }

        public async Task<BaseApiResponse<ConfirmEditSendUnsortDeliveryRequest>> ConfirmEditSendUnsortDeliveryAsync(ConfirmEditSendUnsortDeliveryRequest editSendUnsortDeliveryRequest)
        {
            return await SendAsync<BaseApiResponse<ConfirmEditSendUnsortDeliveryRequest>>(HttpMethod.Post, $"api/TransactionSendUnsortCC/ConfirmEditSendUnsortDelivery", editSendUnsortDeliveryRequest);
        }

        #endregion EditSendUnsortDelivery

    }
}
