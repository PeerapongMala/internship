using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office2010.Excel;
using Newtonsoft.Json;
using System.Collections.Generic;

namespace BSS_API.Services
{
    public class MasterMenuService : IMasterMenuService
    {

        private readonly IUnitOfWork _unitOfWork;
        public MasterMenuService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateMenu(CreateMenuRequest request)
        {
            var entity_row = await _unitOfWork.MenuRepos.GetAsync(item => item.MenuName == request.MenuName.Trim() &&
                                                                  item.MenuPath == request.MenuPath.Trim());

            if (entity_row == null)
            {
                var new_entity = new MasterMenu
                {
                    MenuName = request.MenuName.Trim(),
                    MenuPath = request.MenuPath.Trim(),
                    DisplayOrder = request.DisplayOrder,
                    ControllerName = request.ControllerName.Trim(),
                    ActionName = request.ActionName.Trim(),
                    ParentMenuId = request.ParentMenuId,
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    IsActive = request.IsActive,
                    CreatedDate = DateTime.Now
                };

                await  _unitOfWork.MenuRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                _unitOfWork.MenuRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteMenu(int Id)
        {
            var entity_row = await _unitOfWork.MenuRepos.GetAsync(u => u.MenuId == Id);
            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.MenuRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<IEnumerable<MasterMenu>> GetAllMenu()
        {
            return await _unitOfWork.MenuRepos.GetAllAsync();
        }

        public async Task<IEnumerable<MasterMenu>> GetMenuByUniqueOrKey(string menuName, string menuPath)
        {
            return await _unitOfWork.MenuRepos.GetAllAsync(item => item.MenuName == menuName && item.MenuPath == menuPath);
        }

        public async Task<IEnumerable<MasterMenuActiveData>> GetMenuActiveList()
        {
            var menuListData = new List<MasterMenuActiveData>();

            var queryData = (from m in await _unitOfWork.MenuRepos.GetAllAsync(x => x.IsActive == true)
                             select new MasterMenuActiveData
                             {
                                 MenuId = m.MenuId,
                                 MenuName = m.MenuName,
                                 DisplayOrder = m.DisplayOrder,
                                 ParentMenuId = m.ParentMenuId
                             }).ToList();

            menuListData.AddRange(queryData);
            return menuListData;
        }

        public async Task<MasterMenuViewData> GetMenuById(int Id)
        {
            var result = new MasterMenuViewData();
            var queryData = await _unitOfWork.MenuRepos.GetAsync(item => item.MenuId == Id);
            if (queryData != null)
            {
                result = new MasterMenuViewData()
                {
                    MenuId = queryData.MenuId,
                    MenuName = queryData.MenuName,
                    MenuPath = queryData.MenuPath,
                    DisplayOrder = queryData.DisplayOrder,
                    ControllerName = queryData.ControllerName,
                    ActionName = queryData.ActionName,
                    ParentMenuId = queryData.ParentMenuId,
                    IsActive = queryData.IsActive,
                    CreatedBy = queryData.CreatedBy,
                    CreatedDate = queryData.CreatedDate,
                    UpdatedBy = queryData.UpdatedBy,
                    UpdatedDate = queryData.UpdatedDate
                };
            }
            else
            {
                result = null;
            }

            return result;
        }

        public async Task UpdateMenu(UpdateMenuRequest request)
        {
            var entity_row = await _unitOfWork.MenuRepos.GetAsync(u => u.MenuId == request.MenuId);

            entity_row.MenuName = request.MenuName.Trim();
            entity_row.MenuPath = request.MenuPath.Trim();
            entity_row.DisplayOrder = request.DisplayOrder;
            entity_row.ControllerName = request.ControllerName.Trim();
            entity_row.ActionName = request.ActionName.Trim();
            entity_row.ParentMenuId = request.ParentMenuId;
            entity_row.IsActive = request.IsActive;
            entity_row.UpdatedBy = RequestContextHelper.GetUserId(); //request.UpdatedBy;
            entity_row.UpdatedDate = DateTime.Now;

            _unitOfWork.MenuRepos.Update(entity_row);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<PagedData<MasterMenuViewData>> SearchMenu(PagedRequest<MasterMenuRequest> request)
        {
            return await _unitOfWork.MenuRepos.SearchMenu(request);
        }
    }
}
