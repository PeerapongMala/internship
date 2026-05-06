using BSS_WEB.Models.ObjectModel;
using System.Security.Claims;

namespace BSS_WEB.Infrastructure
{
    public static class AuthenticationExtensions
    {

        public static AuthenticationApp? AuthenticationApplication(HttpContext context)
        {
            AuthenticationApp authentication = new AuthenticationApp();

            try
            {
                ClaimsPrincipal currentUser = context.User;
                if (currentUser.Identity?.IsAuthenticated == true)
                {
                    authentication.AccessToken = currentUser.FindFirst("AccessToken")?.Value;
                    //authentication.UserNameID = currentUser.FindFirstValue(ClaimTypes.NameIdentifier);
                    //authentication.UserID = currentUser.FindFirst("UserID")?.Value;
                    //authentication.UserNameDisplay =  currentUser.FindFirst("UserNameDisplay")?.Value;
                    //authentication.FirstName = currentUser.FindFirst("FirstName")?.Value;
                    //authentication.LastName = currentUser.FindFirst("LastName")?.Value;
                    //authentication.UserEmail = currentUser.FindFirst("UserEmail")?.Value;
                    //authentication.RoleGroupId = currentUser.FindFirst("RoleGroupId")?.Value;
                    //authentication.RoleGroupName = currentUser.FindFirst("RoleGroupName")?.Value;
                    //authentication.RoleId = currentUser.FindFirst("RoleId")?.Value;
                    //authentication.RoleCode = currentUser.FindFirst("RoleCode")?.Value;
                    //authentication.RoleName = currentUser.FindFirst("RoleName")?.Value;
                    //authentication.DepartmentId = currentUser.FindFirst("DepartmentId")?.Value;
                    //authentication.DepartmentName = currentUser.FindFirst("DepartmentName")?.Value;
                    //authentication.IsSendUnsortCc = currentUser.FindFirst("IsSendUnsortCc")?.Value;
                    //authentication.IsPrepareCentral = currentUser.FindFirst("IsPrepareCentral")?.Value;
                    //authentication.StartDate = currentUser.FindFirst("StartDate")?.Value;
                    //authentication.EndDate = currentUser.FindFirst("EndDate")?.Value;
                    //authentication.ExpireDateTime = currentUser.FindFirst("ExpireDateTime")?.Value;
                    //authentication.IsExternalUser = currentUser.FindFirst("IsExternalUser")?.Value;
                    //authentication.Machine = currentUser.FindFirst("Machine")?.Value;
                    //authentication.SorterUserId = currentUser.FindFirst("SorterUserId")?.Value;
                    //authentication.SystemName = currentUser.FindFirst("SystemName")?.Value;
                }
                else
                {
                    return null;
                }

                return authentication;
            }
            catch
            {
                return null;
            }
        }
    }
}
