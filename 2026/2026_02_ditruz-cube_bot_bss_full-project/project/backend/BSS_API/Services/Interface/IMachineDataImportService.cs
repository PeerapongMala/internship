namespace BSS_API.Services.Interface
{
    using Models.ResponseModels;

    public interface IMachineDataImportService
    {
        Task<RefreshResponse> RefreshAsync(int machineId, int userId);
        Task<List<MachineHeaderCardResponse>> GetMachineHeaderCardsAsync(int machineId);
        Task<List<PrepareHeaderCardResponse>> GetPrepareHeaderCardsAsync(
            int departmentId, int? machineId, string? bnTypeCode = null);
    }
}
