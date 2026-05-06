namespace BSS_API.Services
{
    using Interface;
    using BSS_API.Repositories.Interface;
    using BSS_API.Models.Common;
    using BSS_API.Models.RequestModels;
    using BSS_API.Models.ResponseModels;

    public class TransactionRevokeTranService(IUnitOfWork unitOfWork) : ITransactionRevokeTranService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;

        public async Task<PagedData<RevokeTransactionResponse>> GetRevokeListAsync(
            PagedRequest<RevokeTransactionFilterRequest> request, CancellationToken ct = default)
        {
            return await _unitOfWork.TransactionRevokeTranRepos.GetRevokeListAsync(request, ct);
        }

        public async Task<RevokeDetailResponse?> GetDetailAsync(string headerCardCode, CancellationToken ct = default)
        {
            return await _unitOfWork.TransactionRevokeTranRepos.GetDetailAsync(headerCardCode, ct);
        }

        public async Task<RevokeExecuteResponse> ExecuteRevokeAsync(RevokeActionRequest request)
        {
            var affected = await _unitOfWork.TransactionRevokeTranRepos.ExecuteRevokeAsync(request);
            return new RevokeExecuteResponse
            {
                IsSuccess = affected > 0,
                Message = affected > 0 ? "Revoke สำเร็จ" : "ไม่พบรายการที่สามารถ Revoke ได้",
                AffectedCount = affected
            };
        }
    }
}
