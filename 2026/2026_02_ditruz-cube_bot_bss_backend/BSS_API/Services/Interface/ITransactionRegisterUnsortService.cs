namespace BSS_API.Services.Interface
{
    using Models.Entities;
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface ITransactionRegisterUnsortService
    {
        Task<List<RegisterUnsortResponse>> LoadRegisterUnsortList(int departmentId, CancellationToken ct = default);

        Task<TransactionRegisterUnsort?> ConfirmRegisterUnsortCCAsync(ConfirmRegisterUnsortRequest request,
            CancellationToken ct = default);
    }
}