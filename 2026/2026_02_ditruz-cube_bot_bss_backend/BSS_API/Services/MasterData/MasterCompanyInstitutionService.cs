using BSS_API.Core.CustomException;
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
    public class MasterCompanyInstitutionService : IMasterCompanyInstitutionService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MasterCompanyInstitutionService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<MasterCompanyInstitution>> GetAllCompanyInstitution()
        {
            return await _unitOfWork.CompanyInstitutionRepos.GetAllAsync();
        }

        public async Task<MasterCompanyInstitutionViewData> GetCompanyInstitutionById(int Id)
        {
            var result = new MasterCompanyInstitutionViewData();
            var entity = await _unitOfWork.CompanyInstitutionRepos.GetAsync(c => c.CompanyInstId == Id);
            if (entity != null)
            {
                result = new MasterCompanyInstitutionViewData
                {
                    CompanyInstId = entity.CompanyInstId,
                    CbBcdCode=entity.CbBcdCode,
                    CompanyId = entity.CompanyId,
                    InstId = entity.InstId,
                    IsActive = entity.IsActive,
                    CreatedBy = entity.CreatedBy,
                    CreatedDate = entity.CreatedDate,
                    UpdatedBy = entity.UpdatedBy,
                    UpdatedDate = entity.UpdatedDate
                };
            }
            else
            {
                result = null;
            }

            return result;
        }

        public async Task<IEnumerable<MasterCompanyInstitution>> GetCompanyInstitutionByUniqueOrKey(int companyId, int instId)
        {
            return await _unitOfWork.CompanyInstitutionRepos.GetAllAsync(item => item.CompanyId == companyId && item.InstId == instId);
        }

        public async Task CreateCompanyInstitution(CreateMasterCompanyInstitution request)
        {
            string cbBcdCode = await _unitOfWork.CompanyDepartmentRepos.GetCbBcdCode(request.CompanyId);
            if (string.IsNullOrEmpty(request.CbBcdCode) || request.CbBcdCode != cbBcdCode)
            {
                throw new BusinessException($"รหัสสัญญา:{request.CbBcdCode} ไม่ถูกต้อง");
            }
            var entity_row = await _unitOfWork.CompanyInstitutionRepos.GetAsync(item => item.CompanyId == request.CompanyId
                                                                           && item.InstId == request.InstId);
            if (entity_row == null)
            {
                var new_entity = new MasterCompanyInstitution
                {
                    CompanyId = request.CompanyId,
                    InstId = request.InstId,
                    CbBcdCode= request.CbBcdCode,
                    IsActive = request.IsActive,
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.CompanyInstitutionRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.CompanyInstitutionRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task UpdateCompanyInstitution(UpdateCompanyInstitution request)
        {
            string cbBcdCode = await _unitOfWork.CompanyDepartmentRepos.GetCbBcdCode(request.CompanyId);
            if (string.IsNullOrEmpty(request.CbBcdCode) || request.CbBcdCode != cbBcdCode)
            {
                throw new BusinessException($"รหัสสัญญา:{request.CbBcdCode} ไม่ถูกต้อง");
            }

            var entity_row = await _unitOfWork.CompanyInstitutionRepos.GetAsync(item => item.CompanyInstId == request.CompanyInstId);

            entity_row.CompanyId = request.CompanyId;
            entity_row.InstId = request.InstId;
            entity_row.CbBcdCode = request.CbBcdCode;
            entity_row.IsActive = request.IsActive;
            entity_row.UpdatedBy = RequestContextHelper.GetUserId(); //request.UpdatedBy;
            entity_row.UpdatedDate = DateTime.Now;

            _unitOfWork.CompanyInstitutionRepos.Update(entity_row);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteCompanyInstitution(int Id)
        {
            var entity_row = await _unitOfWork.CompanyInstitutionRepos.GetAsync(item => item.CompanyInstId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.CompanyInstitutionRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<PagedData<MasterCompanyInstitutionViewData>> SearchCompanyInstitution(PagedRequest<MasterCompanyInstitutionRequest> request)
        {
            var pageData = await _unitOfWork.CompanyInstitutionRepos.SearchMasterCompanyInstitution(request);
            return pageData.Map(x => new MasterCompanyInstitutionViewData
            {
                CompanyInstId = x.CompanyInstId,
                CompanyId = x.CompanyId,
                CompanyCode=x.MasterCompany.CompanyCode,
                CompanyName = x.MasterCompany?.CompanyName,
                InstId = x.InstId,
                InstitutionCode = x.MasterInstitution?.InstitutionCode,
                InstitutionNameEn = x.MasterInstitution?.InstitutionNameEn,
                InstitutionNameTh = x.MasterInstitution?.InstitutionNameTh,
                CbBcdCode = x.CbBcdCode,
                IsActive = x.IsActive,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate
            });
        }
    }
}
