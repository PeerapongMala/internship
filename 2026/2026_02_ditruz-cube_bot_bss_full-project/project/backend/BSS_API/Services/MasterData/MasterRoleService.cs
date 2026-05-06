using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.InkML;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Vml.Office;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Http.HttpResults;
using Newtonsoft.Json;

namespace BSS_API.Services
{
    public class MasterRoleService : IMasterRoleService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterRoleService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateRole(CreateRoleRequest request)
        {
            var entity_row = await _unitOfWork.RoleRepos.GetAsync(item => item.RoleCode == request.RoleCode.Trim() &&
                                                                  item.RoleGroupId == request.RoleGroupId);
            if (entity_row == null)
            {
                var maxSeq = _unitOfWork.RoleRepos.GetAll().Max(p => p.SeqNo);
                var new_entity = new MasterRole
                {
                    RoleGroupId = request.RoleGroupId,
                    RoleCode = request.RoleCode.Trim(),
                    RoleName = request.RoleName.Trim(),
                    RoleDescription = request.RoleDescription != null ? request.RoleDescription.Trim() : string.Empty,
                    IsGetOtpSupervisor = request.IsGetOtpSupervisor,
                    IsGetOtpManager = request.IsGetOtpManager,
                    IsActive = request.IsActive,
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    CreatedDate = DateTime.Now,
                    SeqNo = maxSeq + 1
                };

                await _unitOfWork.RoleRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;

                _unitOfWork.RoleRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<IEnumerable<MasterRole>> GetAllRoles()
        {
            return await _unitOfWork.RoleRepos.GetAllAsync();
        }

        public async Task<MasterRole> GetRoleByCode(string roleCode)
        {
            return await _unitOfWork.RoleRepos.GetAsync(item => item.RoleCode == roleCode);
        }

        public async Task<IEnumerable<MasterRole>> GetRoleByRoleGroup(int roleGroupId)
        {
            return await _unitOfWork.RoleRepos.GetAllAsync(item => item.RoleGroupId == roleGroupId);
        }


        public async Task<MasterRoleViewData> GetRoleById(int Id)
        {
            var result = new MasterRoleViewData();

            var roleData = await _unitOfWork.RoleRepos.GetAsync(r => r.RoleId == Id);
            if (roleData != null)
            {
                result.RoleId = roleData.RoleId;
                result.RoleCode = roleData.RoleCode;
                result.RoleName = roleData.RoleName;
                result.RoleDescription = roleData.RoleDescription;
                result.SeqNo = roleData.SeqNo;
                result.IsGetOtpSupervisor = roleData.IsGetOtpSupervisor;
                result.IsGetOtpManager = roleData.IsGetOtpManager;
                result.IsActive = roleData.IsActive;
                result.CreatedBy = roleData.CreatedBy;
                result.CreatedDate = roleData.CreatedDate;
                result.UpdatedBy = roleData.UpdatedBy;
                result.UpdatedDate = roleData.UpdatedDate;

                var roleGroupData = await _unitOfWork.RoleGroupRepos.GetAsync(rg => rg.RoleGroupId == roleData.RoleGroupId);
                result.RoleGroupId = roleGroupData.RoleGroupId;
                result.RoleGroupName = roleGroupData.RoleGroupName;
            }
            else
            {
                result = null;
            }

            return result;
        }

        public async Task<IEnumerable<MasterRoleViewData>> GetRoleByFilter(RoleFilterRequest filter)
        {

            var queryDataLists = (from r in await _unitOfWork.RoleRepos.GetAllAsync()
                                  join rg in await _unitOfWork.RoleGroupRepos.GetAllAsync() on r.RoleGroupId equals rg.RoleGroupId into roleGroupJoin
                                  from rg in roleGroupJoin.DefaultIfEmpty()
                                  select new MasterRoleViewData
                                  {
                                      RoleGroupId = rg.RoleGroupId,
                                      RoleGroupName = rg.RoleGroupName,
                                      RoleId = r.RoleId,
                                      RoleCode = r.RoleCode,
                                      RoleName = r.RoleName,
                                      RoleDescription = r.RoleDescription,
                                      SeqNo = r.SeqNo,
                                      IsGetOtpSupervisor = r.IsGetOtpSupervisor,
                                      IsGetOtpManager = r.IsGetOtpManager,
                                      IsActive = r.IsActive,
                                      CreatedBy = r.CreatedBy,
                                      CreatedDate = r.CreatedDate,
                                      UpdatedBy = r.UpdatedBy,
                                      UpdatedDate = r.UpdatedDate
                                  }).ToList();


            if (!string.IsNullOrEmpty(filter.RoleGroupFilter) || !string.IsNullOrEmpty(filter.StatusFilter))
            {
                if (!string.IsNullOrEmpty(filter.RoleGroupFilter))
                {
                    queryDataLists = queryDataLists.Where(x => x.RoleGroupId == filter.RoleGroupFilter.AsInt()).ToList();
                }

                if (!string.IsNullOrEmpty(filter.StatusFilter))
                {
                    queryDataLists = queryDataLists.Where(x => x.IsActive == (filter.StatusFilter == "1" ? true : false)).ToList();
                }

            }
            return queryDataLists;

        }

        public async Task<IEnumerable<MasterRole>> GetRoleByUniqueOrKey(string roleCode, int roleGroupId)
        {
            return await _unitOfWork.RoleRepos.GetAllAsync(item => item.RoleCode == roleCode && item.RoleGroupId == roleGroupId);
        }


        public async Task UpdateRole(UpdateRoleRequest request)
        {
            var entity_row = await _unitOfWork.RoleRepos.GetAsync(item => item.RoleId == request.RoleId);
            entity_row.RoleCode = request.RoleCode;
            entity_row.RoleName = request.RoleName.Trim();
            entity_row.RoleDescription = request.roleDescription != null ? request.roleDescription.Trim() : string.Empty;
            entity_row.IsActive = request.IsActive;
            entity_row.IsGetOtpSupervisor = request.IsGetOtpSupervisor;
            entity_row.IsGetOtpManager = request.IsGetOtpManager;
            entity_row.UpdatedBy = RequestContextHelper.GetUserId();// request.UpdatedBy;
            entity_row.UpdatedDate = DateTime.Now;
            //the original is not updatable, bot bug request to be updatable
            entity_row.RoleGroupId = request.RoleGroupId;

            _unitOfWork.RoleRepos.Update(entity_row);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteRole(int id)
        {
            var entity_row = await _unitOfWork.RoleRepos.GetAsync(item => item.RoleId == id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.RoleRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<PagedData<MasterRoleViewData>> SearchRole(PagedRequest<MasterRoleRequest> request)
        {
            var pageData = await _unitOfWork.RoleRepos.SearchRole(request);
            return pageData.Map(x => new MasterRoleViewData
            {
                RoleId = x.RoleId,
                RoleCode = x.RoleCode,
                RoleName = x.RoleName,
                RoleDescription = x.RoleDescription,
                IsActive = x.IsActive,
                RoleGroupId = x.RoleGroupId,
                RoleGroupName = x.MasterRoleGroup.RoleGroupName,
                SeqNo = x.SeqNo,
                IsGetOtpSupervisor = x.IsGetOtpSupervisor,
                IsGetOtpManager = x.IsGetOtpManager,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate
            });
        }

     
    }
}
