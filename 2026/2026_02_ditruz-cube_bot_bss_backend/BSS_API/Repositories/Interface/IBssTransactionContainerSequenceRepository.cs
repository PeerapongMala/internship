namespace BSS_API.Repositories.Interface
{
    using Models.Entities;
    
    public interface IBssTransactionContainerSequenceRepository : IGenericRepository<BssTransactionContainerSequence>
    {
        Task<BssTransactionContainerSequence?> GetBssTransactionContainerSequenceByTypeParameterAsync(string containerType,
            int departmentId, int institutionId, int denominationId, int? cashCenterId = null, int? zoneId = null, int? cashPointId = null);
    }
}
