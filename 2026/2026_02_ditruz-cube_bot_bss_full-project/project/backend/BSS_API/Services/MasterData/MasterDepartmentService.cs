using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;

namespace BSS_API.Services
{
    public class MasterDepartmentService : IMasterDepartmentService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterDepartmentService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateDepartment(CreateDepartmentRequest request)
        {

            var entity_row = await _unitOfWork.DepartmentRepos.GetAsync(item => item.DepartmentCode == request.DepartmentCode.Trim()
                                                                     && item.DepartmentShortName == request.DepartmentShortName.Trim());

            if (entity_row == null)
            {
                var new_entity = new MasterDepartment
                {
                    DepartmentCode = request.DepartmentCode.Trim(),
                    DepartmentShortName = request.DepartmentShortName.Trim(),
                    DepartmentName = request.DepartmentName.Trim(),
                    CreatedBy = RequestContextHelper.GetUserId(),// request.CreatedBy,
                    IsActive = request.IsActive,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.DepartmentRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.DepartmentRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteDepartment(int Id)
        {
            var entity_row = await _unitOfWork.DepartmentRepos.GetAsync(item => item.DepartmentId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.DepartmentRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<IEnumerable<MasterDepartment>> GetAllDepartment()
        {
            return await _unitOfWork.DepartmentRepos.GetAllAsync();
        }

        public async Task<IEnumerable<MasterDepartment>> GetDepartmentsActivceAsync()
        {
            return await _unitOfWork.DepartmentRepos.GetAllAsync(d => d.IsActive == true);
        }

        public async Task<IEnumerable<MasterDepartmentViewData>> GetDepartmentByFilter(DepartmentFilterRequest filter)
        {
            var result = new List<MasterDepartmentViewData>();
            if (!string.IsNullOrEmpty(filter.StatusFilter))
            {
                var queryDataLists = (from r in await _unitOfWork.DepartmentRepos.GetAllAsync(item => item.IsActive == (filter.StatusFilter == "1" ? true : false))
                                      select new MasterDepartmentViewData
                                      {
                                          DepartmentId = r.DepartmentId,
                                          DepartmentCode = r.DepartmentCode,
                                          DepartmentShortName = r.DepartmentShortName,
                                          DepartmentName = r.DepartmentName,
                                          IsActive = r.IsActive,
                                          CreatedBy = r.CreatedBy,
                                          CreatedDate = r.CreatedDate,
                                          UpdatedBy = r.UpdatedBy,
                                          UpdatedDate = r.UpdatedDate
                                      }).ToList();
                result.AddRange(queryDataLists);
            }
            else
            {
                var queryDataLists = (from r in await _unitOfWork.DepartmentRepos.GetAllAsync()
                                      select new MasterDepartmentViewData
                                      {
                                          DepartmentId = r.DepartmentId,
                                          DepartmentCode = r.DepartmentCode,
                                          DepartmentShortName = r.DepartmentShortName,
                                          DepartmentName = r.DepartmentName,
                                          IsActive = r.IsActive,
                                          CreatedBy = r.CreatedBy,
                                          CreatedDate = r.CreatedDate,
                                          UpdatedBy = r.UpdatedBy,
                                          UpdatedDate = r.UpdatedDate
                                      }).ToList();
                result.AddRange(queryDataLists);
            }

            return result;
        }

        public async Task<MasterDepartmentViewData> GetDepartmentById(int Id)
        {

            var result = new MasterDepartmentViewData();

            var queryData = await _unitOfWork.DepartmentRepos.GetAsync(item => item.DepartmentId == Id);
            if (queryData != null)
            {
                result = new MasterDepartmentViewData()
                {
                    DepartmentId = queryData.DepartmentId,
                    DepartmentCode = queryData.DepartmentCode,
                    DepartmentShortName = queryData.DepartmentShortName,
                    DepartmentName = queryData.DepartmentName,
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

        public async Task<IEnumerable<MasterDepartment>> GetDepartmentByUniqueOrKey(string departmentCode)
        {
            return await _unitOfWork.DepartmentRepos.GetAllAsync(item => item.DepartmentCode == departmentCode);
        }

        public async Task UpdateDepartment(UpdateDepartmentRequest request)
        {
            var entity_row = await _unitOfWork.DepartmentRepos.GetAsync(item => item.DepartmentId == request.DepartmentId);
            entity_row.DepartmentCode = request.DepartmentCode.Trim();
            entity_row.DepartmentShortName = request.DepartmentShortName.Trim();
            entity_row.DepartmentName = request.DepartmentName.Trim();
            entity_row.IsActive = request.IsActive;
            entity_row.UpdatedBy = RequestContextHelper.GetUserId();// request.UpdatedBy;
            entity_row.UpdatedDate = DateTime.Now;

            _unitOfWork.DepartmentRepos.Update(entity_row);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<PagedData<MasterDepartment>> SearchDepartment(PagedRequest<MasterDepartmentRequest> req)
        {
            return await _unitOfWork.DepartmentRepos.SearchDepartment(req);

        }
    }
}
