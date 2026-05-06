namespace BSS_API.Repositories.Interface
{
    using Models.Entities;

    public interface IMasterSendUnsortSequenceRepository : IGenericRepository<MasterSendUnsortSequence>
    {
        Task<MasterSendUnsortSequence?> GetLastSendUnsortSequenceByDepartmentAsync(int departmentId);
    }
}