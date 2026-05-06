using BSS_API.Models.ResponseModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;


namespace BSS_API.Services
{
    public class MasterNavigationMenuService : IMasterNavigationMenuService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MasterNavigationMenuService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public IEnumerable<NavigationMenuViewModel> GetMenuByRoleId(int roleId)
        {
            try
            {
                var rolePermissions = _unitOfWork.RolePermissionRepos.GetAll()
                    .Where(rp => rp.RoleId == roleId && rp.IsActive == true)
                    .ToList();

                var menuIds = rolePermissions.Select(rp => rp.MenuId).Distinct().ToList();

                var menus = _unitOfWork.MenuRepos.GetAll()
                    .Where(m => m.IsActive == true && menuIds.Contains(m.MenuId))
                    .OrderBy(m => m.DisplayOrder)
                    .ToList();

                var results = (from m in menus
                               join rp in rolePermissions on m.MenuId equals rp.MenuId
                               select new NavigationMenuViewModel
                               {
                                   MenuId = m.MenuId,
                                   MenuName = m.MenuName,
                                   MenuPath = m.MenuPath,
                                   ControllerName = m.ControllerName,
                                   ActionName = m.ActionName,
                                   ParentMenuId = m.ParentMenuId,
                                   DisplayOrder = m.DisplayOrder,
                                   IsActive = m.IsActive,
                                   AssignedDate = rp.AssignedDateTime
                               }).ToList();

                return results;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
