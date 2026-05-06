namespace BSS_API.Repositories
{
    using Models;
    using Interface;
    using Models.Entities;
    using Microsoft.EntityFrameworkCore;
    
    public class BssTransactionContainerSequenceRepository (ApplicationDbContext db)
        : GenericRepository<BssTransactionContainerSequence>(db),
            IBssTransactionContainerSequenceRepository
    {
        public async Task<BssTransactionContainerSequence?> GetBssTransactionContainerSequenceByTypeParameterAsync(string containerType,
            int departmentId, int institutionId, int denominationId, int? cashCenterId = null, int? zoneId = null, int? cashPointId = null)
        {
            DateTime dateNowDateOnly = DateTime.Today;
            IQueryable<BssTransactionContainerSequence> queryable =  db.BssTransactionContainerSequence
                .Where(w => w.ContainerType == containerType && w.DepartmentId == departmentId)
                .Where(w => w.InstitutionId == institutionId && w.DenominationId == denominationId && w.CreatedDate == dateNowDateOnly)
                .AsQueryable();

            if (cashCenterId.HasValue)
            {
                queryable =  queryable.Where(w => w.CashCenterId == cashCenterId.Value);
            }

            if (zoneId.HasValue)
            {
                queryable = queryable.Where(w => w.ZoneId == zoneId.Value);
            }
            
            if (cashPointId.HasValue)
            {
                queryable =  queryable.Where(w => w.CashPointId == cashPointId.Value);
            }
            
            return await queryable.FirstOrDefaultAsync();
            
        }
    }
}
