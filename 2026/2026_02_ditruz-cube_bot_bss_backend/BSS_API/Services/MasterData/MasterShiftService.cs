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
    public class MasterShiftService : IMasterShiftService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterShiftService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateShift(CreateShiftRequest request)
        {
            var entity_row = await _unitOfWork.ShiftRepos.GetAsync(item => item.ShiftCode == request.ShiftCode.Trim());
            if (entity_row == null)
            {
                var new_entity = new MasterShift
                {
                    ShiftCode = request.ShiftCode.Trim(),
                    ShiftName = request.ShiftName != null ? request.ShiftName.Trim() : string.Empty,
                    ShiftStartTime = request.ShiftStartTime.Trim(),
                    ShiftEndTime = request.ShiftEndTime.Trim(),
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    IsActive = request.IsActive,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.ShiftRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;

                _unitOfWork.ShiftRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<IEnumerable<MasterShift>> GetAllShift()
        {
            return await _unitOfWork.ShiftRepos.GetAllAsync();
        }

        public async Task<IEnumerable<ShiftInfoData>> GetShiftInfoActiveAsync()
        {
            return await _unitOfWork.ShiftRepos.GetShiftInfoActiveAsync();
        }

        public async Task<MasterShiftViewData> GetShiftById(int Id)
        {
            var result = new MasterShiftViewData();
            var queryData = await _unitOfWork.ShiftRepos.GetAsync(item => item.ShiftId == Id);
            if (queryData != null)
            {

                result = new MasterShiftViewData()
                {
                    ShiftId = queryData.ShiftId,
                    ShiftCode = queryData.ShiftCode,
                    ShiftName = queryData.ShiftName,
                    ShiftStartTime = queryData.ShiftStartTime,
                    ShiftEndTime = queryData.ShiftEndTime,
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

        public async Task<IEnumerable<MasterShift>> GetShiftByUniqueOrKey(string shiftCode)
        {
            return await _unitOfWork.ShiftRepos.GetAllAsync(item => item.ShiftCode == shiftCode);
        }

        public async Task UpdateShift(UpdateShiftRequest request)
        {
            var row_entity = await _unitOfWork.ShiftRepos.GetAsync(item => item.ShiftId == request.ShiftId);
            row_entity.ShiftCode = request.ShiftCode;
            row_entity.ShiftName = request.ShiftName != null ? request.ShiftName.Trim() : string.Empty;
            row_entity.ShiftStartTime = request.ShiftStartTime.Trim();
            row_entity.ShiftEndTime = request.ShiftEndTime.Trim();
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId(); //request.UpdatedBy;
            row_entity.UpdatedDate = DateTime.Now;
            
            _unitOfWork.ShiftRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteShift(int Id)
        {
            var entity_row = await _unitOfWork.ShiftRepos.GetAsync(item => item.ShiftId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.ShiftRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<PagedData<MasterShift>> SearchShift(PagedRequest<MasterShiftRequest> request)
        {
            var pageData = await _unitOfWork.ShiftRepos.SearchMasterShift(request);
            return pageData;
        }
    }
}
