using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;

namespace BSS_API.Services
{
    public class MasterMachineService : IMasterMachineService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterMachineService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateMachine(CreateMachineRequest request)
        {
            var entity_row =
                await _unitOfWork.MachineRepos.GetAsync(item => item.MachineCode == request.MachineCode.Trim());
            if (entity_row == null)
            {
                var new_entity = new MasterMachine
                {
                    DepartmentId = request.DepartmentId,
                    MachineTypeId = request.MachineTypeId,
                    MachineCode = request.MachineCode.Trim(),
                    MachineName = request.MachineName != null ? request.MachineName.Trim() : string.Empty,
                    HcLength = request.HcLength,
                    PathnameBss = request.PathnameBss != null ? request.PathnameBss.Trim() : string.Empty,
                    PathnameCompleted = request.PathnameCompleted != null ? request.PathnameCompleted.Trim() : string.Empty,
                    PathnameError = request.PathnameError != null ? request.PathnameError.Trim() : string.Empty,
                    IsEmergency = request.IsEmergency,
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    IsActive = request.IsActive,
                    CreatedDate = DateTime.Now
                };
                await _unitOfWork.MachineRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.MachineRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteMachine(int Id)
        {
            var entity_row = await _unitOfWork.MachineRepos.GetAsync(item => item.MachineId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.MachineRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<IEnumerable<MasterMachine>> GetAllMachine()
        {
            return await _unitOfWork.MachineRepos.GetAllAsync();
        }

        public async Task<IEnumerable<MasterMachine>> GetMachineByUniqueOrKey(string machineCode)
        {
            return await _unitOfWork.MachineRepos.GetAllAsync(item => item.MachineCode == machineCode);
        }

        public async Task<IEnumerable<MasterMachineViewData>> GetMachineByFilter(MachineFilterRequest request)
        {
            var machineLists = (from m in await _unitOfWork.MachineRepos.GetAllAsync()
                join mt in await _unitOfWork.MachineTypeRepos.GetAllAsync() on m.MachineTypeId equals mt.MachineTypeId
                    into machineTypeJoin
                join d in await _unitOfWork.DepartmentRepos.GetAllAsync() on m.DepartmentId equals d.DepartmentId into
                    departmentJoin
                from mt in machineTypeJoin.DefaultIfEmpty()
                from d in departmentJoin.DefaultIfEmpty()
                select new MasterMachineViewData
                {
                    DepartmentId = d.DepartmentId,
                    DepartmentName = d.DepartmentName,
                    MachineTypeId = mt.MachineTypeId,
                    MachineTypeName = mt.MachineTypeName,
                    MachineId = m.MachineId,
                    MachineCode = m.MachineCode,
                    MachineName = m.MachineName,
                    HcLength = m.HcLength,
                    PathnameBss = m.PathnameBss,
                    PathnameError=m.PathnameError,
                    PathnameCompleted= m.PathnameCompleted,
                    IsEmergency = m.IsEmergency,
                    IsActive = m.IsActive,
                    CreatedBy = m.CreatedBy,
                    CreatedDate = m.CreatedDate,
                    UpdatedBy = m.UpdatedBy,
                    UpdatedDate = m.UpdatedDate
                }).ToList();

            if (!string.IsNullOrEmpty(request.DepartmentFilter) || !string.IsNullOrEmpty(request.MachineTypeFilter) ||
                !string.IsNullOrEmpty(request.StatusFilter))
            {
                if (!string.IsNullOrEmpty(request.MachineTypeFilter))
                {
                    machineLists = machineLists.Where(x => x.MachineTypeId == request.MachineTypeFilter.AsInt())
                        .ToList();
                }

                if (!string.IsNullOrEmpty(request.DepartmentFilter))
                {
                    machineLists = machineLists.Where(x => x.DepartmentId == request.DepartmentFilter.AsInt()).ToList();
                }

                if (!string.IsNullOrEmpty(request.StatusFilter))
                {
                    machineLists = machineLists.Where(x => x.IsActive == (request.StatusFilter == "1" ? true : false))
                        .ToList();
                }
            }

            return machineLists;
        }

        public async Task<MasterMachineViewData> GetMachineById(int Id)
        {
            var result = new MasterMachineViewData();

            var machineData = await _unitOfWork.MachineRepos.GetById(Id);
            if (machineData != null)
            {
                result.MachineId = machineData.MachineId;
                result.DepartmentId = machineData.DepartmentId;
                result.MachineTypeId = machineData.MachineTypeId;
                result.MachineCode = machineData.MachineCode;
                result.MachineName = machineData.MachineName;
                result.HcLength = machineData.HcLength;
                result.PathnameBss = machineData.PathnameBss;
                result.PathnameCompleted = machineData.PathnameCompleted;
                result.PathnameError = machineData.PathnameError;
                result.IsEmergency = machineData.IsEmergency;
                result.IsActive = machineData.IsActive;
                result.CreatedBy = machineData.CreatedBy;
                result.CreatedDate = machineData.CreatedDate;
                result.UpdatedBy = machineData.UpdatedBy;
                result.UpdatedDate = machineData.UpdatedDate;
                result.DepartmentId = machineData.DepartmentId;
                result.DepartmentName = machineData.MasterDepartment.DepartmentName; 
                result.MachineTypeId = machineData.MachineTypeId;
                result.MachineTypeName = machineData.MasterMachineType.MachineTypeName;
            }
            else
            {
                result = null;
            }

            return result;
        }

        public async Task<IEnumerable<MasterMachineViewData>> GetMachineByDepartment(int departmentId)
        {
            var queryData = (from m in _unitOfWork.MachineRepos.GetAll()
                where m.DepartmentId == departmentId && m.IsActive == true
                select new MasterMachineViewData
                {
                    MachineId = m.MachineId,
                    DepartmentId = m.DepartmentId,
                    MachineTypeId = m.MachineTypeId,
                    MachineCode = m.MachineCode,
                    MachineName = m.MachineName,
                    HcLength = m.HcLength,
                    PathnameBss = m.PathnameBss,
                    IsEmergency = m.IsEmergency,
                    IsActive = m.IsActive,
                    CreatedBy = m.CreatedBy,
                    CreatedDate = m.CreatedDate,
                    UpdatedBy = m.UpdatedBy,
                    UpdatedDate = m.UpdatedDate
                }).ToList();

            if (queryData != null && queryData.Count > 0)
            {
                return queryData;
            }
            else
            {
                return null;
            }
        }

        public async Task UpdateMachine(UpdateMachineRequest request)
        {
            var row_entity = await _unitOfWork.MachineRepos.GetAsync(item => item.MachineId == request.MachineId);

            row_entity.DepartmentId = request.DepartmentId;
            row_entity.MachineTypeId = request.MachineTypeId;
            row_entity.MachineCode = request.MachineCode.Trim();
            row_entity.MachineName = request.MachineName != null ? request.MachineName.Trim() : string.Empty;
            row_entity.HcLength = request.HcLength;
            row_entity.PathnameBss = request.PathnameBss != null ? request.PathnameBss.Trim() : string.Empty;
            row_entity.PathnameCompleted = request.PathnameCompleted != null ? request.PathnameCompleted.Trim() : string.Empty;
            row_entity.PathnameError = request.PathnameError != null ? request.PathnameError.Trim() : string.Empty;
            row_entity.IsEmergency = request.IsEmergency;
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId(); //request.UpdatedBy;
            row_entity.UpdatedDate = DateTime.Now;

            _unitOfWork.MachineRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<PagedData<MasterMachineViewData>> SearchMachine(PagedRequest<MasterMachineRequest> request)
        {
            var pageData = await _unitOfWork.MachineRepos.SearchMasterMachine(request);
            return pageData.Map(x => new MasterMachineViewData
            {
                MachineId = x.MachineId,
                MachineCode = x.MachineCode,
                MachineName = x.MachineName,
                DepartmentId = x.DepartmentId,
                DepartmentName = x.MasterDepartment?.DepartmentName,
                MachineTypeId = x.MachineTypeId,
                MachineTypeName = x.MasterMachineType?.MachineTypeName,
                HcLength = x.HcLength,
                PathnameBss= x.PathnameBss,
                PathnameCompleted = x.PathnameCompleted,
                PathnameError = x.PathnameError,
                IsEmergency = x.IsEmergency,
                IsActive = x.IsActive,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate
            });
        }
    }
}