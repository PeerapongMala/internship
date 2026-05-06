namespace BSS_API.Services.Interface
{
    using Models.Common;
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface ITransactionRevokeTranService
    {
        Task<PagedData<RevokeTransactionResponse>> GetRevokeListAsync(
            PagedRequest<RevokeTransactionFilterRequest> request, CancellationToken ct = default);

        Task<RevokeDetailResponse?> GetDetailAsync(string headerCardCode, CancellationToken ct = default);

        Task<RevokeExecuteResponse> ExecuteRevokeAsync(RevokeActionRequest request);
    }
}
