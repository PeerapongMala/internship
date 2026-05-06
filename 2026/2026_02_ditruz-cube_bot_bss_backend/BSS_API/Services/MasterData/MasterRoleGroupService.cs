using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office2010.Excel;
using Newtonsoft.Json;

namespace BSS_API.Services
{
    public class MasterRoleGroupService : IMasterRoleGroupService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterRoleGroupService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateRoleGroup(CreateRoleGroupRequest request)
        {
            var entity_row = await _unitOfWork.RoleGroupRepos.GetAsync(item => item.RoleGroupCode == request.RoleGroupCode.Trim());
            if (entity_row == null)
            {
                var new_entity = new MasterRoleGroup
                {
                    RoleGroupCode = request.RoleGroupCode.Trim(),
                    RoleGroupName = request.RoleGroupName.Trim(),
                    IsActive = request.IsActive,
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.RoleGroupRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.RoleGroupRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<IEnumerable<MasterRoleGroup>> GetAllRoleGroups()
        {
            return await _unitOfWork.RoleGroupRepos.GetAllAsync();
        }

        public async Task<MasterRoleGroupViewData> GetRoleGroupById(int Id)
        {
            //var roleGroup = await _unitOfWork.RoleGroupRepos.GetRoleGroupByIdAsync(Id);
            var roleGroup = _unitOfWork.RoleGroupRepos.Get(item => item.RoleGroupId == Id);

            var result = new MasterRoleGroupViewData();
            
            // var queryData = await _unitOfWork.RoleGroupRepos.GetAsync(item => item.RoleGroupId == Id);
            if (roleGroup != null)
            {
                result = new MasterRoleGroupViewData()
                {
                    RoleGroupId = roleGroup.RoleGroupId,
                    RoleGroupCode = roleGroup.RoleGroupCode,
                    RoleGroupName = roleGroup.RoleGroupName,
                    IsActive = roleGroup.IsActive,
                    CreatedBy = roleGroup.CreatedBy,
                    CreatedDate = roleGroup.CreatedDate,
                    UpdatedBy = roleGroup.UpdatedBy,
                    UpdatedDate = roleGroup.UpdatedDate
                };
            }
            else
            {
                result = null;
            }

            return result;
        }

        public async Task<IEnumerable<MasterRoleGroup>> GetRoleGroupByUniqueOrKey(string roleGroupCode)
        {
            return await _unitOfWork.RoleGroupRepos.GetAllAsync(item => item.RoleGroupCode == roleGroupCode);
        }

        public async Task UpdateRoleGroup(UpdateRoleGroupRequest request)
        {
            var entity_row = await _unitOfWork.RoleGroupRepos.GetAsync(item => item.RoleGroupId == request.RoleGroupId);
            entity_row.RoleGroupCode = request.RoleGroupCode;
            entity_row.RoleGroupName = request.RoleGroupName.Trim();
            entity_row.IsActive = request.IsActive;
            entity_row.UpdatedBy = RequestContextHelper.GetUserId();// request.UpdatedBy;
            entity_row.UpdatedDate = DateTime.Now;
            _unitOfWork.RoleGroupRepos.Update(entity_row);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteRoleGroup(int id)
        {
            var entity_row = await _unitOfWork.RoleGroupRepos.GetAsync(item => item.RoleGroupId == id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy= RequestContextHelper.GetUserId();
                entity_row.UpdatedDate= DateTime.Now;
                _unitOfWork.RoleGroupRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<PagedData<MasterRoleGroup>> SearchRoleGroup(PagedRequest<MasterRoleGroupRequest> request) {
            return await _unitOfWork.RoleGroupRepos.SearchRoleGroup(request);
        }

         
    }
}
