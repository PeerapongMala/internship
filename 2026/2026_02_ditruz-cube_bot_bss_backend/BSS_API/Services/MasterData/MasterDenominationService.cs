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
    public class MasterDenominationService : IMasterDenominationService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterDenominationService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateDenomination(CreateDenominationRequest request)
        {
            var entity_row = await _unitOfWork.DenominationRepos.GetAsync(item => item.DenominationCode == request.DenominationCode);
            if (entity_row == null)
            {
                var new_entity = new MasterDenomination
                {
                    DenominationCode = request.DenominationCode,
                    DenominationPrice = request.DenominationPrice,
                    DenominationDesc = request.DenominationDesc != null ? request.DenominationDesc.Trim() : string.Empty,
                    DenominationCurrency = request.DenominationCurrency.Trim(),
                    IsActive = request.IsActive,
                    CreatedBy = RequestContextHelper.GetUserId(),// request.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.DenominationRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.DenominationRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<IEnumerable<MasterDenomination>> GetAllDenomination()
        {
            return await _unitOfWork.DenominationRepos.GetAllAsync();
        }

        public async Task<MasterDenominationViewData> GetDenominationById(int Id)
        {
            var result = new MasterDenominationViewData();
            var queryData = await _unitOfWork.DenominationRepos.GetAsync(item => item.DenominationId == Id);
            if (queryData != null)
            {
                result = new MasterDenominationViewData()
                {
                    DenominationId = queryData.DenominationId,
                    DenominationCode = queryData.DenominationCode,
                    DenominationPrice = queryData.DenominationPrice,
                    DenominationDesc = queryData.DenominationDesc,
                    DenominationCurrency = queryData.DenominationCurrency,
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

        public async Task<IEnumerable<MasterDenomination>> GetDenominationByUniqueOrKey(int denominationCode)
        {
            return await _unitOfWork.DenominationRepos.GetAllAsync(item => item.DenominationCode == denominationCode);
        }

        public async Task UpdateDenomination(UpdateDenominationRequest request)
        {
            var row_entity = await _unitOfWork.DenominationRepos.GetAsync(item => item.DenominationId == request.DenominationId);

            row_entity.DenominationPrice = request.DenominationPrice;
            row_entity.DenominationDesc = request.DenominationDesc != null ? request.DenominationDesc.Trim() : string.Empty;
            row_entity.DenominationCurrency = request.DenominationCurrency.Trim();
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId();// request.UpdatedBy;
            row_entity.UpdatedDate = DateTime.Now;
            _unitOfWork.DenominationRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteDenomination(int Id)
        {
            var entity_row = await _unitOfWork.DenominationRepos.GetAsync(item => item.DenominationId == Id);
            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.DenominationRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<PagedData<MasterDenomination>> SearchDenomination(PagedRequest<MasterDenominationRequest> request)
        {
            var pageData = await _unitOfWork.DenominationRepos.SearchMasterDenomination(request);
            return pageData;
        }
    }
}
