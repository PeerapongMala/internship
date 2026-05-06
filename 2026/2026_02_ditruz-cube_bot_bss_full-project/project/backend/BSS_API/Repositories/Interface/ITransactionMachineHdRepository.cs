namespace BSS_API.Repositories.Interface
{
    using Models.Entities;

    public interface ITransactionMachineHdRepository : IGenericRepository<TransactionMachineHd>
    {
        Task<List<TransactionMachineHd>> GetByMachineIdAsync(int machineId);
        Task<List<TransactionMachineHd>> GetUnmatchedByDepartmentAsync(int departmentId, int? machineId);
        Task<List<TransactionMachineHd>> GetUnreconciledAsync(int departmentId, int machineId);
        Task<bool> ExistsDuplicateAsync(string headerCardCode, int machineId, DateTime cutoff);
    }
}
