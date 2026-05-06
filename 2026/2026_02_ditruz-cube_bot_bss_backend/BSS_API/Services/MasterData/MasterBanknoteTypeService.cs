using Azure.Core;
using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Models.RequestModels.MasterData;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office.CustomUI;
using DocumentFormat.OpenXml.Office2010.Excel;

namespace BSS_API.Services
{
    public class MasterBanknoteTypeService : IMasterBanknoteTypeService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterBanknoteTypeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateBanknoteType(CreateBanknoteTypeRequest request)
        {
            var entity_row = await _unitOfWork.BanknoteTypeRepos.GetAsync(item => item.BssBanknoteTypeCode == request.BssBanknoteTypeCode.Trim());
            if (entity_row == null)
            {
                var new_entity = new MasterBanknoteType
                {
                    BssBanknoteTypeCode = request.BssBanknoteTypeCode.Trim(),
                    BanknoteTypeCode = request.BanknoteTypeCode.Trim(),
                    BanknoteTypeName = request.BanknoteTypeName != null ? request.BanknoteTypeName.Trim() : string.Empty,
                    BanknoteTypeDesc = request.BanknoteTypeDesc != null ? request.BanknoteTypeDesc.Trim() : string.Empty,
                    CreatedBy = RequestContextHelper.GetUserId(), //request.CreatedBy,
                    IsDisplay = request.IsDisplay,
                    IsActive = request.IsActive,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.BanknoteTypeRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.BanknoteTypeRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteBanknoteType(int Id)
        {
            var entity_row = await _unitOfWork.BanknoteTypeRepos.GetAsync(item => item.BanknoteTypeId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.BanknoteTypeRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<IEnumerable<MasterBanknoteType>> GetAllBanknoteType()
        {
            return await _unitOfWork.BanknoteTypeRepos.GetAllAsync();
        }

        public async Task<IEnumerable<MasterBanknoteType>> GetBanknoteTypeByUniqueOrKey(string bssBanknoteTypeCode)
        {
            return await _unitOfWork.BanknoteTypeRepos.GetAllAsync(item => item.BssBanknoteTypeCode == bssBanknoteTypeCode.Trim());
        }

        public async Task<MasterBanknoteType> GetBanknoteTypeById(int Id)
        {
            var result = new MasterBanknoteType();

            var queryData = await _unitOfWork.BanknoteTypeRepos.GetAsync(item => item.BanknoteTypeId == Id);
            if (queryData != null)
            {
                result = new MasterBanknoteType()
                {
                    BanknoteTypeId = queryData.BanknoteTypeId,
                    BssBanknoteTypeCode = queryData.BssBanknoteTypeCode,
                    BanknoteTypeCode = queryData.BanknoteTypeCode,
                    BanknoteTypeName = queryData.BanknoteTypeName,
                    BanknoteTypeDesc = queryData.BanknoteTypeDesc,
                    IsDisplay = queryData.IsDisplay,
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

        public async Task UpdateBanknoteType(UpdateBanknoteTypeRequest request)
        {
            var entity_row = await _unitOfWork.BanknoteTypeRepos.GetAsync(item => item.BanknoteTypeId == request.BanknoteTypeId);

            entity_row.BanknoteTypeName = request.BanknoteTypeName != null ? request.BanknoteTypeName.Trim() : string.Empty;
            entity_row.BanknoteTypeDesc = request.BanknoteTypeDesc != null ? request.BanknoteTypeDesc.Trim() : string.Empty;
            entity_row.IsDisplay = request.IsDisplay;
            entity_row.IsActive = request.IsActive;
            entity_row.UpdatedBy = RequestContextHelper.GetUserId();//request.UpdatedBy;
            entity_row.UpdatedDate = DateTime.Now;

            _unitOfWork.BanknoteTypeRepos.Update(entity_row);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task<PagedData<MasterBankNoteTypeViewData>> SearchBankNoteType(PagedRequest<MasterBankNoteTypeRequest> request)
        {
            var pageData = await _unitOfWork.BanknoteTypeRepos.SearchBanknoteType(request);
            return pageData.Map(x => new MasterBankNoteTypeViewData
            {
                BanknoteTypeId= x.BanknoteTypeId,
                BanknoteTypeCode= x.BanknoteTypeCode,
                BanknoteTypeDesc=x.BanknoteTypeDesc,
                BssBanknoteTypeCode=x.BssBanknoteTypeCode,
                IsDisplay=x.IsDisplay,
                IsActive = x.IsActive, 
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate
            });
        }
    }
}
