using Newtonsoft.Json;

namespace BSS_WEB.Helpers
{
    public class AppValidationHelper
    {
        #region / Validation User For Prepare /

        public static bool ValidatForOperationSetting(string roleGroupCode)
        {
            bool isResult = false;

            if (!string.IsNullOrEmpty(roleGroupCode) && (roleGroupCode == AppRoleGroups.Operator.GetCategory()))
            {
                isResult = true;
            }

            return isResult;
        }
        public static bool ValidatOperationForPreparation(string roleCode, string isPrepareCental, int machineId)
        {
            bool isResult = false;

            if (string.IsNullOrEmpty(roleCode) || (roleCode != AppRoles.OperatorPrepare.GetCategory()))
            {
                return false;
            }

            if (string.IsNullOrEmpty(isPrepareCental))
            {
                return false;
            }

            if (isPrepareCental == "YES")
            {
                isResult = (machineId == 0 || machineId == 999) ? true : false;
            }
            else
            {
                isResult = (machineId != 0 && machineId != 999) ? true : false;

            }

            return isResult;
        }


        #endregion / Validation User For Prepare /

        #region / Validation User For Verify /

        /// <summary>
        /// Validates if the user is authorized to perform Verify operations
        /// TODO: Implement actual logic based on business requirements
        /// </summary>
        /// <param name="roleCode">User role code</param>
        /// <param name="machineId">Machine ID assigned to user</param>
        /// <returns>True if user is authorized for Verify operations</returns>
        public static bool ValidatOperationForVerify(string roleCode, int machineId)
        {
            // TODO: Replace with actual validation logic
            // Example checks:
            // - roleCode should be Operator, Supervisor, or Manager
            // - machineId should match allowed machines for Verify operations
            // - Additional shift/session validations if needed

            if (string.IsNullOrEmpty(roleCode))
            {
                return false;
            }

            // Temporary: Allow any role with assigned machine
            // Replace with actual business logic
            bool isValidRole = !string.IsNullOrEmpty(roleCode);
            bool isValidMachine = (machineId > 0 && machineId != 999); // Example: exclude special IDs

            return isValidRole && isValidMachine;
        }

        #endregion / Validation User For Verify /

        #region / Validation User For Approve Manual Key-in /

        /// <summary>
        /// Validates if the user is authorized to approve manual key-in transactions
        /// Only supervisors and managers can approve
        /// </summary>
        /// <param name="roleCode">User role code</param>
        /// <returns>True if user is authorized for approval operations</returns>
        public static bool ValidatOperationForApproveManualKeyIn(string roleCode)
        {
            var allowedRoles = new[] { "Supervisor", "Manager", "Admin" };
            bool isAuthorizedRole = !string.IsNullOrEmpty(roleCode)
                && allowedRoles.Contains(roleCode, StringComparer.OrdinalIgnoreCase);
            return isAuthorizedRole;
        }

        #endregion / Validation User For Approve Manual Key-in /

    }
}
