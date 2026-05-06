namespace BSS_API.Services.Interface;

using Models.RequestModels;
using Models.ResponseModels;

public interface IManualKeyInService
{
    Task<ManualKeyInHeaderCardInfoResponse?> GetHeaderCardInfoAsync(string headerCardCode, CancellationToken ct = default);

    Task<ManualKeyInDenominationResponse> GetDenominationsAsync(long prepareId, CancellationToken ct = default);

    Task<ManualKeyInSaveResponse> SaveAsync(ManualKeyInSaveRequest request, CancellationToken ct = default);

    Task<ManualKeyInSaveResponse> SubmitForApprovalAsync(ManualKeyInSubmitRequest request, CancellationToken ct = default);
}
