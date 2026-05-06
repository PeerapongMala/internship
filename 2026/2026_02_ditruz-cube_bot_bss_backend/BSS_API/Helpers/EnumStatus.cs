using System.ComponentModel;

namespace BSS_API.Helpers
{
    public enum EnumStatus
    {
        [Description("Registered")]
        Registered = 1,

        [Description("Delivered Note")]
        DeliveredNote = 2,

        [Description("Delivered")]
        Delivered = 3,

        [Description("Correct Return")]
        CorrectReturn = 4,

        [Description("Returned")]
        Returned = 5,

        [Description("Received")]
        Received = 6,

        [Description("Finished")]
        Finished = 7,

        [Description("Deleted Pre-Prepare")]
        DeletedPrePrepare = 8,

        [Description("Prepared")]
        Prepared = 9,

        [Description("Cancel Prepared")]
        CancelPrepared = 10,

        [Description("Reconciliation")]
        Reconciliation = 11,

        [Description("Cancel Reconciliation")]
        CancelReconciliation = 12,

        [Description("Reconciled")]
        Reconciled = 13,

        [Description("Auto Selling")]
        AutoSelling = 14,

        [Description("Adjust Offset")]
        AdjustOffset = 15,

        [Description("Approved")]
        Approved = 16,

        [Description("Verify")]
        Verify = 17,

        [Description("Send To CBMS")]
        SendToCBMS = 18,

        [Description("Confirm")]
        Confirm = 19,

        [Description("Edited")]
        Edited = 20,

        [Description("Denied Edited")]
        DeniedEdited = 21,

        [Description("Cancel Sent Denied Edited")]
        CancelSentDeniedEdited = 22,

        [Description("Cancel Sent")]
        CancelSent = 23,

        [Description("Manual Key-in")]
        ManualKeyIn = 24,

        [Description("Denied Manual Key-in")]
        DeniedManualKeyIn = 25,

        [Description("Cancel Sent Manual Key-in")]
        CancelSentManualKeyIn = 26,

        [Description("Edited Approved")]
        EditedApproved = 27,

        [Description("Denied Edited Approved")]
        DeniedEditedApproved = 28,

        [Description("Cancel Sent Denied Approved")]
        CancelSentDeniedApproved = 29,

        [Description("Approved Cancel")]
        ApprovedCancel = 30
    }
}
