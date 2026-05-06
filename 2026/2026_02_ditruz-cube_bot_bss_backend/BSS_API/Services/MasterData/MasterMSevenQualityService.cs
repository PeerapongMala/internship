using Azure.Core;
using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;


namespace BSS_API.Services
{
    public class MasterMSevenQualityService : IMasterMSevenQualityService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MasterMSevenQualityService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task CreateMSevenQuality(CreateMSevenQualityRequest request)
        {

            var entity_row = await _unitOfWork.MSevenQualityRepos.GetAsync(item => item.M7QualityCode == request.M7QualityCode.Trim());
            if (entity_row == null)
            {
                var new_entity = new MasterMSevenQuality
                {
                    M7QualityCode = request.M7QualityCode != null ? request.M7QualityCode.Trim() : string.Empty,
                    M7QualityDescrpt = request.M7QualityDescrpt != null ? request.M7QualityDescrpt.Trim() : string.Empty,
                    M7QualityCps = request.M7QualityCps != null ? request.M7QualityCps.Trim() : string.Empty,
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    IsActive = request.IsActive,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.MSevenQualityRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy= RequestContextHelper.GetUserId();
                entity_row.UpdatedDate= DateTime.Now;
                _unitOfWork.MSevenQualityRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();

        }

        public async Task UpdateMSevenQuality(UpdateMSevenQualityRequest request)
        {
            var row_entity = await _unitOfWork.MSevenQualityRepos.GetAsync(item => item.M7QualityId == request.M7QualityId);

            row_entity.M7QualityCode = request.M7QualityCode != null ? request.M7QualityCode.Trim() : string.Empty;
            row_entity.M7QualityDescrpt = request.M7QualityDescrpt != null ? request.M7QualityDescrpt.Trim() : string.Empty;
            row_entity.M7QualityCps = request.M7QualityCps != null ? request.M7QualityCps.Trim() : string.Empty;
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId(); //request.UpdatedBy;
            row_entity.UpdatedDate = DateTime.Now;

            _unitOfWork.MSevenQualityRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();

        }

        public async Task DeleteMSevenQuality(int Id)
        {

            var entity_row = await _unitOfWork.MSevenQualityRepos.GetAsync(item => item.M7QualityId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.MSevenQualityRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();

            }

        }

        public async Task<IEnumerable<MasterMSevenQuality>> GetAllMSevenQuality()
        {
            return await _unitOfWork.MSevenQualityRepos.GetAllAsync();
        }

        public async Task<IEnumerable<MasterMSevenQuality>> GetMSevenQualityByUniqueOrKey(string m7QualityCode)
        {
            return await _unitOfWork.MSevenQualityRepos.GetAllAsync(item => item.M7QualityCode == m7QualityCode);
        }

        public async Task<MasterMSevenQuality> GetMSevenQualityById(int Id)
        {
            var result = new MasterMSevenQuality();

            var queryData = await _unitOfWork.MSevenQualityRepos.GetAsync(item => item.M7QualityId == Id);
            if (queryData != null)
            {
                result = new MasterMSevenQuality()
                {
                    M7QualityId = queryData.M7QualityId,
                    M7QualityCode = queryData.M7QualityCode,
                    M7QualityDescrpt = queryData.M7QualityDescrpt,
                    M7QualityCps = queryData.M7QualityCps,
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

        public async Task<PagedData<MasterMSevenQuality>> SearchMSevenQuality(PagedRequest<MasterMSevenQualityRequest> request)
        {
            var pageData = await _unitOfWork.MSevenQualityRepos.SearchMasterMSevenQuality(request);
            return pageData;
        }
    }
}
