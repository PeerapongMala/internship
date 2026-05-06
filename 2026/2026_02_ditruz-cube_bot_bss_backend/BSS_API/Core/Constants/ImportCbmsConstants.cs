namespace BSS_API.Core.Constants
{
    public abstract class ImportCbmsParameterLengthConstants
    {
        public const int bdc_code_length = 5;

        public const int bn_type_input_length = 3;

        public const int barcode_length = 20;

        public const int container_id_length = 20;

        public const int send_date_length = 20;

        public const int inst_code_length = 12;

        public const int deno_prefix_length = 9;

        public const int deno_subfix_length = 2;

        public const int qty_length = 12;

        public const int cb_bdc_code_length = 5;

        public const int requested_by_length = 20;
    }

    public abstract class ImportCbmsResponseCodeConstants
    {
        public const string Success = "200";
        public const string ParameterBadRequest = "400";
        public const string ImportError = "500";
    }

    public abstract class ImportCbmsResponseMessageConstants
    {
        public const string Success = "successful operation.";

        public const string Failed = "batch operation failed.";

        public const string FailedWithExceptionMessage = "batch operation failed";

        public const string QtyParameterLessThenZero = "qty parameter less then zero.";

        public const string ParameterNotFoundInMasterData = "{0} [{1}] is not found in the master data.";

        public const string ParameterIsMissing =
            "bad request, [invalid input data – The required field {0} is missing.";

        public const string ParameterMaximumLimit =
            "{0} Length exceeds the maximum allowed limit.";

        public const string ParameterInvalidFormat =
            "{0} is in an incorrect format. Expected format: {1}].";

        public const string ParameterCashCenterNotFoundInInstitution =
            "No Cash center code {0} was found for this Bank code {1}.";

        public const string RegisteredInRegisterUnSort = "Container code {0} is registered Unsort CC.";

        public const string MultipleContainerPrepareActive = "Container {0} found multiple active.";

        public const string NewQTYIsLessThenPreparedInBSS = "Container {0}. New QTY {1} is less then Prepared QTY {2}.";
    }
}