using Azure.Core;
using BSS_API.Helpers;
using BSS_API.Models.Common;
using BSS_API.Models.Entities;
using BSS_API.Models.ObjectModels;
using BSS_API.Models.RequestModels;
using BSS_API.Repositories.Interface;
using BSS_API.Services.Interface;
using DocumentFormat.OpenXml.Office2016.Excel;

namespace BSS_API.Services
{
    //Note: change pattern to async from now on, no need to try catch and throw for no reason
    public class MasterBanknoteTypeSendService : IMasterBanknoteTypeSendService
    {
        private readonly IUnitOfWork _unitOfWork;

        public MasterBanknoteTypeSendService(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public async Task CreateBanknoteTypeSend(CreateBanknoteTypeSendRequest request)
        {

            var entity_row = await _unitOfWork.BanknoteTypeSendRepos.GetAsync(item => item.BanknoteTypeSendCode == request.BanknoteTypeSendCode.Trim()
                                                                            && item.BssBntypeCode == request.BssBntypeCode.Trim());

            if (entity_row == null)
            {
                var new_entity = new MasterBanknoteTypeSend
                {
                    BanknoteTypeSendCode = request.BanknoteTypeSendCode.Trim(),
                    BssBntypeCode = request.BssBntypeCode.Trim(),
                    BanknoteTypeSendDesc = request.BanknoteTypeSendDesc != null ? request.BanknoteTypeSendDesc.Trim() : string.Empty,
                    IsActive = request.IsActive,
                    CreatedBy = request.CreatedBy,
                    CreatedDate = DateTime.Now
                };
                await _unitOfWork.BanknoteTypeSendRepos.AddAsync(new_entity);
            }
            else
            {
                entity_row.IsActive = true;
                entity_row.UpdatedBy = RequestContextHelper.GetUserId();
                entity_row.UpdatedDate = DateTime.Now;

                _unitOfWork.BanknoteTypeSendRepos.Update(entity_row);
            }

            await _unitOfWork.SaveChangeAsync();

        }

        public async Task DeleteBanknoteTypeSend(int Id)
        {
            var entity_row = await _unitOfWork.BanknoteTypeSendRepos.GetAsync(item => item.BanknoteTypeSendId == Id);

            if (entity_row != null)
            {
                entity_row.IsActive = false;
                _unitOfWork.BanknoteTypeSendRepos.Update(entity_row);
                await _unitOfWork.SaveChangeAsync();
            }

        }

        public async Task<IEnumerable<MasterBanknoteTypeSend>> GetAllBanknoteTypeSend()
        {

            return await _unitOfWork.BanknoteTypeSendRepos.GetAllAsync();

        }

        public async Task<IEnumerable<MasterBanknoteTypeSend>> GetBanknoteTypeByUniqueOrKey(string banknoteTypeSendCode , string bssBntypeCode )
        {
            return await _unitOfWork.BanknoteTypeSendRepos.GetAllAsync(item => item.BanknoteTypeSendCode == banknoteTypeSendCode && item.BssBntypeCode == bssBntypeCode);
        }

        public async Task<MasterBanknoteTypeSend?> GetBanknoteTypeSendById(int Id)
        {

            var result = new MasterBanknoteTypeSend();

            var queryData = await _unitOfWork.BanknoteTypeSendRepos.GetAsync(item => item.BanknoteTypeSendId == Id);
            if (queryData != null)
            {
                result = new MasterBanknoteTypeSend()
                {
                    BanknoteTypeSendId = queryData.BanknoteTypeSendId,
                    BanknoteTypeSendCode = queryData.BanknoteTypeSendCode,
                    BssBntypeCode = queryData.BssBntypeCode,
                    BanknoteTypeSendDesc = queryData.BanknoteTypeSendDesc,
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

        public async Task UpdateBanknoteTypeSend(UpdateBanknoteTypeSendRequest request)
        {
            var row_entity = await _unitOfWork.BanknoteTypeSendRepos.GetAsync(item => item.BanknoteTypeSendId == request.BanknoteTypeSendId);
            
            row_entity.BanknoteTypeSendCode = request.BanknoteTypeSendCode.Trim();
            row_entity.BssBntypeCode = request.BssBntypeCode.Trim();
            row_entity.BanknoteTypeSendDesc = request.BanknoteTypeSendDesc != null ? request.BanknoteTypeSendDesc.Trim() : string.Empty;
            row_entity.IsActive = request.IsActive;
            row_entity.UpdatedBy = RequestContextHelper.GetUserId(); //request.UpdatedBy;
            row_entity.UpdatedDate = DateTime.Now;

            _unitOfWork.BanknoteTypeSendRepos.Update(row_entity);
            await _unitOfWork.SaveChangeAsync();
            

        }

        public async Task<PagedData<MasterBanknoteTypeSend>> SearchBanknoteTypeSend(PagedRequest<MasterBanknoteTypeSendRequest> request)
        {
            var pageData = await _unitOfWork.BanknoteTypeSendRepos.SearchBanknoteTypeSend(request);
            return pageData ;
        }
    }
}
