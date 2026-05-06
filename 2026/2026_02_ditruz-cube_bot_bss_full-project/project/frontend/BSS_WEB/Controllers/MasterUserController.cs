using BSS_API.Models.RequestModels;
using BSS_API.Models.SearchParameter;
using BSS_WEB.Helpers;
using BSS_WEB.Infrastructure;
using BSS_WEB.Interfaces;
using BSS_WEB.Models.DisplayModel;
using BSS_WEB.Models.ObjectModel;
using BSS_WEB.Models.SearchModel;
using Microsoft.AspNetCore.Mvc;

namespace BSS_WEB.Controllers
{
    [ServiceFilter(typeof(RefreshTokenFilter))]
    [AuthenticationActionFilter]
    public class MasterUserController : Controller
    {
        private readonly ILogger<MasterUserController> _logger;
        private readonly IMasterUserService _userService;
        private readonly IMasterDepartmentService _departmentService;
        private readonly IMasterRoleService _roleService;
        private readonly IMasterUserRoleService _userRoleService;
        private readonly IMasterRoleGroupService _roleGroupService;
        private readonly IBssAuthenticationService _bssAuthenService;

        public MasterUserController(ILogger<MasterUserController> logger,
            IMasterUserService userService,
            IMasterDepartmentService departmentService,
            IMasterRoleService roleService,
            IMasterUserRoleService userRoleService,
            IMasterRoleGroupService roleGroupService,
            IBssAuthenticationService bssAuthenService)
        {
            _logger = logger;
            _userService = userService;
            _departmentService = departmentService;
            _roleService = roleService;
            _userRoleService = userRoleService;
            _roleGroupService = roleGroupService;
            _bssAuthenService = bssAuthenService;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Index2()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> GetUserList([FromBody] UseFilterSearch requestData)
        {
            var roleGroupResult = await _roleGroupService.GetAllMasterRoleGroupAsyn();
            var userResult = await _userService.GetUserByFilterAsync(requestData);
            if (userResult.data != null && userResult.data.Count > 0)
            {
                foreach (var item in userResult.data)
                {
                    item.roleGroupName = roleGroupResult.data.Where(r => r.roleGroupId == item.roleGroupId).FirstOrDefault()?.roleGroupName.ToString();
                }

                if (!string.IsNullOrEmpty(requestData.roleFilter))
                {
                    var tempLists = userResult.data.Where(x => x.roleGroupId == requestData.roleFilter.AsInt()).ToList();
                    userResult.data = tempLists;
                }

            }

            return Json(userResult);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequest requestData)
        {
            //var createData = new CreateUserRequest
            //{
            //    userName = requestData.userName.Trim(),
            //    usernameDisplay = requestData.usernameDisplay.Trim(),
            //    userEmail = requestData.userEmail.Trim(),
            //    firstName = requestData.firstName.Trim(),
            //    lastName = requestData.lastName.Trim(),
            //    startDate = requestData.startDate,
            //    endDate = requestData.endDate,
            //    isActive = requestData.isActive, 
            //    departmentId = requestData.departmentId,
            //    roleGroupId = requestData.roleGroupId
            //};

            var userResponse = await _userService.CreateUserAsync(requestData);
            return Json(userResponse);
        }


        [HttpGet]
        public async Task<IActionResult> GetUserById(int id)
        {
            var userResponse = await _userService.GetUserByIdAsync(id);
            return Json(userResponse);
        }

        [HttpPost]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequest requestData)
        {
            //var updateData = new MasterUserDisplay
            //{
            //    userId = requestData.userId,
            //    departmentId = requestData.departmentId,
            //    userName = requestData.userName,
            //    userEmail = requestData.userEmail,
            //    firstName = requestData.firstName,
            //    lastName = requestData.lastName,
            //    isActive = requestData.isActive,
            //    roleGroupId = requestData.roleGroupId,
            //    startDate = requestData.startDate,
            //    endDate = requestData.endDate,
            //    createdBy = 999,
            //    createdDate = DateTime.Now,
            //    updatedBy = 999,
            //    updatedDate = DateTime.Now
            //};

            var userResponse = await _userService.UpdateUserAsync(requestData);
            return Json(userResponse);
        }

        [HttpPost]
        public async Task<IActionResult> SearchUserFromBotRegister([FromBody] SearchUserForCreateRequest requestData)
        {
            requestData.createBy = 1;
            var searchUserResponse = await _bssAuthenService.SearchUserForRegisterAsync(requestData);
            return Json(searchUserResponse);
        }

        
        [HttpPost]
        public async Task<IActionResult> DeleteUser([FromBody] DeleteUserRequest requestData)
        {
           
            var userResponse = await _userService.DeleteUserAsync(requestData);
            return Json(userResponse);
        }
       

        [HttpPost]
        //[ValidateAntiForgeryToken]
        public async Task<IActionResult> SearchUser([FromBody] DataTablePagedRequest<MasterUserRequest> request)
        {

            var response = await _userService.SearchUserAsync(request);

            return Json(new
            {
                draw = request.Draw,
                recordsTotal = response?.data?.TotalCount,
                recordsFiltered = response?.data?.TotalCount,
                data = response?.data?.Items
            });

        }
    }
}
