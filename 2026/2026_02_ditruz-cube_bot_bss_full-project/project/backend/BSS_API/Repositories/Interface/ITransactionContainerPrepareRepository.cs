namespace BSS_API.Repositories.Interface
{
    using BSS_API.Models;
    using Models.Entities;
    using Models.ObjectModels;

    public interface ITransactionContainerPrepareRepository : IGenericRepository<TransactionContainerPrepare>
    {
        public Task<TransactionContainerPrepare?> GetContainerPrepareByIdAsync(int containerPrepareId);

        public Task<IEnumerable<TransactionContainerPrepareViewDisplay>> GetAllContainerPrepareAsync(int department);

        public Task<TransactionContainerPrepare> GetContainerPrepareByIdAsync(long containerPrepareId);

        public Task<ICollection<TransactionContainerPrepare>> GetContainerPrepareWithMachineAsync(string containerCode,
            int departmentId, int machineId, DateTime startDateTime, DateTime endDateTime);

        public Task<TransactionContainerPrepare?> GetTransactionContainerPrepareAndIncludePrepareWithReceiveIdAsync(long receiveId,
            int institutionId, int denominationId, int? cashCenterId = null, string? barcode = null ,int? CashPointId = null);
        
        public Task<TransactionContainerPrepare?> GetTransactionContainerPrepareAndIncludePrepareWithContainerIdAsync(long containerPrepareId,
            int institutionId, int denominationId);


        //////////Get Report ny MarK 20260227/////////////
        ////////
        public Task<ICollection<TransactionContainerPrepare>> GetContainerPrepareAsync(reportBankSummaryRequest request);
        public Task<ICollection<TransactionContainerPrepare>> GetContainerPrepare_CashPointCenterAsync(reportCashPointCenterRequest request);
    }
}