using Azure.Core;
using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;


namespace BSS_API.Services
{
    public class MasterConfigTypeService : IMasterConfigTypeService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterConfigTypeService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;

        }

        public async Task CreateConfigType(CreateConfigTypeRequest request)
        {
            
                var entity_row = await _unitOfWork.ConfigTypeRepos.GetAsync(item => item.ConfigTypeCode == request.ConfigTypeCode.Trim());
                if (entity_row == null)
                {
                    var new_entity = new MasterConfigType
                    {
                        ConfigTypeCode = request.ConfigTypeCode != null ? request.ConfigTypeCode.Trim() : string.Empty,
                        ConfigTypeDesc = request.ConfigTypeDesc != null ? request.ConfigTypeDesc.Trim() : string.Empty,
                        IsActive = request.IsActive,
                        CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                        CreatedDate = DateTime.Now
                    };

                    await _unitOfWork.ConfigTypeRepos.AddAsync(new_entity);
                }
                else
                {
                    entity_row.IsActive = true;
                    entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                    entity_row.UpdatedDate = DateTime.Now;
                    _unitOfWork.ConfigTypeRepos.Update(entity_row);
                }

                await _unitOfWork.SaveChangeAsync();
           
        }
        public async Task DeleteConfigType(int Id)
        {
            var entity_row = await _unitOfWork.ConfigTypeRepos.GetAsync(item => item.ConfigTypeId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.ConfigTypeRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<IEnumerable<MasterConfigType>> GetAllConfigType()
        {
            return await _unitOfWork.ConfigTypeRepos.GetAllAsync();
        }

        public async Task<IEnumerable<MasterConfigType>> GetConfigTypeByUniqueOrKey(string configTypeCode)
        {
            return await _unitOfWork.ConfigTypeRepos.GetAllAsync(item => item.ConfigTypeCode == configTypeCode);
        }

        public async Task<MasterConfigType?> GetConfigTypeById(int Id)
        {

            var queryData = await _unitOfWork.ConfigTypeRepos.GetAsync(item => item.ConfigTypeId == Id);
            if (queryData != null)
            {
                var result = new MasterConfigType()
                {
                    ConfigTypeId = queryData.ConfigTypeId,
                    ConfigTypeCode = queryData.ConfigTypeCode,
                    ConfigTypeDesc = queryData.ConfigTypeDesc,
                    IsActive = queryData.IsActive,
                    CreatedBy = queryData.CreatedBy,
                    CreatedDate = queryData.CreatedDate,
                    UpdatedBy = queryData.UpdatedBy,
                    UpdatedDate = queryData.UpdatedDate
                };
                return result;
            }
            else
            {
                return null;
            }

        }

        public async Task UpdateConfigType(UpdateConfigTypeRequest request)
        {
            var row_entity = await _unitOfWork.ConfigTypeRepos.GetAsync(item => item.ConfigTypeId == request.ConfigTypeId);

            row_entity.ConfigTypeCode = request.ConfigTypeCode.Trim();
            row_entity.ConfigTypeDesc = request.ConfigTypeDesc != null ? request.ConfigTypeDesc.Trim() : string.Empty;
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId(); //request.UpdatedBy;
            row_entity.UpdatedDate = DateTime.Now;
            
            _unitOfWork.ConfigTypeRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();
            
        }
        public async Task<PagedData<MasterConfigType>> SearchConfigType(PagedRequest<MasterConfigTypeRequest> request)
        {
            var pageData = await _unitOfWork.ConfigTypeRepos.SearchMasterConfigType(request);
            return pageData;
        }

    }
}
