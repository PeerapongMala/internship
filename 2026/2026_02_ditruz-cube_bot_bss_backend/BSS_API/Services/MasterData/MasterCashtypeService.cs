using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Vml.Office;

namespace BSS_API.Services
{
    public class MasterCashtypeService : IMasterCashtypeService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterCashtypeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateCashType(CreateCashTypeRequest request)
        {
            var entity_row = await _unitOfWork.CashtypeRepos.GetAsync(item => item.CashTypeCode == request.CashTypeCode.Trim());
            if (entity_row == null)
            {
                var new_entity = new MasterCashType
                {
                    CashTypeCode = request.CashTypeCode.Trim(),
                    CashTypeName = request.CashTypeName.Trim(),
                    CashTypeDesc = request.CashTypeDesc.Trim(),
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    IsActive = request.IsActive,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.CashtypeRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.CashtypeRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<IEnumerable<MasterCashType>> GetAllCashType()
        {
            return await _unitOfWork.CashtypeRepos.GetAllAsync();
        }

        public async Task<MasterCashTypeViewData> GetCashTypeById(int Id)
        {
            var result = new MasterCashTypeViewData();
            var queryData = await _unitOfWork.CashtypeRepos.GetAsync(item => item.CashTypeId == Id);
            if (queryData != null)
            {
                result = new MasterCashTypeViewData()
                {
                    CashTypeId = queryData.CashTypeId,
                    CashTypeCode = queryData.CashTypeCode,
                    CashTypeName = queryData.CashTypeName,
                    CashTypeDesc = queryData.CashTypeDesc,
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

        public async Task<IEnumerable<MasterCashType>> GetCashTypeByUniqueOrKey(string cashTypeCode)
        {
            return await _unitOfWork.CashtypeRepos.GetAllAsync(item => item.CashTypeCode == cashTypeCode);
        }

        public async Task UpdateCashType(UpdateCashTypeRequest request)
        {
            var row_entity = await _unitOfWork.CashtypeRepos.GetAsync(item => item.CashTypeId == request.CashTypeId);

            row_entity.CashTypeName = request.CashTypeName.Trim();
            row_entity.CashTypeDesc = request.CashTypeDesc.Trim();
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId();// request.UpdatedBy;
            row_entity.UpdatedDate = DateTime.Now;
            _unitOfWork.CashtypeRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteCashType(int Id)
        {
            var entity_row = await _unitOfWork.CashtypeRepos.GetAsync(item => item.CashTypeId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.CashtypeRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<PagedData<MasterCashType>> SearchCashType(PagedRequest<MasterCashTypeRequest> request)
        {
            var pageData = await _unitOfWork.CashtypeRepos.SearchMasterCashType(request);
            return pageData;
        }
    }
}
