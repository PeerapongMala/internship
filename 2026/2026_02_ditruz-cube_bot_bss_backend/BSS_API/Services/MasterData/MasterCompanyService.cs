using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_API.Repositories;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office2010.Excel;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Linq.Expressions;

namespace BSS_API.Services
{
    public class MasterCompanyService : IMasterCompanyService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterCompanyService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateCompany(CreateCompanyRequest request)
        {
            var entity_row = await _unitOfWork.CompanyRepos.GetAsync(item => item.CompanyCode == request.CompanyCode.Trim());
            if (entity_row == null)
            {
                var new_entity = new MasterCompany
                {
                    CompanyCode = request.CompanyCode.Trim(),
                    CompanyName = request.CompanyName.Trim(),
                    CreatedBy = RequestContextHelper.GetUserId(),// request.CreatedBy,
                    IsActive = request.IsActive,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.CompanyRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.CompanyRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<IEnumerable<MasterCompany>> GetAllCompany()
        {
            return await _unitOfWork.CompanyRepos.GetAllAsync();
        }
        public async Task<IEnumerable<MasterCompany>> GetCompanyByUniqueOrKey(string companyCode)
        {
            return await _unitOfWork.CompanyRepos.GetAllAsync(item => item.CompanyCode == companyCode);
        }

        public async Task<MasterCompanyViewData> GetCompanyById(int Id)
        {
            var result = new MasterCompanyViewData();

            var queryData = await _unitOfWork.CompanyRepos.GetAsync(item => item.CompanyId == Id);
            if (queryData != null)
            {
                result = new MasterCompanyViewData()
                {
                    CompanyId = queryData.CompanyId,
                    CompanyCode = queryData.CompanyCode,
                    CompanyName = queryData.CompanyName,
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
        public async Task UpdateCompany(UpdateCompanyRequest request)
        {

            var entity_row = await _unitOfWork.CompanyRepos.GetAsync(item => item.CompanyId == request.CompanyId);
            entity_row.CompanyName = request.CompanyName.Trim();
            entity_row.CompanyCode = request.CompanyCode.Trim();
            entity_row.IsActive = request.IsActive;
            entity_row.UpdatedBy = RequestContextHelper.GetUserId();// request.UpdatedBy;
            entity_row.UpdatedDate = DateTime.Now;

            _unitOfWork.CompanyRepos.Update(entity_row);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteCompany(int Id)
        {
            var entity_row = await _unitOfWork.CompanyRepos.GetAsync(item => item.CompanyId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.CompanyRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<PagedData<MasterCompany>> SearchCompany(PagedRequest<MasterCompanyRequest> request)
        {
            return await _unitOfWork.CompanyRepos.SearchCompany(request);
             
        }

        
    }

}
