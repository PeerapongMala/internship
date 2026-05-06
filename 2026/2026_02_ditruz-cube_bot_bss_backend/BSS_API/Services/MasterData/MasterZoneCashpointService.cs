using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
namespace BSS_API.Services
{
    public class MasterZoneCashpointService : IMasterZoneCashpointService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MasterZoneCashpointService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<MasterZoneCashpoint>> GetAllZoneCashpoints()
        {
            return await _unitOfWork.ZoneCashpointRepos.GetAllAsync();
        }

        public async Task<MasterZoneCashpointViewData> GetZoneCashpoinById(int Id)
        {
            var result = new MasterZoneCashpointViewData();
            var entity_row = await _unitOfWork.ZoneCashpointRepos.GetAsync(item => item.ZoneCashpointId == Id);
            if (entity_row != null)
            {
                result = new MasterZoneCashpointViewData
                {
                    ZoneCashpointId = entity_row.ZoneCashpointId,
                    ZoneId = entity_row.ZoneId,
                    CashpointId = entity_row.CashpointId,
                    IsActive = entity_row.IsActive,
                    CreatedBy = entity_row.CreatedBy,
                    CreatedDate = entity_row.CreatedDate,
                    UpdatedBy = entity_row.UpdatedBy,
                    UpdatedDate = entity_row.UpdatedDate,
                };
            }
            else
            {
                result = null;
            }

            return result;
        }

        public async Task<IEnumerable<MasterZoneCashpointViewData>> GetZoneCashpointByFilter(ZoneCashpointFilterRequest filter)
        {
            var query = (await _unitOfWork.ZoneCashpointRepos.GetAllAsync()).AsQueryable();

            if (!string.IsNullOrEmpty(filter.ZoneFilter))
            {
                int zoneId = filter.ZoneFilter.AsInt();
                query = query.Where(x => x.ZoneId == zoneId);
            }

            if (!string.IsNullOrEmpty(filter.CashpointFilter))
            {
                int cashpointId = filter.CashpointFilter.AsInt();
                query = query.Where(x => x.CashpointId == cashpointId);
            }

            if (!string.IsNullOrEmpty(filter.StatusFilter))
            {
                bool isActive = filter.StatusFilter == "1";
                query = query.Where(x => x.IsActive == isActive);
            }

            var data = query.ToList();

            var result = data.Select(item => new MasterZoneCashpointViewData
            {
                ZoneCashpointId = item.ZoneCashpointId,
                ZoneId = item.ZoneId,
                CashpointId = item.CashpointId,
                IsActive = item.IsActive,
                CreatedBy = item.CreatedBy,
                CreatedDate = item.CreatedDate,
                UpdatedBy = item.UpdatedBy,
                UpdatedDate = item.UpdatedDate
            });

            return result;
        }


        public async Task<IEnumerable<MasterZoneCashpoint>> GetZoneCashpointByUniqueOrKey(int zoneId, int cashpointId)
        {
            return await _unitOfWork.ZoneCashpointRepos.GetAllAsync(item => item.ZoneId == zoneId &&
                                                                            item.CashpointId == cashpointId);
        }

        public async Task CreateZoneCashpoint(CreateZoneCashpoint request)
        {
            var entity_row = await _unitOfWork.ZoneCashpointRepos.GetAsync(item => item.ZoneId == request.ZoneId &&
                                                                                   item.CashpointId == request.CashpointId);
            if (entity_row == null)
            {
                var new_entity = new MasterZoneCashpoint
                {
                    ZoneId = request.ZoneId,
                    CashpointId = request.CashpointId,
                    IsActive = request.IsActive,
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.ZoneCashpointRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                _unitOfWork.ZoneCashpointRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task UpdateZoneCashpoint(UpdateZoneCashpoint request)
        {
            var entity_row = await _unitOfWork.ZoneCashpointRepos.GetAsync(item => item.ZoneCashpointId == request.ZoneCashpointId);

            entity_row.ZoneId = request.ZoneId;
            entity_row.CashpointId = request.CashpointId;
            entity_row.IsActive = request.IsActive;
            entity_row.UpdatedBy = RequestContextHelper.GetUserId();// request.UpdatedBy;
            entity_row.UpdatedDate = DateTime.Now;

            _unitOfWork.ZoneCashpointRepos.Update(entity_row);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteZoneCashpoint(int Id)
        {
            var entity_row = await _unitOfWork.ZoneCashpointRepos.GetAsync(item => item.ZoneCashpointId == Id);
            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.ZoneCashpointRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<PagedData<MasterZoneCashpointViewData>> SearchZoneCashpoint(PagedRequest<MasterZoneCashpointRequest> request)
        {
            var pageData = await _unitOfWork.ZoneCashpointRepos.SearchMasterZoneCashpoint(request);
            return pageData.Map(x => new MasterZoneCashpointViewData
            {
                ZoneCashpointId= x.ZoneCashpointId,
                ZoneId= x.ZoneId,
                ZoneName= x.MasterZone?.ZoneName,
                ZoneCode= x.MasterZone?.ZoneCode,
                CashpointId = x.CashpointId,
                CashPointName = x.MasterCashPoint?.CashpointName,
                IsActive = x.IsActive,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate
            });
        }
    }
}
