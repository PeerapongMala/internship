using Azure.Core;
using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office2016.Excel;

namespace BSS_API.Services
{
    public class MasterStatusService : IMasterStatusService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MasterStatusService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateStatus(CreateStatusRequest request)
        {

            var entity_row = await _unitOfWork.StatusRepos.GetAsync(item => item.StatusCode == request.StatusCode.Trim());
            if (entity_row == null)
            {
                var new_entity = new MasterStatus
                {
                    StatusCode = request.StatusCode != null ? request.StatusCode.Trim() : string.Empty,
                    StatusNameTh = request.StatusNameTh != null ? request.StatusNameTh.Trim() : string.Empty,
                    StatusNameEn = request.StatusNameEn != null ? request.StatusNameEn.Trim() : string.Empty,
                    IsActive = request.IsActive,
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.StatusRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;

                _unitOfWork.StatusRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();

        }

        public async Task DeleteStatus(int Id)
        {

            var entity_row = await _unitOfWork.StatusRepos.GetAsync(item => item.StatusId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;

                _unitOfWork.StatusRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }

        }

        public async Task<IEnumerable<MasterStatus>> GetAllStatus()
        {

            return await _unitOfWork.StatusRepos.GetAllAsync();

        }
        public async Task<IEnumerable<MasterStatus>> GetStatusByUniqueOrKey(string statusCode)
        {
            return await _unitOfWork.StatusRepos.GetAllAsync(item => item.StatusCode == statusCode);
        }

        public async Task<MasterStatus> GetStatusById(int Id)
        {

            var result = new MasterStatus();

            var queryData = await _unitOfWork.StatusRepos.GetAsync(item => item.StatusId == Id);
            if (queryData != null)
            {
                result = new MasterStatus()
                {
                    StatusId = queryData.StatusId,
                    StatusCode = queryData.StatusCode,
                    StatusNameTh = queryData.StatusNameTh,
                    StatusNameEn = queryData.StatusNameEn,
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

        public async Task UpdateStatus(UpdateStatusRequest request)
        {
            var row_entity = await _unitOfWork.StatusRepos.GetAsync(item => item.StatusId == request.StatusId);

            row_entity.StatusCode = request.StatusCode != null ? request.StatusCode.Trim() : string.Empty;
            row_entity.StatusNameTh = request.StatusNameTh != null ? request.StatusNameTh.Trim() : string.Empty;
            row_entity.StatusNameEn = request.StatusNameEn != null ? request.StatusNameEn.Trim() : string.Empty;
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId(); //request.UpdatedBy;
            row_entity.UpdatedDate = DateTime.Now;

            _unitOfWork.StatusRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();

        }

        public async Task<PagedData<MasterStatus>> SearchStatus(PagedRequest<MasterStatusRequest> request)
        {
            var pageData = await _unitOfWork.StatusRepos.SearchMasterStatus(request);
            return pageData;
        }
    }
}
