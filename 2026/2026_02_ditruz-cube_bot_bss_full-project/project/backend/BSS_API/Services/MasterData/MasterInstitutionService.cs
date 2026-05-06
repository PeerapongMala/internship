using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;

namespace BSS_API.Services
{
    public class MasterInstitutionService : IMasterInstitutionService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MasterInstitutionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateInstitution(CreateInstitutionRequest request)
        {
            var entity_row = await _unitOfWork.InstitutionRepos.GetAsync(item =>
                                                              item.InstitutionCode == request.InstitutionCode.Trim() &&
                                                              item.BankCode == request.BankCode.Trim());
            if (entity_row == null)
            {
                var new_entity = new MasterInstitution
                {
                    InstitutionCode = request.InstitutionCode.Trim(),
                    BankCode = request.BankCode.Trim(),
                    InstitutionShortName = request.InstitutionShortName.Trim(),
                    InstitutionNameTh = request.InstitutionNameTh.Trim(),
                    InstitutionNameEn = request.InstitutionNameEn != null ? request.InstitutionNameEn.Trim() : string.Empty,
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    IsActive = request.IsActive,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.InstitutionRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.InstitutionRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<IEnumerable<MasterInstitution>> GetAllInstitution()
        {
            return await _unitOfWork.InstitutionRepos.GetAllAsync();
        }

        public async Task<MasterInstitutionViewData> GetInstitutionById(int Id)
        {
            var result = new MasterInstitutionViewData();
            var queryData = await _unitOfWork.InstitutionRepos.GetAsync(item => item.InstitutionId == Id);
            if (queryData != null)
            {
                result = new MasterInstitutionViewData()
                {
                    InstitutionId = queryData.InstitutionId,
                    InstitutionCode = queryData.InstitutionCode,
                    BankCode = queryData.BankCode,
                    InstitutionShortName = queryData.InstitutionShortName,
                    InstitutionNameTh = queryData.InstitutionNameTh,
                    InstitutionNameEn = queryData.InstitutionNameEn,
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

        public async Task<IEnumerable<MasterInstitution>> GetInstitutionByUniqueOrKey(string institutionCode)
        {
            return await _unitOfWork.InstitutionRepos.GetAllAsync(item => item.InstitutionCode == institutionCode);
        }

        public async Task UpdateInstitution(UpdateInstitutionRequest request)
        {
            var row_entity = await _unitOfWork.InstitutionRepos.GetAsync(item => item.InstitutionId == request.InstitutionId);

            row_entity.InstitutionShortName = request.InstitutionShortName.Trim();
            row_entity.InstitutionNameTh = request.InstitutionNameTh.Trim();
            row_entity.InstitutionNameEn = request.InstitutionNameEn != null ? request.InstitutionNameEn.Trim() : string.Empty;
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId();// request.UpdatedBy;
            row_entity.UpdatedDate = DateTime.Now;

            _unitOfWork.InstitutionRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteInstitution(int Id)
        {
            var entity_row = await _unitOfWork.InstitutionRepos.GetAsync(item => item.InstitutionId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.InstitutionRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<PagedData<MasterInstitution>> SearchInstitution(PagedRequest<MasterInstitutionRequest> request)
        {
            var pageData = await _unitOfWork.InstitutionRepos.SearchMasterInstitution(request);
            return pageData;
        }
    }
}
