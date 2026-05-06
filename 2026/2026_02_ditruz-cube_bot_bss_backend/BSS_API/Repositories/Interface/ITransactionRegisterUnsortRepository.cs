namespace BSS_API.Repositories.Interface
{
    using Models.Entities;
    using Models.ResponseModels;

    public interface ITransactionRegisterUnsortRepository : IGenericRepository<TransactionRegisterUnsort>
    {
        Task<TransactionRegisterUnsort?> GetRegisterUnsortDuplicateAsync(string containerCode, int departmentId);

        Task<List<RegisterUnsortResponse>> GetRegisterUnsortDetailsAsync(int departmentId, DateTime startDateTime,
            DateTime endDateTime, CancellationToken ct = default);

        Task<List<RegisterUnsortResponse>> GetRegisterUnsortDetailsForCreateSendUnsortAsync(
            int departmentId,
            DateTime startDateTime, DateTime endDateTime, CancellationToken ct = default);

        Task<List<TransactionRegisterUnsort>?> GetRegisterUnsortIncludeUnsortCCForEditSendUnsortCCAsync(
            int departmentId, List<int> statusList, DateTime startDateTime, DateTime endDateTime);

        Task<TransactionRegisterUnsort?> ImportCbmsCheckDuplicateInRegisterUnSortAsync(string containerCode,
            int DepartmentId, DateTime startDateTime, DateTime endDateTime, List<int> statusList);

        Task<TransactionRegisterUnsort?> GetRegisterUnsortByRegisterUnsortIdForConfirmAsync(
            long registerUnsortId);

        Task<TransactionRegisterUnsort?> GetRegisterUnsortByRegisterUnsortIdForPrintAsync(
            long registerUnsortId);
    }
}