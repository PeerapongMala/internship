using Azure.Core;
using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.ResponseModels;
using BSS_API.Repositories;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Bibliography;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Office2016.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Vml.Office;
using DocumentFormat.OpenXml.Wordprocessing;
using Microsoft.AspNetCore.Http.HttpResults;

namespace BSS_API.Services
{
    public class MasterUserService : IMasterUserService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterUserService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateUser(CreateUserRequest request)
        {
            int newUserId = 0;

            var entity_row = await _unitOfWork.UserRepos.GetAsync(item => item.DepartmentId == request.DepartmentId &&
                                                                  item.UserName == request.UserName.Trim());

            if (entity_row == null)
            {
                var new_entity = new MasterUser
                {
                    UserName = request.UserName.Trim(),
                    UsernameDisplay = request.UsernameDisplay.Trim(),
                    UserEmail = request.UserEmail.Trim(),
                    FirstName = request.FirstName.Trim(),
                    LastName = request.LastName.Trim(),
                    DepartmentId = request.DepartmentId,
                    IsInternal = request.UserName.Length > 30 ? true : false,
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    StartDate = request.StartDate ,
                    EndDate = request.EndDate ,
                    IsActive = request.IsActive,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.UserRepos.AddAsync(new_entity);
                newUserId = new_entity.UserId;
            }
            else
            {
                newUserId = entity_row.UserId;
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.UserRepos.Update(entity_row);
            }

            List<int> roleGroupIdList = request.RoleGroupIdList
                                            .Split(',', StringSplitOptions.RemoveEmptyEntries)
                                            .Select(x => int.Parse(x))
                                            .ToList();
            foreach (int roleGroupId in roleGroupIdList)
            {
                var userRole_ntity = await _unitOfWork.UserRoleRepos.GetAsync(item => item.UserId == newUserId && item.RoleGroupId == roleGroupId);
                if (userRole_ntity == null)
                {
                    var newUserRole = new MasterUserRole
                    {
                        UserId = newUserId,
                        RoleGroupId = roleGroupId,
                        AssignedDateTime = DateTime.Now,
                        IsActive = request.IsActive,
                        CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    await _unitOfWork.UserRoleRepos.AddAsync(newUserRole);
                }
                else
                {
                    userRole_ntity.IsActive = true;
                    userRole_ntity.UpdatedBy = RequestContextHelper.GetUserId(); //request.CreatedBy;
                    userRole_ntity.UpdatedDate = DateTime.Now;
                    _unitOfWork.UserRoleRepos.Update(userRole_ntity);
                }
            }
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<IEnumerable<MasterUser>> GetAllUsers()
        {
            return await _unitOfWork.UserRepos.GetAllAsync();
        }

        public async Task<IEnumerable<MasterUser>> GetUserByUserName(string userName)
        {
            return await _unitOfWork.UserRepos.GetAllAsync(item => item.UserName == userName.Trim());
        }

        public async Task<IEnumerable<MasterUser>> GetUserByEmail(string userEmail)
        {
            return await _unitOfWork.UserRepos.GetAllAsync(item => item.UserEmail == userEmail.Trim());
        }

        public async Task<IEnumerable<MasterUserViewData>> GetUserByFilter(GetUserByFilterRequest filter)
        {

            var userDataList = new List<MasterUserViewData>();
            var userDataFilter = new List<MasterUser>();

            if (!string.IsNullOrEmpty(filter.DepartmentFilter) || !string.IsNullOrEmpty(filter.StatusFilter))
            {
                var userData = await _unitOfWork.UserRepos.GetAllAsync();

                if (!string.IsNullOrEmpty(filter.DepartmentFilter))
                {
                    userDataFilter = userData.Where(item => item.DepartmentId == filter.DepartmentFilter.AsInt()).ToList();
                }
                else
                {
                    userDataFilter.AddRange(userData);
                }

                if (!string.IsNullOrEmpty(filter.StatusFilter))
                {
                    userDataFilter = userDataFilter.Where(item => item.IsActive == (filter.StatusFilter == "1" ? true : false)).ToList();
                }

            }
            else
            {
                var userDataAll = await _unitOfWork.UserRepos.GetAllAsync();
                userDataFilter.AddRange(userDataAll);
            }


            foreach (var item in userDataFilter)
            {
                var userDataItem = new MasterUserViewData();
                userDataItem.UserId = item.UserId;
                userDataItem.UserName = item.UserName;
                userDataItem.UsernameDisplay = item.UsernameDisplay;
                userDataItem.UserEmail = item.UserEmail;
                userDataItem.FirstName = item.FirstName;
                userDataItem.LastName = item.LastName;
                userDataItem.IsInternal = item.IsInternal;
                userDataItem.IsActive = item.IsActive;
                userDataItem.CreatedBy = item.CreatedBy;
                userDataItem.CreatedDate = item.CreatedDate;
                userDataItem.UpdatedBy = item.UpdatedBy;
                userDataItem.UpdatedDate = item.UpdatedDate;
                userDataItem.DepartmentId = item.DepartmentId;
                userDataItem.StartDate = item.StartDate;
                userDataItem.EndDate = item.EndDate;

                var departmentData = await _unitOfWork.DepartmentRepos.GetAsync(d => d.DepartmentId == item.DepartmentId);
                if (departmentData != null)
                {
                    userDataItem.DepartmentName = departmentData.DepartmentName;
                }

                var userRoleData = await _unitOfWork.UserRoleRepos.GetAsync(ur => ur.UserId == item.UserId);
                if (userRoleData != null)
                {
                    userDataItem.RoleGroupId = userRoleData.RoleGroupId;
                }

                userDataList.Add(userDataItem);
            }

            //var queryUserLists = (from u in await _unitOfWork.UserRepos.GetAllAsync()
            //                      join d in await _unitOfWork.DepartmentRepos.GetAllAsync() on u.DepartmentId equals d.DepartmentId into deptJoin
            //                      from d in deptJoin.DefaultIfEmpty()
            //                      join ur in await _unitOfWork.UserRoleRepos.GetAllAsync() on u.UserId equals ur.UserId into userRoleJoin
            //                      from ur in userRoleJoin.DefaultIfEmpty()
            //                      select new MasterUserViewData
            //                      {
            //                          UserId = u.UserId,
            //                          UserName = u.UserName,
            //                          UsernameDisplay = u.UsernameDisplay,
            //                          UserEmail = u.UserEmail,
            //                          FirstName = u.FirstName,
            //                          LastName = u.LastName,
            //                          IsInternal = u.IsInternal,
            //                          IsActive = u.IsActive,
            //                          CreatedBy = u.CreatedBy,
            //                          CreatedDate = u.CreatedDate,
            //                          UpdatedBy = u.UpdatedBy,
            //                          UpdatedDate = u.UpdatedDate,
            //                          DepartmentId = u.DepartmentId,
            //                          DepartmentName = d.DepartmentName,
            //                          RoleGroupId = ur.RoleGroupId,
            //                          StartDate = u.StartDate.AsString("dd/MM/yyyy", false),
            //                          EndDate = u.EndDate.AsString("dd/MM/yyyy", false),
            //                      }).ToList();

            //if (!string.IsNullOrEmpty(filter.DepartmentFilter) || !string.IsNullOrEmpty(filter.StatusFilter))
            //{

            //    if (!string.IsNullOrEmpty(filter.DepartmentFilter))
            //    {
            //        queryUserLists = queryUserLists.Where(x => x.DepartmentId == filter.DepartmentFilter.AsInt()).ToList();
            //    }

            //    if (!string.IsNullOrEmpty(filter.StatusFilter))
            //    {
            //        queryUserLists = queryUserLists.Where(x => x.IsActive == (filter.StatusFilter == "1" ? true : false)).ToList();
            //    }

            //}

            return userDataList;
        }

        public async Task<IEnumerable<UserInfoData>> GetOperatorUsersActive(GetSorterUsersRequest request)
        {
            var userList = new List<UserInfoData>();

            var userRequestInfo = await _unitOfWork.UserRepos.GetAsync(item => item.UserId == request.RequestByUserId);
            var userListByDepartment = await _unitOfWork.UserRepos.GetAllAsync(u => u.DepartmentId == request.DepartmentId &&
                                                                               u.IsActive == true &&
                                                                               u.IsInternal == userRequestInfo.IsInternal);

            if (userListByDepartment != null)
            {
                foreach (var user in userListByDepartment)
                {
                    var userRole = await _unitOfWork.UserRoleRepos.GetAsync(ur => ur.UserId == user.UserId);
                    if (userRole != null)
                    {
                        var userRoleGroup = await _unitOfWork.RoleGroupRepos.GetAsync(rg => rg.RoleGroupId == userRole.RoleGroupId);
                        if (userRoleGroup != null && userRoleGroup.RoleGroupCode == "RG01")
                        {
                            var userItem = new UserInfoData();
                            userItem.UserId = user.UserId;
                            userItem.UserName = user.UserName;
                            userItem.UsernameDisplay = user.UsernameDisplay;
                            userItem.UserEmail = user.UserEmail;
                            userItem.FirstName = user.FirstName;
                            userItem.LastName = user.LastName;
                            userItem.IsInternal = user.IsInternal;
                            userList.Add(userItem);
                        }
                    }
                }
            }

            //var queryUserLists = (from u in await _unitOfWork.UserRepos.GetAllAsync()
            //                      join ur in await _unitOfWork.UserRoleRepos.GetAllAsync() on u.UserId equals ur.UserId into userRoleJoin
            //                      from ur in userRoleJoin.DefaultIfEmpty()
            //                      join rg in await _unitOfWork.RoleGroupRepos.GetAllAsync() on ur.RoleGroupId equals rg.RoleGroupId into roleGroupJoin
            //                      from rg in roleGroupJoin.DefaultIfEmpty()
            //                      where u.DepartmentId == request.DepartmentId &&
            //                            u.IsActive == true &&
            //                            u.IsInternal == userRequest.IsInternal &&
            //                            rg.RoleGroupCode == "RG01"
            //                      select new UserInfoData
            //                      {
            //                          UserId = u.UserId,
            //                          UserName = u.UserName,
            //                          UsernameDisplay = u.UsernameDisplay,
            //                          UserEmail = u.UserEmail,
            //                          FirstName = u.FirstName,
            //                          LastName = u.LastName,
            //                          IsInternal = u.IsInternal
            //                      }).ToList();


            //userList.AddRange(queryUserLists);
            return userList;
        }


        public async Task<MasterUserViewData> GetUserById(int Id)
        {
            var userDataItem = new MasterUserViewData();

            var userData = await _unitOfWork.UserRepos.GetAsync(u => u.UserId == Id, "MasterDepartment,MasterUserRole,MasterUserRole.MasterRoleGroup");
            if (userData != null)
            {
                userDataItem.UserId = userData.UserId;
                userDataItem.UserName = userData.UserName;
                userDataItem.UsernameDisplay = userData.UsernameDisplay;
                userDataItem.UserEmail = userData.UserEmail;
                userDataItem.FirstName = userData.FirstName;
                userDataItem.LastName = userData.LastName;
                userDataItem.IsInternal = userData.IsInternal;
                userDataItem.IsActive = userData.IsActive;
                userDataItem.CreatedBy = userData.CreatedBy;
                userDataItem.CreatedDate = userData.CreatedDate;
                userDataItem.UpdatedBy = userData.UpdatedBy;
                userDataItem.UpdatedDate = userData.UpdatedDate;
                userDataItem.DepartmentId = userData.DepartmentId;
                userDataItem.StartDate = userData.StartDate ;
                userDataItem.EndDate = userData.EndDate ;
                

                //var departmentData = await _unitOfWork.DepartmentRepos.GetAsync(d => d.DepartmentId == userData.DepartmentId);
                //if (departmentData != null)
                //{
                //    userDataItem.DepartmentName = departmentData.DepartmentName;
                //}

                //var userRoleData = await _unitOfWork.UserRoleRepos.GetAsync(ur => ur.UserId == userData.UserId);
                //if (userRoleData != null)
                //{
                //    userDataItem.RoleGroupId = userRoleData.RoleGroupId;
                //}
                
                userDataItem.DepartmentName = userData.MasterDepartment.DepartmentName;
                userDataItem.RoleGroupId = userData.MasterUserRole
                                            .Where(r => r.IsActive == true)
                                            .OrderBy(o => o.RoleGroupId)
                                            .Select(r => (int?)r.RoleGroupId)
                                            .FirstOrDefault() ?? 0;
                userDataItem.RoleGroupName = userData.MasterUserRole
                                            .Where(r => r.IsActive == true)
                                            .OrderBy(o => o.RoleGroupId)
                                            .Select(r => r.MasterRoleGroup.RoleGroupName)
                                            .FirstOrDefault() ?? string.Empty;
            }
            else
            {
                userDataItem = null;
            }

            return userDataItem;
        }

        public async Task UpdateUser(UpdateUserRequest request)
        {
            //the database design support user has multiple role groups
            //BUT requirement confirm only one role group is permit

             

            var row_entity = await _unitOfWork.UserRepos.GetAsync(item => item.UserId == request.UserId, tracked: true);
            if (row_entity != null)
            {
                row_entity.DepartmentId = request.DepartmentId;
                row_entity.FirstName = request.FirstName.Trim();
                row_entity.LastName = request.LastName.Trim();
                row_entity.StartDate = request.StartDate;
                row_entity.EndDate = request.EndDate;
                row_entity.IsActive = request.IsActive;
                row_entity.UpdatedBy = RequestContextHelper.GetUserId();
                row_entity.UpdatedDate = DateTime.Now;

               

                // ── 1. Inactivate roles that are NOT in the incoming  
                var existingUserRoles = await _unitOfWork.UserRoleRepos.GetAllAsync(
                    item => item.UserId == request.UserId, tracked: true);

                foreach (var existingRole in existingUserRoles)
                {
                    if (request.RoleGroupId!= existingRole.RoleGroupId)
                    {
                        existingRole.IsActive = false;
                        existingRole.UpdatedBy = RequestContextHelper.GetUserId();
                        existingRole.UpdatedDate = DateTime.Now;
                    }
                }

                // ── 2. Add or reactivate roles that ARE in the incoming 
                 
                    var userRole_entity = await _unitOfWork.UserRoleRepos.GetAsync(
                        item => item.UserId == request.UserId && item.RoleGroupId == request.RoleGroupId, tracked: true);

                    if (userRole_entity == null)
                    {
                        var newUserRole = new MasterUserRole
                        {
                            UserId = request.UserId,
                            RoleGroupId = request.RoleGroupId,
                            AssignedDateTime = DateTime.Now,
                            IsActive = request.IsActive,
                            CreatedBy = RequestContextHelper.GetUserId(),
                            CreatedDate = DateTime.Now
                        };
                        await _unitOfWork.UserRoleRepos.AddAsync(newUserRole);
                    }
                    else
                    {
                        userRole_entity.IsActive = true;
                        userRole_entity.UpdatedBy = RequestContextHelper.GetUserId();
                        userRole_entity.UpdatedDate = DateTime.Now;
                    }
                 

                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task DeleteUser(DeleteUserRequest request)
        {
            var userData = await _unitOfWork.UserRepos.GetAsync(item => item.UserId == request.UserId, "MasterDepartment,MasterUserRole,MasterUserRole.MasterRoleGroup");
            //var userRoleData = await _unitOfWork.UserRoleRepos.GetAsync(u => u.UserId == request.UserId);

            if (userData != null)
            {
                if (userData.MasterUserRole != null) {
                    foreach (var role in userData.MasterUserRole) {
                        var userHis = new MasterUserHistory
                        {
                            UserId = userData.UserId,
                            DepartmentId = userData.DepartmentId,
                            RoleGroupId = role.RoleGroupId,
                            UserName = userData.UserName,
                            UserEmail = userData.UserEmail,
                            FirstName = userData.FirstName,
                            LastName = userData.LastName,
                            IsInternal = userData.IsInternal,
                            StartDate = userData.StartDate,
                            EndDate = userData.EndDate,
                            UserCreatedDate = userData.CreatedDate,
                            CreatedBy = RequestContextHelper.GetUserId(),
                            CreatedDate = DateTime.Now,
                            UpdatedBy = RequestContextHelper.GetUserId(),
                            UpdatedDate = DateTime.Now
                        };
                        await _unitOfWork.UserHistoryRepos.AddAsync(userHis);
                        _unitOfWork.UserRoleRepos.Remove(role);
                    } 
                }  
                _unitOfWork.UserRepos.Remove(userData); 
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<PagedData<MasterUserViewData>> SearchUser(PagedRequest<MasterUserRequest> request)
        {
            var pageData = await _unitOfWork.UserRepos.SearchMasterUser(request);
            return pageData;
        }
    }
}
