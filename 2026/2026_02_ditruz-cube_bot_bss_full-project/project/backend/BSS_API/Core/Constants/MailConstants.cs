namespace BSS_API.Core.Constants
{
    public abstract class SendMailCodeConsLengthConstants
    {
        public const int RefCodeLength = 8;
        public const int OtpCodeLength = 6;
    }

    public abstract class SendMailCodeConstants
    {
        public const string PrepareUnfitEdit = "PREPARE_UNFIT_EDIT";
        public const string PrepareUnfitDelete = "PREPARE_UNFIT_DELETE";

        public const string PrepareCANonMemberEdit = "PREPARE_CA_NON_MEMBER_EDIT";
        public const string PrepareCANonMemberDelete = "PREPARE_CA_NON_MEMBER_DELETE";

        public const string PrepareCAMemberEdit = "PREPARE_CA_MEMBER_EDIT";
        public const string PrepareCAMemberDelete = "PREPARE_CA_MEMBER_DELETE";

        public const string PrepareUnSortCCEdit = "PREPARE_UNSORT_CC_EDIT";
        public const string PrepareUnSortCCDelete = "PREPARE_UNSORT_CC_DELETE";

        public const string ManualKeyInEdit = "MANUAL_KEY_IN_EDIT";

        public const string VerifyChangeShift = "VERIFY_CHANGE_SHIFT";
        public const string VerifyCancelSend = "VERIFY_CANCEL_SEND";
        public const string VerifyAdjustOffset = "VERIFY_ADJUST_OFFSET";

        public const string RevokeAutoSelling = "REVOKE_AUTO_SELLING";

        public const string ReconciliationPrepareEdit = "RECONCILIATION_PREPARE_EDIT";
        public const string ReconciliationMachineEdit = "RECONCILIATION_MACHINE_EDIT";
        public const string ReconciliationReconfirm = "RECONCILIATION_RECONFIRM";
        public const string ReconciliationCancel = "RECONCILIATION_CANCEL";
    }
}