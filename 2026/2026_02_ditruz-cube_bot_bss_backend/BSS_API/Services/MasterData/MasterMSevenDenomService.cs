using Azure.Core;
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
    public class MasterMSevenDenomService : IMasterMSevenDenomService
    {
        private readonly IUnitOfWork _unitOfWork;
        public MasterMSevenDenomService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }
        public async Task CreateMSevenDenom(CreateMSevenDenomRequest request)
        {

            var entity_row = await _unitOfWork.MSevenDenomRepos.GetAsync(item => item.DenoId == request.DenoId
                                                            && item.M7DenomCode == request.M7DenomCode.Trim()
                                                            && item.M7DenomName == request.M7DenomName.Trim());
            if (entity_row == null)
            {
                var new_entity = new MasterMSevenDenom
                {
                    DenoId = request.DenoId,
                    M7DenomCode = request.M7DenomCode != null ? request.M7DenomCode.Trim() : string.Empty,
                    M7DenomName = request.M7DenomName != null ? request.M7DenomName.Trim() : string.Empty,
                    M7DenomDescrpt = request.M7DenomDescrpt != null ? request.M7DenomDescrpt.Trim() : string.Empty,
                    M7DenomBms = request.M7DenomBms != null ? request.M7DenomBms.Trim() : string.Empty,
                    M7DnBms = request.M7DnBms != null ? request.M7DnBms.Trim() : string.Empty,
                    SeriesDenomId = request.SeriesDenomId,
                    CreatedBy = RequestContextHelper.GetUserId(),//request.CreatedBy,
                    IsActive = request.IsActive,
                    CreatedDate = DateTime.Now
                };
                await _unitOfWork.MSevenDenomRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.MSevenDenomRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();

        }

        public async Task<IEnumerable<MasterMSevenDenomViewData>> GetMSevenDenomByFilter(MSevenDenomFilterRequest request)
        {
            var m7DenomLists = (from msd in await _unitOfWork.MSevenDenomRepos.GetAllAsync()
                                join d in await _unitOfWork.DenominationRepos.GetAllAsync() on msd.DenoId equals d.DenominationId into DenominationJoin
                                from d in DenominationJoin.DefaultIfEmpty()
                                select new MasterMSevenDenomViewData
                                {
                                    DenoId = d.DenominationId,
                                    DenominationPrice = d.DenominationPrice,
                                    DenominationDesc = d.DenominationDesc,
                                    M7DenomCode = msd.M7DenomCode,
                                    M7DenomName = msd.M7DenomName,
                                    M7DenomDescrpt = msd.M7DenomDescrpt,
                                    M7DenomBms = msd.M7DenomBms,
                                    M7DnBms = msd.M7DnBms,
                                    IsActive = d.IsActive,
                                    CreatedBy = d.CreatedBy,
                                    CreatedDate = d.CreatedDate,
                                    UpdatedBy = d.UpdatedBy,
                                    UpdatedDate = d.UpdatedDate
                                }).ToList();


            if (!string.IsNullOrEmpty(request.M7DenomFilter) || !string.IsNullOrEmpty(request.StatusFilter))
            {
                if (!string.IsNullOrEmpty(request.M7DenomFilter))
                {
                    m7DenomLists = m7DenomLists.Where(x => x.DenoId == request.M7DenomFilter.AsInt()).ToList();
                }

                if (!string.IsNullOrEmpty(request.StatusFilter))
                {
                    m7DenomLists = m7DenomLists.Where(x => x.IsActive == (request.StatusFilter == "1" ? true : false)).ToList();
                }

            }
            return m7DenomLists;

        }

        public async Task UpdateMSevenDenom(UpdateMSevenDenomRequest request)
        {
            var row_entity = await _unitOfWork.MSevenDenomRepos.GetAsync(item => item.M7DenomId == request.M7DenomId);

            row_entity.DenoId = request.DenoId;
            row_entity.M7DenomCode = request.M7DenomCode != null ? request.M7DenomCode.Trim() : string.Empty;
            row_entity.M7DenomName = request.M7DenomName != null ? request.M7DenomName.Trim() : string.Empty;
            row_entity.M7DenomDescrpt = request.M7DenomDescrpt != null ? request.M7DenomDescrpt.Trim() : string.Empty;
            row_entity.M7DenomBms = request.M7DenomBms != null ? request.M7DenomBms.Trim() : string.Empty;
            row_entity.M7DnBms = request.M7DnBms != null ? request.M7DnBms.Trim() : string.Empty;
            row_entity.SeriesDenomId = request.SeriesDenomId;
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId();// request.UpdatedBy;

            _unitOfWork.MSevenDenomRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();

        }

        public async Task DeleteMSevenDenom(int Id)
        {

            var entity_row = await _unitOfWork.MSevenDenomRepos.GetAsync(item => item.M7DenomId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;
                _unitOfWork.MSevenDenomRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();

            }

        }
        public async Task<IEnumerable<MasterMSevenDenom>> GetAllMSevenDenom()
        {
            return await _unitOfWork.MSevenDenomRepos.GetAllAsync();
        }

        public async Task<IEnumerable<MasterMSevenDenom>> GetMSevenDenomByUniqueOrKey(string m7DenomCode, string m7DenomName, int denoId)
        {
            return await _unitOfWork.MSevenDenomRepos.GetAllAsync(item => item.M7DenomCode == m7DenomCode && item.M7DenomName == m7DenomName && item.DenoId == denoId);
        }

        public async Task<MasterMSevenDenomViewData> GetMSevenDenomById(int id)
        {

            var result = new MasterMSevenDenomViewData();

            //var M7denomData = _unitOfWork.MSevenDenomRepos.Get(item => item.M7DenomId == Id);
            var M7denomData = await _unitOfWork.MSevenDenomRepos
            .GetFirstOrDefaultAsNoTrackingAsync(
                x => x.M7DenomId == id,
                x => x.MasterDenomination,
                x => x.MasterSeriesDenom
            );
            if (M7denomData != null)
            {

                result.M7DenomId = M7denomData.M7DenomId;
                result.M7DenomCode = M7denomData.M7DenomCode;
                result.M7DenomName = M7denomData.M7DenomName;
                result.M7DenomDescrpt = M7denomData.M7DenomDescrpt;
                result.M7DenomBms = M7denomData.M7DenomBms;
                result.M7DnBms = M7denomData.M7DnBms;
                result.IsActive = M7denomData.IsActive;
                result.CreatedBy = M7denomData.CreatedBy;
                result.CreatedDate = M7denomData.CreatedDate;
                result.UpdatedBy = M7denomData.UpdatedBy;
                result.UpdatedDate = M7denomData.UpdatedDate;

                //var denomData = await _unitOfWork.DenominationRepos.GetAsync(d => d.DenominationId == M7denomData.DenoId);
               
                result.DenoId = M7denomData.DenoId;
                result.DenominationPrice = M7denomData.MasterDenomination.DenominationPrice;
                result.DenominationCode = M7denomData.MasterDenomination.DenominationCode;
                result.DenominationDesc = M7denomData.MasterDenomination.DenominationDesc;

                result.SeriesDenomId = M7denomData.SeriesDenomId;
                result.SeriesDenomCode = M7denomData.MasterSeriesDenom.SeriesCode;
                result.SeriesDenomDesc = M7denomData.MasterSeriesDenom.SerieDescrpt; 
                
            }
            else
            {
                result = null;
            }
            return result;

        }

        public async Task<PagedData<MasterMSevenDenomViewData>> SearchMSevenDenom(PagedRequest<MasterMSevenDenomRequest> request)
        {
            var pageData = await _unitOfWork.MSevenDenomRepos.SearchMasterMSevenDenom(request);
            return pageData.Map(x => new MasterMSevenDenomViewData
            {
                M7DenomId = x.M7DenomId,
                DenoId = x.DenoId,
                DenominationCode = x.MasterDenomination.DenominationCode,
                DenominationDesc = x.MasterDenomination.DenominationDesc,
                DenominationPrice = x.MasterDenomination.DenominationPrice,
                SeriesDenomId = x.SeriesDenomId,
                SeriesDenomCode = x.MasterSeriesDenom.SeriesCode,
                SeriesDenomDesc = x.MasterSeriesDenom.SerieDescrpt,
                M7DenomCode = x.M7DenomCode,
                M7DenomBms = x.M7DnBms,
                M7DenomName = x.M7DenomName,
                M7DenomDescrpt = x.M7DenomDescrpt,
                M7DnBms = x.M7DnBms,
                IsActive = x.IsActive,
                CreatedBy = x.CreatedBy,
                CreatedDate = x.CreatedDate,
                UpdatedBy = x.UpdatedBy,
                UpdatedDate = x.UpdatedDate
            });
        }


    }
}
