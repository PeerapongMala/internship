using Azure.Core;
using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office2016.Excel;
using DocumentFormat.OpenXml.Wordprocessing;
using System.Threading.Tasks.Dataflow;

namespace BSS_API.Services
{
    public class MasterConfigService : IMasterConfigService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterConfigService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateConfig(CreateConfigRequest request)
        {
           
                var entity_row = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == request.ConfigCode.Trim()
                                                          && item.ConfigTypeId == request.ConfigTypeId);
                if (entity_row == null)
                {
                    var new_entity = new MasterConfig
                    {
                        ConfigTypeId = request.ConfigTypeId,
                        ConfigCode = request.ConfigCode.Trim(),
                        ConfigValue = request.ConfigValue != null ? request.ConfigValue.Trim() : string.Empty,
                        ConfigDesc = request.ConfigDesc != null ? request.ConfigDesc.Trim() : string.Empty,
                        CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                        IsActive = request.IsActive,
                        CreatedDate = DateTime.Now
                    };
                    await _unitOfWork.ConfigRepos.AddAsync(new_entity);
                }
                else
                {
                    entity_row.IsActive = true;
                    entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                    entity_row.UpdatedDate = DateTime.Now;
                    _unitOfWork.ConfigRepos.Update(entity_row);
                }

