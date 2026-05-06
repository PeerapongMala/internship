namespace BSS_WEB.Interfaces
{
    using BSS_WEB.Models.ObjectModel;
    using BSS_WEB.Models.SearchModel;
    using BSS_WEB.Models.ServiceModel;

    public interface ITransactionSendUnsortCCService
    {
        Task<BaseServiceResult> GetNewDeliveryCodeAsync(GetNewDeliveryCodeRequest getNewDeliveryCodeRequest);

        Task<BaseApiResponse<CreateSendUnsortResult>> LoadRegisterUnsortAsync(LoadRegisterUnsortRequest loadRegisterUnsortRequest);

        Task<BaseApiResponse<CreateSendUnsortCCRequest>> CreateSendUnsortCCAsync(CreateSendUnsortCCRequest createSendUnsortRequest);

        Task<BaseApiResponse<RegisterUnsortDeliverResponse>> GetRegisterUnsortDeliverAsync(RegisterUnsortDeliverRequest registerUnsortDeliverRequest);

        Task<BaseApiResponse<ConfirmRegisterUnsortDeliverRequest>> ConfirmRegisterUnsortDeliverAsync(ConfirmRegisterUnsortDeliverRequest confirmRegisterUnsortDeliverRequest);

        Task<BaseApiResponse<ConfirmRegisterUnsortDeliverRequest>> DeleteRegisterUnsortDeliverAsync(
            ConfirmRegisterUnsortDeliverRequest request);

        #region EditSendUnsortDelivery

        Task<BaseApiResponse<EditSendUnsortDeliveryResponse>> GetEditSendUnsortDeliveryAsync(EditSendUnsortDeliveryRequest editSendUnsortDeliveryRequest);

        Task<BaseApiResponse<EditSendUnsortDataBarcodeContainerRequest>> EditBarcodeContainerSendUnsortDataAsync(EditSendUnsortDataBarcodeContainerRequest editSendUnsortDataBarcodeContainerRequest);

        Task<BaseApiResponse<ConfirmEditSendUnsortDeliveryRequest>> ConfirmEditSendUnsortDeliveryAsync(ConfirmEditSendUnsortDeliveryRequest editSendUnsortDeliveryRequest);

        #endregion EditSendUnsortDelivery
    }
}
