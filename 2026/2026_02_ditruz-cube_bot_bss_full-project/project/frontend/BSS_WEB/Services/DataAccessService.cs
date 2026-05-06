using BSS_WEB.Helpers;
using BSS_WEB.Interfaces;
using BSS_WEB.Models;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.ServiceModel;
using Newtonsoft.Json;

namespace BSS_WEB.Services
{

    public class DataAccessService : IDataAccessService
    {
        private readonly IAppShare _share;
        private readonly IAppClient _appClient;
        private readonly ILogger<DataAccessService> _logger;

        public DataAccessService(IAppShare share, IAppClient appClient, ILogger<DataAccessService> logger)
        {
            _share = share;
            _appClient = appClient;
            _logger = logger;
        }

        public async Task<List<NavigationMenuViewModel>> GetMenuItemsAsync(int roleId)
        {
            var resultList = new List<NavigationMenuViewModel>();

            try
            {
                string url = $"{AppConfig.BssApiServiceBaseUrl}/api/NavigationMenu/GetMenuByRole?roleId={roleId}";
                _logger.LogInformation($"Call Service: {url}");

                var svRes = await _appClient.SendInternalAsync(HttpMethod.Get, url);
                var reponseCode = ((int)svRes.StatusCode).ToString();

                if (svRes.IsSuccessStatusCode)
                {
                    var content = await svRes.Content.ReadAsStringAsync();

                    var resultApi = JsonConvert.DeserializeObject<GetNavigationMenuByIdResult>(content);

                    if (resultApi != null && resultApi.is_success && resultApi.data != null)
                    {
                        resultList = resultApi.data.Select(display => new NavigationMenuViewModel
                        {
                            MenuId = display.menuId,
                            MenuName = display.menuName,
                            MenuPath = display.menuPath,
                            ControllerName = display.controllerName,
                            ActionName = display.actionName,
                            ParentMenuId = display.parentMenuId,
                            DisplayOrder = display.displayOrder,
                            IsActive = display.IsActive,
                            AssignedDate = display.assignedDate
                        }).ToList();
                        _logger.LogInformation($"GetMenuItemsAsync success. Count: {resultList.Count}");
                    }
                    else
                    {
                        _logger.LogWarning($"GetMenuItemsAsync returned no data or is_success=false, msg: {resultApi?.msg_desc}");
                    }
                }
                else
                {
                    var content = await svRes.Content.ReadAsStringAsync();
                    _logger.LogError($"GetMenuItemsAsync failed. StatusCode: {(int)svRes.StatusCode}, Content: {content}");
                }

                return resultList;
            }
            catch (Exception ex)
            {
                _logger.LogError(AppExtension.SetApiServiceLogErrorMessage(_share.SessionID, ex.GetErrorMessage()));
                return new List<NavigationMenuViewModel>();
            }
        }
    }
}
