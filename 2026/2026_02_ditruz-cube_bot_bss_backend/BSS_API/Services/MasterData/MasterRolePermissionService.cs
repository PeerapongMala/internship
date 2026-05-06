using BSS_API.Helpers;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Vml.Office;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Collections.Generic;
using System.Linq;

namespace BSS_API.Services
{
    public class MasterRolePermissionService : IMasterRolePermissionService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MasterRolePermissionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateOrUpdateRolePermission(SaveRolePermissionRequest request)
        {
            // Mapping Role Menu 
            #region /* Mapping Role Menu */

            var menuAll = new List<MasterMenuActiveData>();
            var menuItemMapping = new List<MasterMenuActiveData>();
            var menuItemParent = new List<MasterMenuActiveData>();
            var menuItemChild = new List<MasterMenuActiveData>();

            var queryMenuData = (from m in await _unitOfWork.MenuRepos.GetAllAsync(x => x.IsActive == true)
                                 select new MasterMenuActiveData
                                 {
                                     MenuId = m.MenuId,
                                     MenuName = m.MenuName,
                                     DisplayOrder = m.DisplayOrder,
                                     ParentMenuId = m.ParentMenuId
                                 }).ToList();

            menuAll.AddRange(queryMenuData);

            foreach (var menu in request.MenuItemSelected)
            {
                var menuData = menuAll.Where(m => m.MenuId == menu.MenuId).FirstOrDefault();
                menuItemMapping.Add(menuData);

                if (menuData.ParentMenuId != null)
                {
                    var menuParentData = menuAll.Where(p => p.MenuId == menuData.ParentMenuId).FirstOrDefault();
                    menuItemMapping.Add(menuParentData);
                }
            }

            if (menuItemMapping.Any())
            {
                menuItemParent = menuItemMapping.Where(p => p.ParentMenuId == null).Distinct().ToList();
                menuItemChild = menuItemMapping.Where(c => c.ParentMenuId != null).Distinct().ToList();
            }


            #endregion /* Mapping Role Menu */

            #region /* Create For Menu Parent */

            if (menuItemParent != null)
            {
                foreach (var menuItem in menuItemParent)
                {
                    var entity_row = await _unitOfWork.RolePermissionRepos.GetAsync(item => item.RoleId == request.RoleId && item.MenuId == menuItem.MenuId);
                    if (entity_row == null)
                    {
                        var entity_new = new MasterRolePermission();
                        entity_new.RoleId = request.RoleId;
                        entity_new.MenuId = menuItem.MenuId;
                        entity_new.AssignedDateTime = DateTime.Now;
                        entity_new.IsActive = request.IsActive;
                        entity_new.CreatedBy = RequestContextHelper.GetUserId();// request.CreatedBy;
                        entity_new.CreatedDate = DateTime.Now;
                        await _unitOfWork.RolePermissionRepos.AddAsync(entity_new);
                    }
                    else
                    {
                        entity_row.IsActive = true;
                        entity_row.AssignedDateTime = DateTime.Now;
                        entity_row.UpdatedBy = RequestContextHelper.GetUserId();// request.CreatedBy;
                        entity_row.UpdatedDate = DateTime.Now;
                        _unitOfWork.RolePermissionRepos.Update(entity_row);
                    }
                }
            }

            #endregion /* Create For Menu Parent */

            #region /* Create For Menu Child */

            if (menuItemChild != null)
            {
                foreach (var menuItem in menuItemChild)
                {
                    var entity_row = await _unitOfWork.RolePermissionRepos.GetAsync(item => item.RoleId == request.RoleId && item.MenuId == menuItem.MenuId);
                    if (entity_row == null)
                    {
                        var entity_new = new MasterRolePermission();
                        entity_new.RoleId = request.RoleId;
                        entity_new.MenuId = menuItem.MenuId;
                        entity_new.AssignedDateTime = DateTime.Now;
                        entity_new.IsActive = request.IsActive;
                        entity_new.CreatedBy = RequestContextHelper.GetUserId();// request.CreatedBy;
                        entity_new.CreatedDate = DateTime.Now;
                        await _unitOfWork.RolePermissionRepos.AddAsync(entity_new);
                    }
                    else
                    {
                        entity_row.IsActive = true;
                        entity_row.AssignedDateTime = DateTime.Now;
                        entity_row.UpdatedBy = RequestContextHelper.GetUserId();// request.CreatedBy;
                        entity_row.UpdatedDate = DateTime.Now;
                        _unitOfWork.RolePermissionRepos.Update(entity_row);
                    }
                }
            }

            #endregion /* Create For Menu Child */

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<IEnumerable<MasterRolePermission>> GetAllRolePermissions()
        {
            return await _unitOfWork.RolePermissionRepos.GetAllAsync();
        }

        public async Task<IEnumerable<MasterRolePermission>> GetRolePermissionByUniqueOrKey(int roleId)
        {
            return await _unitOfWork.RolePermissionRepos.GetAllAsync(item => item.RoleId == roleId);
        }

