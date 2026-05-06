namespace BSS_API.Services.Interface
{
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface ITransactionSendUnsortCCService
    {
        Task<CreateSendUnsortResponse> LoadRegisterUnsortListAsync(LoadRegisterUnsortRequest loadRegisterUnsortRequest,
            CancellationToken ct = default);

        Task<CreateSendUnsortCCRequest> CreateSendUnsortAsync(CreateSendUnsortCCRequest request,
            CancellationToken ct = default);

        Task<RegisterUnsortDeliverResponse> GetRegisterUnsortDeliverAsync(
            RegisterUnsortDeliverRequest registerUnsortDeliver);

        Task<ConfirmRegisterUnsortDeliverRequest> ConfirmRegisterUnsortDeliverAsync(
            ConfirmRegisterUnsortDeliverRequest request);

        Task<ConfirmRegisterUnsortDeliverRequest> DeleteRegisterUnsortDeliverAsync(
            ConfirmRegisterUnsortDeliverRequest request);

        #region EditSendUnsortDelivery

        Task<EditSendUnsortDeliveryResponse> GetEditSendUnsortDeliveryAsync(
            EditSendUnsortDeliveryRequest editingSendUnsortDelivery);

        Task<EditSendUnsortDataBarcodeContainerRequest> EditBarcodeContainerSendUnsortDataAsync(
            EditSendUnsortDataBarcodeContainerRequest editSendUnsortDataBarcodeContainerRequest);

        Task<ConfirmEditSendUnsortDeliveryRequest> ConfirmEditSendUnsortDeliveryAsync(
            ConfirmEditSendUnsortDeliveryRequest confirmEditSendUnsortDeliveryRequest);

        #endregion EditSendUnsortDelivery
    }
}