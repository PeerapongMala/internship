namespace BSS_API.Repositories.Interface
{
    using Models.Common;
    using Models.RequestModels;
    using Models.ResponseModels;

    public interface ITransactionRevokeTranRepository
    {
        Task<PagedData<RevokeTransactionResponse>> GetRevokeListAsync(
            PagedRequest<RevokeTransactionFilterRequest> request, CancellationToken ct = default);

        Task<RevokeDetailResponse?> GetDetailAsync(string headerCardCode, CancellationToken ct = default);

        Task<int> ExecuteRevokeAsync(RevokeActionRequest request, CancellationToken ct = default);
    }
}
