namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;
    using Microsoft.EntityFrameworkCore;

    public class MasterSendUnsortSequenceRepository(ApplicationDbContext db)
        : GenericRepository<MasterSendUnsortSequence>(db),
            IMasterSendUnsortSequenceRepository
    {
        public async Task<MasterSendUnsortSequence?> GetLastSendUnsortSequenceByDepartmentAsync(int departmentId)
        {
            DateTime startDate = DateTime.Today; // Todo start date to day with time 00:00:00
            return await db.MasterSendUnsortSequence
                .AsQueryable()
                .Where(w => w.DepartmentId == departmentId &&
                            w.CreatedDate >= startDate && w.CreatedDate <= DateTime.Now &&
                            w.IsActive == true)
                .OrderByDescending(sort => sort.CreatedDate)
                .FirstOrDefaultAsync();
        }
    }
}