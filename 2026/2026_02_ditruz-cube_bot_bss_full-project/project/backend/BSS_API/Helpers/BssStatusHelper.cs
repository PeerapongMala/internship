namespace BSS_API.Helpers
{
    using Core.Constants;

    public abstract class BssStatusHelper
    {
        public static BssStatusEnum ToBssStatusEnum(int statusId)
        {
            return statusId switch
            {
                BssStatusConstants.Registered => BssStatusEnum.Registered,
                BssStatusConstants.DeliveredNote => BssStatusEnum.DeliveredNote,
                BssStatusConstants.Delivered => BssStatusEnum.Delivered,
                BssStatusConstants.CorrectReturn => BssStatusEnum.CorrectReturn,

                BssStatusConstants.NotAccepted => BssStatusEnum.NotAccepted,
                BssStatusConstants.Received => BssStatusEnum.Received,
                BssStatusConstants.Finished => BssStatusEnum.Finished,
                BssStatusConstants.DeletedPrePrepare => BssStatusEnum.DeletedPrePrepare,

                BssStatusConstants.Prepared => BssStatusEnum.Prepared,
                BssStatusConstants.CancelPrepared => BssStatusEnum.CancelPrepared,
                BssStatusConstants.Reconciliation => BssStatusEnum.Reconciliation,
                BssStatusConstants.CancelReconciliation => BssStatusEnum.CancelReconciliation,

                BssStatusConstants.Reconciled => BssStatusEnum.Reconciled,
                BssStatusConstants.AutoSelling => BssStatusEnum.AutoSelling,
                BssStatusConstants.AdjustOffset => BssStatusEnum.AdjustOffset,
                BssStatusConstants.Approved => BssStatusEnum.Approved,

                BssStatusConstants.Verify => BssStatusEnum.Verify,
                BssStatusConstants.SendToCBMS => BssStatusEnum.SendToCBMS,
                BssStatusConstants.Confirm => BssStatusEnum.Confirm,
                BssStatusConstants.Edited => BssStatusEnum.Edited,

                BssStatusConstants.DeniedEdited => BssStatusEnum.DeniedEdited,
                BssStatusConstants.CancelSentDeniedEdited => BssStatusEnum.CancelSentDeniedEdited,
                BssStatusConstants.CancelSent => BssStatusEnum.CancelSent,
                BssStatusConstants.ManualKeyIn => BssStatusEnum.ManualKeyIn,

                BssStatusConstants.DeniedManualKeyIn => BssStatusEnum.DeniedManualKeyIn,
                BssStatusConstants.CancelSentManualKeyIn => BssStatusEnum.CancelSentManualKeyIn,
                BssStatusConstants.EditedApproved => BssStatusEnum.EditedApproved,
                BssStatusConstants.DeniedEditedApproved => BssStatusEnum.DeniedEditedApproved,

                BssStatusConstants.CancelSentDeniedApproved => BssStatusEnum.CancelSentDeniedApproved,
                BssStatusConstants.ApprovedCancel => BssStatusEnum.ApprovedCancel,

                BssStatusConstants.Returned => BssStatusEnum.Returned,
                BssStatusConstants.Process => BssStatusEnum.Process,

                _ => BssStatusEnum.None
            };
        }
    }
}