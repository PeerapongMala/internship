using BSS_API.Helpers;
using BSS_API.Models;
using BSS_API.Models.Entities;
using BSS_API.Models.SearchParameter;
using BSS_API.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace BSS_API.Repositories
{
    public class MasterUserRoleRepository : GenericRepository<MasterUserRole>, IMasterUserRoleRepository
    {
        private readonly ApplicationDbContext _db;

        public MasterUserRoleRepository(ApplicationDbContext db) : base(db)
        {
            _db = db;
        }

        public IQueryable<MasterUserRole> GetQueryable()
        {
            return _db.Set<MasterUserRole>().AsQueryable();
        }

        public async Task<List<MasterUserRole>> GetMasterUserRoleWithSearchRequestAsync(
            SystemSearchRequest request)
        {
            return await _db.MasterUserRoles
                .AsNoTracking()
                .Include(i => i.MasterUser)
                .Include(i => i.MasterRoleGroup.MasterRole)
                .AsQueryable()
                .GenerateCondition(request)
                .Where(w => w.IsActive == true)
                .ToListAsync();
        }


    }
}