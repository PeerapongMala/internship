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
    public class MasterMSevendenomSeriesService : IMasterMSevendenomSeriesService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MasterMSevendenomSeriesService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task<IEnumerable<MasterMSevendenomSeries>> GetAllMSevendenomSeries()
        {
            return await _unitOfWork.MSevendenomSeriesRepos.GetAllAsync();
        }

        public async Task<MasterMSevendenomSeriesViewData> GetMSevendenomSeriesById(int Id)
        {
            var result = new MasterMSevendenomSeriesViewData();
            var entity = await _unitOfWork.MSevendenomSeriesRepos.GetAsync(n => n.MSevendenomSeriesId == Id);
            if (entity != null)
            {
                result = new MasterMSevendenomSeriesViewData
                {
                    MSevendenomSeriesId = entity.MSevendenomSeriesId,
                    MSevenDenomId = entity.MSevenDenomId,
                    SeriesDenomId = entity.SeriesDenomId,
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

        public async Task<IEnumerable<MasterMSevendenomSeries>> GetMSevendenomSeriesByUniqueOrKey(int mSevenDenomId, int seriesDenomId)
        {
            return await _unitOfWork.MSevendenomSeriesRepos.GetAllAsync(item => item.MSevenDenomId == mSevenDenomId && item.SeriesDenomId == seriesDenomId);
        }


        public async Task CreateMSevendenomSeries(CreateMSevendenomSeries request)
        {
            var entity_row = await _unitOfWork.MSevendenomSeriesRepos.GetAsync(item => item.MSevenDenomId == request.MSevenDenomId &&
                                                                                item.SeriesDenomId == request.SeriesDenomId);
            if (entity_row == null)
            {
                var new_entity = new MasterMSevendenomSeries
                {
                    MSevenDenomId = request.MSevenDenomId,
                    SeriesDenomId = request.SeriesDenomId,
                    IsActive = request.IsActive,
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    CreatedDate = DateTime.Now
                };

                await _unitOfWork.MSevendenomSeriesRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.MSevendenomSeriesRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();
        }

        public async Task UpdateMSevendenomSeries(UpdateMSevendenomSeries request)
        {
            var row_entity = await _unitOfWork.MSevendenomSeriesRepos.GetAsync(item => item.MSevendenomSeriesId == request.MSevendenomSeriesId);

            row_entity.MSevenDenomId = request.MSevenDenomId;
            row_entity.SeriesDenomId = request.SeriesDenomId;
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId(); //request.UpdatedBy;
            row_entity.UpdatedDate = DateTime.Now;

            _unitOfWork.MSevendenomSeriesRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();
        }

        public async Task DeleteMSevendenomSeries(int Id)
        {
            var entity_row = await _unitOfWork.MSevendenomSeriesRepos.GetAsync(item => item.MSevendenomSeriesId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.MSevendenomSeriesRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }
        }

        public async Task<PagedData<MasterMSevendenomSeriesViewData>> SearchMSevendenomSeries(PagedRequest<MasterMSevendenomSeriesRequest> request)
        {
            var pageData = await _unitOfWork.MSevendenomSeriesRepos.SearchMasterMSevendenomSeries(request);
            return pageData.Map(x => new MasterMSevendenomSeriesViewData
            {
                MSevendenomSeriesId= x.MSevendenomSeriesId,
                SeriesDenomId=x.SeriesDenomId,
                SeriesCode= x.MasterSeriesDenom.SeriesCode,
                SerieDescrpt=x.MasterSeriesDenom.SerieDescrpt,
                MSevenDenomId =x.MSevenDenomId ,
                M7DenomCode=x.MasterMSevenDenom.M7DenomCode,
                M7DenomName=x.MasterMSevenDenom.M7DenomName,
                M7DenomDescrpt=x.MasterMSevenDenom.M7DenomDescrpt,
                IsActive = x.IsActive,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate
            });
        }
    }
}
