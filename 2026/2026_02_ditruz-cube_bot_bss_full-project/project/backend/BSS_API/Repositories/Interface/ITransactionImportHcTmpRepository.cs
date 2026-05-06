namespace BSS_API.Repositories.Interface
{
    using Models.Entities;

    public interface ITransactionImportHcTmpRepository : IGenericRepository<TransactionImportHcTmp>
    {
        Task<List<TransactionImportHcTmp>> GetByDepartmentAndDateAsync(
            int departmentId, int machineId, int userId, DateTime startDate, DateTime endDate);

        Task DeactivateOldRecordsAsync(int departmentId, int machineId, int userId);
    }
}
