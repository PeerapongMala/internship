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
    }
}