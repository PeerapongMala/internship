using BSS_API.Helpers;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Vml.Office;
using Microsoft.AspNetCore.Http.HttpResults;
using System.Data;

namespace BSS_API.Services
{
    public class MasterUserRoleService : IMasterUserRoleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterUserRoleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateUserRole(CreateUserRoleRequest request)
        {
            var entity_row = await _unitOfWork.UserRoleRepos.GetAsync(item => item.UserId == request.UserId &&
                                                           item.RoleGroupId == request.RoleGroupId);
            if (entity_row == null)
            {
                var new_entity = new MasterUserRole
                {
                    UserId = request.UserId,
                    RoleGroupId = request.RoleGroupId,
                    AssignedDateTime = request.AssignedDateTime,
                    IsActive = request.IsActive,
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.UserRoleRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;

                _unitOfWork.UserRoleRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<IEnumerable<MasterUserRole>> GetAllUserRole()
        {
            return await _unitOfWork.UserRoleRepos.GetAllAsync();
        }

        public async Task<MasterUserRole> GetUserRolesById(int Id)
        {
            return await _unitOfWork.UserRoleRepos.GetAsync(u => u.UserRoleId == Id);
        }

        public async Task<MasterUserRole> GetUserRolesByUserId(int userId)
        {
            return await _unitOfWork.UserRoleRepos.GetAsync(u => u.UserId == userId);
        }

        public async Task<IEnumerable<MasterUserRole>> GetUserRoleByUniqueOrKey(int userId, int roleGroupId)
        {
            return await _unitOfWork.UserRoleRepos.GetAllAsync(item => item.UserId == userId && item.RoleGroupId == roleGroupId);
        }

        public async Task UpdateUserRole(UpdateUserRoleRequest request)
        {
            var row_entity = await _unitOfWork.UserRoleRepos.GetAsync(item => item.UserId == request.UserId);
            if (row_entity != null)
            {
                if (row_entity.RoleGroupId != request.RoleGroupId)
                {
                    row_entity.RoleGroupId = request.RoleGroupId;
                    row_entity.IsActive = request.IsActive;
                    row_entity.AssignedDateTime = request.AssignedDateTime;
                    row_entity.IsActive = request.IsActive;
                    row_entity.UpdatedBy = RequestContextHelper.GetUserId(); //request.UpdatedBy;
                    row_entity.UpdatedDate = DateTime.Now;

                    _unitOfWork.UserRoleRepos.Update(row_entity);
                    await _unitOfWork.SaveChangeAsync();
                }
            }
        }

        public async Task DeleteUserRole(int Id)
        {
            var entity_row = await _unitOfWork.UserRoleRepos.GetAsync(u => u.UserRoleId == Id);
            if (entity_row != null)
            {
                _unitOfWork.UserRoleRepos.Remove(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }
    }
}