        public async Task<IEnumerable<MasterRolePermissionData>> GetRolePermissionLists()
        {
            var roleListData = new List<MasterRolePermissionData>();

            var rolePermData = await _unitOfWork.RolePermissionRepos.GetAllAsync();

            if (rolePermData != null)
            {
                var roleIdDistincList = rolePermData.DistinctBy(dis => dis.RoleId).Select(s => s.RoleId).ToList();

                foreach (var roleItem in roleIdDistincList)
                {
                    var roleData = await _unitOfWork.RoleRepos.GetAsync(r => r.RoleId.Equals(roleItem));
                    if (roleData != null)
                    {
                        var resultItem = new MasterRolePermissionData();
                        resultItem.RoleId = roleData.RoleId;
                        resultItem.RoleName = roleData.RoleName;
                        resultItem.IsActive = roleData.IsActive;
                        resultItem.RoleGroupId = roleData.RoleGroupId;
                        var roleGroupData = await _unitOfWork.RoleGroupRepos.GetAsync(rg => rg.RoleGroupId.Equals(roleData.RoleGroupId));
                        if (roleGroupData != null)
                        {
                            resultItem.RoleGroupName = roleGroupData.RoleGroupName;
                        }

                        roleListData.Add(resultItem);
                    }
                }
            }

            return roleListData;
        }

        public async Task<IEnumerable<MasterRolePermissionData>> GetRolePermissionByFilter(RolePermissionFilterRequest filter)
        {
            var rolePermissionLists = await GetRolePermissionLists();

            if (!string.IsNullOrEmpty(filter.RoleFilter) || !string.IsNullOrEmpty(filter.StatusFilter))
            {

                if (!string.IsNullOrEmpty(filter.RoleFilter))
                {
                    rolePermissionLists = rolePermissionLists.Where(x => x.RoleId == filter.RoleFilter.AsInt()).ToList();
                }

                if (!string.IsNullOrEmpty(filter.StatusFilter))
                {
                    rolePermissionLists = rolePermissionLists.Where(x => x.IsActive == (filter.StatusFilter == "1" ? true : false)).ToList();
                }
            }

            return rolePermissionLists;
        }

        public async Task<MasterRolePermission> GetRolePermissionById(int Id)
        {
            return await _unitOfWork.RolePermissionRepos.GetAsync(u => u.RolePermissionId == Id);
        }

        public async Task<IEnumerable<MasterRolePermissionDetailData>> GetRolePermissionByRoleId(int roleId)
        {
            var resultListData = new List<MasterRolePermissionDetailData>();
            var rolePermissionLists = await _unitOfWork.RolePermissionRepos.GetAllAsync(rp => rp.RoleId == roleId && rp.IsActive == true);

            if (rolePermissionLists.Any())
            {
                var roleData = await _unitOfWork.RoleRepos.GetAsync(r => r.RoleId == roleId);

                foreach (var item in rolePermissionLists)
                {
                    var resultItem = new MasterRolePermissionDetailData();
                    resultItem.RolePermissionId = item.RolePermissionId;
                    resultItem.RoleId = roleId;
                    resultItem.RoleName = roleData.RoleName;
                    resultItem.AssignedDateTime = item.AssignedDateTime;
                    resultItem.IsActive = item.IsActive;

                    var menuData = await _unitOfWork.MenuRepos.GetAsync(m => m.MenuId == item.MenuId);
                    if (menuData != null)
                    {
                        resultItem.MenuId = menuData.MenuId;
                        resultItem.MenuName = menuData.MenuName;
                        resultItem.ParentMenuId = menuData.ParentMenuId;
                    }

                    resultListData.Add(resultItem);
                }
            }

            //var queryRoleLists = (from rp in await _unitOfWork.RolePermissionRepos.GetAllAsync(x => x.RoleId == roleId && x.IsActive == true)
            //                      join r in await _unitOfWork.RoleRepos.GetAllAsync() on rp.RoleId equals r.RoleId into roleJoin
            //                      from r in roleJoin.DefaultIfEmpty()
            //                      join m in await _unitOfWork.MenuRepos.GetAllAsync() on rp.MenuId equals m.MenuId into menuJoin
            //                      from m in menuJoin.DefaultIfEmpty()
            //                      select new MasterRolePermissionDetailData
            //                      {
            //                          RolePermissionId = rp.RolePermissionId,
            //                          RoleId = rp.RoleId,
            //                          RoleName = r.RoleName,
            //                          MenuId = rp.MenuId,
            //                          MenuName = m.MenuName,
            //                          AssignedDateTime = rp.AssignedDateTime,
            //                          IsActive = rp.IsActive,
            //                          ParentMenuId = m.ParentMenuId
            //                      }).ToList();

            //roleListData.AddRange(queryRoleLists);

            return resultListData;
        }

        public async Task DeleteRolePermission(int Id)
        {
            var entity_row = await _unitOfWork.RolePermissionRepos.GetAsync(u => u.RolePermissionId == Id);
            if (entity_row != null)
            {
                _unitOfWork.RolePermissionRepos.Remove(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task DeleteRolePermissionByRoleId(int roleId)
        {
            var entityRows = await _unitOfWork.RolePermissionRepos.GetAllAsync(item => item.RoleId == roleId);

            if (entityRows.Any())
            {
                foreach (var rowData in entityRows)
                {
                    _unitOfWork.RolePermissionRepos.Remove(rowData);
                }

                await _unitOfWork.SaveChangeAsync();
            }
        }
    }
}
