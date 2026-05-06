using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office2010.Excel;

namespace BSS_API.Services
{
    public class MasterMachineTypeService : IMasterMachineTypeService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MasterMachineTypeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateMachineType(CreateMachineTypeRequest request)
        {
            var entity_row = await _unitOfWork.MachineTypeRepos.GetAsync(item => item.MachineTypeCode == request.MachineTypeCode.Trim());
            if (entity_row == null)
            {
                var new_entity = new MasterMachineType
                {
                    MachineTypeCode = request.MachineTypeCode.Trim(),
                    MachineTypeName = request.MachineTypeName.Trim(),
                    CreatedBy = RequestContextHelper.GetUserId(),// request.CreatedBy,
                    IsActive = request.IsActive,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.MachineTypeRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.MachineTypeRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<IEnumerable<MasterMachineType>> GetAllMachineType()
        {
            return await _unitOfWork.MachineTypeRepos.GetAllAsync();
        }

        public async Task<MasterMachineTypeViewData> GetMachineTypeById(int Id)
        {
            var result = new MasterMachineTypeViewData();
            var queryData = await _unitOfWork.MachineTypeRepos.GetAsync(item => item.MachineTypeId == Id);
            if (queryData != null)
            {
                result = new MasterMachineTypeViewData()
                {
                    MachineTypeId = queryData.MachineTypeId,
                    MachineTypeCode = queryData.MachineTypeCode,
                    MachineTypeName = queryData.MachineTypeName,
                    IsActive = queryData.IsActive,
                    CreatedBy = queryData.CreatedBy,
                    CreatedDate = queryData.CreatedDate,
                    UpdatedBy = queryData.UpdatedBy,
                    UpdatedDate = queryData.UpdatedDate
                };
            }
            else { result = null; }

            return result;
        }

        public async Task<IEnumerable<MasterMachineType>> GetMachineTypeByUniqueOrKey(string machineTypeCode)
        {
            return await _unitOfWork.MachineTypeRepos.GetAllAsync(item => item.MachineTypeCode == machineTypeCode);
        }

        public async Task UpdateMachineType(UpdateMachineTypeRequest request)
        {
            var row_entity = await _unitOfWork.MachineTypeRepos.GetAsync(item => item.MachineTypeId == request.MachineTypeId);
            row_entity.MachineTypeName = request.MachineTypeName.Trim();
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId(); //request.UpdatedBy;
            row_entity.UpdatedDate = DateTime.Now;

            _unitOfWork.MachineTypeRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteMachineType(int Id)
        {
            var entity_row = await _unitOfWork.MachineTypeRepos.GetAsync(item => item.MachineTypeId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.MachineTypeRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<PagedData<MasterMachineType>> SearchMachineType(PagedRequest<MasterMachineTypeRequest> request)
        {
            var pageData = await _unitOfWork.MachineTypeRepos.SearchMasterMachineType(request);
            return pageData;
        }
    }
}