            await _unitOfWork.SaveChangeAsync();
          
        }

        public async Task DeleteConfig(int Id)
        {

            var entity_row = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.ConfigRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }

        }

        public async Task<IEnumerable<MasterConfig>>  GetAllConfig()
        {
            return await _unitOfWork.ConfigRepos.GetAllAsync();
        }

        public async Task<IEnumerable<MasterConfig>> GetConfigByUniqueOrKey(string configCode, int configTypeId)
        {
            return await _unitOfWork.ConfigRepos.GetAllAsync(item => item.ConfigCode == configCode && item.ConfigTypeId == configTypeId);
        }

        public async Task<MasterConfig> GetConfigByCode(string configCode)
        {
            return await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == configCode.Trim() && item.IsActive == true);
        }

        public async Task<IEnumerable<MasterConfig>> GetByConfigTypeId(int configTypeId)
        {
            return await _unitOfWork.ConfigRepos.GetAllAsync(item => item.ConfigTypeId == configTypeId && item.IsActive == true);
        }

        public async Task<MasterConfigViewData> GetConfigById(int Id)
        {

            var result = new MasterConfigViewData();

            var configData = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigId == Id);
            if (configData != null)
            {

                result.ConfigId = configData.ConfigId;
                result.ConfigCode = configData.ConfigCode;
                result.ConfigValue = configData.ConfigValue;
                result.ConfigDesc = configData.ConfigDesc;
                result.IsActive = configData.IsActive;
                result.CreatedBy = configData.CreatedBy;
                result.CreatedDate = configData.CreatedDate;
                result.UpdatedBy = configData.UpdatedBy;
                result.UpdatedDate = configData.UpdatedDate;
                
                var configTypeData = await _unitOfWork.ConfigTypeRepos.GetAsync(rg => rg.ConfigTypeId == configData.ConfigTypeId);
                result.ConfigTypeId = configTypeData.ConfigTypeId;
                result.ConfigTypeDesc = configTypeData.ConfigTypeDesc;

            }
            else
            {
                result = null;
            }

            return result;

        }

        public async Task<IEnumerable<MasterConfigViewData>> GetConfigByFilter(ConfigFilterRequest filter)
        {

            var queryDataLists = (from cf in await _unitOfWork.ConfigRepos.GetAllAsync( )

                                   join cft in await _unitOfWork.ConfigTypeRepos.GetAllAsync() on cf.ConfigTypeId equals cft.ConfigTypeId into configTypeJoin
                                   from cft in configTypeJoin.DefaultIfEmpty()
                                   select new MasterConfigViewData
                                   {
                                       ConfigTypeId = cft.ConfigTypeId,
                                       ConfigTypeDesc = cft.ConfigTypeDesc,
                                       ConfigId = cf.ConfigId,
                                       ConfigCode = cf.ConfigCode,
                                       ConfigValue = cf.ConfigValue,
                                       ConfigDesc = cf.ConfigDesc,
                                       IsActive = cf.IsActive,
                                       CreatedBy = cf.CreatedBy,
                                       CreatedDate = cf.CreatedDate,
                                       UpdatedBy = cf.UpdatedBy,
                                       UpdatedDate = cf.UpdatedDate

                                   }).ToList();

            if (!string.IsNullOrEmpty(filter.ConfigTypeFilter) || !string.IsNullOrEmpty(filter.StatusFilter))
            {
                if (!string.IsNullOrEmpty(filter.ConfigTypeFilter))
                {
                    queryDataLists = queryDataLists.Where(x => x.ConfigTypeId == filter.ConfigTypeFilter.AsInt()).ToList();
                }

                if (!string.IsNullOrEmpty(filter.StatusFilter))
                {
                    queryDataLists = queryDataLists.Where(x => x.IsActive == (filter.StatusFilter == "1" ? true : false)).ToList();
                }

            }
            return queryDataLists;

        }

        public async Task UpdateConfig(UpdateConfigRequest request)
        {
            var row_entity = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigId == request.ConfigId
                                                         && item.ConfigTypeId == request.ConfigTypeId);

            row_entity.ConfigTypeId = request.ConfigTypeId;
            row_entity.ConfigCode = request.ConfigCode.Trim();
            row_entity.ConfigValue = request.ConfigValue != null ? request.ConfigValue.Trim() : string.Empty;
            row_entity.ConfigDesc = request.ConfigDesc != null ? request.ConfigDesc.Trim() : string.Empty;
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId(); //request.UpdatedBy;
            row_entity.UpdatedDate = DateTime.Now;

            _unitOfWork.ConfigRepos.Update(row_entity);

            await _unitOfWork.SaveChangeAsync();

        }

        public async Task<DefaultConfigInfoData> GetDefaultConfigDataAsync()
        {
            var result = new DefaultConfigInfoData();
            var configUnfitQty = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == "UNFIT_QTY");
            var configStartTime = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == "BSS_START_TIME");
            var configEndTime = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == "BSS_END_TIME");
            var configWorkDay = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == "BSS_DAY");
            var configAlertShift = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == "ALERT_SHIFT");
            var configBundle = await _unitOfWork.ConfigRepos.GetAsync(item => item.ConfigCode == "BUNDLE");
            result.BssUnfitQty = configUnfitQty.ConfigValue ?? string.Empty;
            result.BssStartTime = configStartTime.ConfigValue ?? string.Empty;
            result.BssEndTime = configEndTime.ConfigValue ?? string.Empty;
            result.BssWorkDay = configWorkDay.ConfigValue ?? string.Empty;
            result.BssAlertShift = configAlertShift.ConfigValue ?? string.Empty;
            result.BssBundle = configBundle.ConfigValue ?? string.Empty;
            return result;
        }

        public async Task<IEnumerable<MasterConfigViewData>> GetByConfigTypeCodeAsync(string typeCode)
        {
            var queryDataLists = (from cf in await _unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync(typeCode)
                                  select new MasterConfigViewData
                                  {
                                      ConfigTypeId = cf.ConfigType.ConfigTypeId,
                                      ConfigTypeDesc = cf.ConfigType.ConfigTypeDesc,
                                      ConfigId = cf.ConfigId,
                                      ConfigCode = cf.ConfigCode,
                                      ConfigValue = cf.ConfigValue,
                                      ConfigDesc = cf.ConfigDesc,
                                      IsActive = cf.IsActive,
                                      CreatedBy = cf.CreatedBy,
                                      CreatedDate = cf.CreatedDate,
                                      UpdatedBy = cf.UpdatedBy,
                                      UpdatedDate = cf.UpdatedDate

                                  }).ToList();
            return queryDataLists;

        }

        public async Task<PagedData<MasterConfigViewData>> SearchConfig(PagedRequest<MasterConfigRequest> request)
        {
            var pageData = await _unitOfWork.ConfigRepos.SearchMasterConfig(request);
            return pageData.Map(x => new MasterConfigViewData
            { 
                ConfigId = x.ConfigId,
                ConfigCode= x.ConfigCode,
                ConfigValue= x.ConfigValue,
                ConfigTypeId= x.ConfigTypeId,
                ConfigTypeDesc= x.ConfigType?.ConfigTypeDesc,
                IsActive=x.IsActive,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate
            });
        }
    }
}
