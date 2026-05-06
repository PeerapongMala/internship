namespace BSS_API.Services.Interface
{
    using Models.Entities;
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface ITransactionRegisterUnsortService
    {
        Task<List<RegisterUnsortResponse>> LoadRegisterUnsortList(int departmentId, CancellationToken ct = default);

        Task<ConfirmRegisterUnsortRequest> EditRegisterUnsortContainerAsync(ConfirmRegisterUnsortRequest request,
            CancellationToken ct = default);

        Task<ConfirmUnsortCCRequest> EditUnsortCCStatusDeliveryAsync(ConfirmUnsortCCRequest confirmUnsortCCRequest);

        Task<ConfirmRegisterUnsortRequest?> ConfirmRegisterUnsortCCAsync(ConfirmRegisterUnsortRequest request,
            CancellationToken ct = default);
    }
}