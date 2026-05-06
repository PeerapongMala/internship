namespace BSS_API.Services
{
    using Helpers;
    using MimeKit;
    using MimeKit.Text;
    using Core.Template;
    using Core.Constants;
    using Models.BssMail;
    using Models.Entities;
    using MailKit.Net.Smtp;
    using BSS_API.Repositories.Interface;

    public class BssMailService(IUnitOfWork unitOfWork) : SystemMailTemplate
    {
        private IUnitOfWork _unitOfWork = unitOfWork;

        public async Task<BssMailResponse> SendMailAsync(BssMailRequest request)
        {
            BssMailResponse bssMailResponse = new BssMailResponse();

            try
            {
                // 1. Generate OTP and ref code
                BssMimeMessage bssMimeMessage = new BssMimeMessage();
                bssMimeMessage.RefCode =
                    RefCodeGenerator.GenerateRefCode(SendMailCodeConsLengthConstants.RefCodeLength);
                bssMimeMessage.OtpCode = base.GenerateOtp(SendMailCodeConsLengthConstants.OtpCodeLength);
                bssMimeMessage = GetMailMessageBodyByTypeCode(request.BssMailSystemTypeCode, bssMimeMessage,
                    TextFormat.Html);

                // 2. Get user data from database
                var userSender = await _unitOfWork.UserRepos.GetAsync(
                    w => w.UserId == request.UserSendId && w.DepartmentId == request.UserSendDepartmentId &&
                         w.IsActive == true,
                    tracked: false);
                if (userSender == null) throw new Exception("user sender not found.");

                var userReceive = await _unitOfWork.UserRepos.GetAsync(
                    w => w.UserId == request.UserReceiveId && w.IsActive == true, tracked: false);
                if (userReceive == null) throw new Exception("user receive not found.");

                bssMimeMessage.From.Add(MailboxAddress.Parse(userSender.UserEmail));
                bssMimeMessage.To.Add(MailboxAddress.Parse(userReceive.UserEmail));

                // 3. Save OTP to database first
                BssTransactionNotification bssTransactionNotification = new BssTransactionNotification
                {
                    NotificationTypeCode = request.BssMailSystemTypeCode,
                    DepartmentId = userReceive.DepartmentId,
                    Message = bssMimeMessage.OriginalBodyMessage,
                    IsSent = true,
                    CreatedBy = userSender.UserId,
                    CreatedDate = DateTime.Now,
                    OtpCode = bssMimeMessage.OtpCode,
                    OtpRefCode = bssMimeMessage.RefCode,
                    OtpDate = DateTime.Now.AddMinutes(AppConfig.BssSmtpOtpExpire),
                    BssTransactionNotiRecipient = new BssTransactionNotiRecipient
                    {
                        UserId = userReceive.UserId,
                        CreatedBy = userSender.UserId,
                        CreatedDate = DateTime.Now,
                        IsRead = false
                    }
                };

                await _unitOfWork.BssTransactionNotificationRepository.AddAsync(bssTransactionNotification);
                await _unitOfWork.SaveChangeAsync();

                // 4. Return response immediately — OTP is saved, user can validate
                bssMailResponse.IsSuccess = true;
                bssMailResponse.RefCode = bssMimeMessage.RefCode;
                bssMailResponse.OtpExpireIn = AppConfig.BssSmtpOtpExpire;
                bssMailResponse.ResponseMessage = $"send mail {request.BssMailSystemTypeCode} success";
                bssMailResponse.BssMailSystemTypeCode = request.BssMailSystemTypeCode;

                // 5. Send email in background (fire-and-forget) — don't block the response
                _ = Task.Run(async () =>
                {
                    try
                    {
                        using var smtp = new SmtpClient();
                        smtp.Timeout = 30_000; // 30 second timeout
                        if (AppConfig.BssSmtpIgnoreValidateCert)
                        {
                            smtp.ServerCertificateValidationCallback = (s, c, ch, e) => true;
                        }
                        await smtp.ConnectAsync(AppConfig.BssSmtpHost, AppConfig.BssSmtpPort);
                        await smtp.SendAsync(bssMimeMessage);
                        await smtp.DisconnectAsync(true);
                    }
                    catch
                    {
                        // Email delivery is best-effort — OTP is already saved in DB
                    }
                });
            }
            catch (Exception ex)
            {
                bssMailResponse.IsSuccess = false;
                bssMailResponse.ResponseMessage = ex.Message;
                bssMailResponse.BssMailSystemTypeCode = request.BssMailSystemTypeCode;
            }

            return bssMailResponse;
        }

        public async Task<BssMailResponse> ValidateMailAsync(BssMailRequest request)
        {
            BssMailResponse bssMailResponse = new BssMailResponse();

            if (!string.IsNullOrEmpty(request.BssMailRefCode) && !string.IsNullOrEmpty(request.BssMailOtpCode))
            {
                BssTransactionNotification? bssTransactionNotification =
                    await _unitOfWork.BssTransactionNotificationRepository
                        .GetBssTransactionNotificationForValidateAsync(request.UserSendId,
                            request.UserSendDepartmentId, request.BssMailRefCode, request.BssMailOtpCode);
                if (bssTransactionNotification != null)
                {
                    bssTransactionNotification.UpdatedBy = request.UserSendId;
                    bssTransactionNotification.UpdatedDate = DateTime.Now;

                    bssTransactionNotification.BssTransactionNotiRecipient.IsRead = true;
                    bssTransactionNotification.BssTransactionNotiRecipient.UpdatedBy = request.UserSendId;
                    bssTransactionNotification.BssTransactionNotiRecipient.UpdatedDate = DateTime.Now;
                    await _unitOfWork.SaveChangeAsync();

                    bssMailResponse.IsSuccess = true;
                    bssMailResponse.ResponseMessage = $"mail validate otp {request.BssMailOtpCode} success";
                    bssMailResponse.BssMailSystemTypeCode = request.BssMailSystemTypeCode;
                    return bssMailResponse;
                }

                bssMailResponse.IsSuccess = false;
                bssMailResponse.ResponseMessage = $"mail validate otp fail.";
                bssMailResponse.BssMailSystemTypeCode = request.BssMailSystemTypeCode;
            }

            return bssMailResponse;
        }

        private BssMimeMessage GetMailMessageBodyByTypeCode(string typeCode, BssMimeMessage bssMimeMessage,
            TextFormat textFormat)
        {
            string mailMessageBody;
            switch (typeCode)
            {
                case SendMailCodeConstants.PrepareUnfitEdit:

                    bssMimeMessage.Subject = "แก้ไข Preparation Unfit";
                    mailMessageBody = $@"
                        <h2>แก้ไขข้อมูล Preparation Unfit</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";

                    break;
                case SendMailCodeConstants.PrepareUnfitDelete:

                    bssMimeMessage.Subject = "ลบ Preparation Unfit";
                    mailMessageBody = $@"
                        <h2>ลบข้อมูล Preparation Unfit</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";

                    break;
                case SendMailCodeConstants.PrepareCANonMemberEdit:

                    bssMimeMessage.Subject = "แก้ไข Preparation CA Non Member";
                    mailMessageBody = $@"
                        <h2>แก้ไขข้อมูล Preparation CA Non Member</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";

                    break;
                case SendMailCodeConstants.PrepareCANonMemberDelete:

                    bssMimeMessage.Subject = "ลบ Preparation CA Non Member";
                    mailMessageBody = $@"
                        <h2>ลบข้อมูล Preparation CA Non Member</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";

                    break;
                case SendMailCodeConstants.PrepareCAMemberEdit:

                    bssMimeMessage.Subject = "แก้ไข Preparation CA Member";
                    mailMessageBody = $@"
                        <h2>แก้ไขข้อมูล Preparation CA Member</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";

                    break;
                case SendMailCodeConstants.PrepareCAMemberDelete:

                    bssMimeMessage.Subject = "ลบข้อมูล Preparation CA Member";
                    mailMessageBody = $@"
                        <h2>ลบข้อมูล Preparation CA Member</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";

                    break;
                case SendMailCodeConstants.PrepareUnSortCCEdit:

                    bssMimeMessage.Subject = "แก้ไข Preparation Unsort CC";
                    mailMessageBody = $@"
                        <h2>แก้ไขข้อมูล Preparation Unsort CC</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";

                    break;
                case SendMailCodeConstants.PrepareUnSortCCDelete:

                    bssMimeMessage.Subject = "ลบ Preparation Unsort CC";
                    mailMessageBody = $@"
                        <h2>ลบข้อมูล Preparation Unsort CC</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";

                    break;
                case SendMailCodeConstants.ManualKeyInEdit:

                    bssMimeMessage.Subject = "แก้ไข Manual Key-In";
                    mailMessageBody = $@"
                        <h2>แก้ไขข้อมูล Manual Key-In</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";

                    break;
                case SendMailCodeConstants.VerifyChangeShift:
                    bssMimeMessage.Subject = "เปลี่ยน Shift Auto Selling";
                    mailMessageBody = $@"
                        <h2>เปลี่ยน Shift Auto Selling</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";
                    break;
                case SendMailCodeConstants.VerifyCancelSend:
                    bssMimeMessage.Subject = "ยกเลิกรายการ Auto Selling";
                    mailMessageBody = $@"
                        <h2>ยกเลิกรายการ Auto Selling</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";
                    break;
                case SendMailCodeConstants.VerifyAdjustOffset:
                    bssMimeMessage.Subject = "Adjust Offset Auto Selling";
                    mailMessageBody = $@"
                        <h2>Adjust Offset Auto Selling</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";
                    break;
                case SendMailCodeConstants.RevokeAutoSelling:
                    bssMimeMessage.Subject = "Revoke ";
                    mailMessageBody = $@"
                        <h2>Revoke </h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";
                    break;
                case SendMailCodeConstants.ReconciliationReconfirm:
                    bssMimeMessage.Subject = "ยืนยันกระทบยอด Reconciliation";
                    mailMessageBody = $@"
                        <h2>ยืนยันกระทบยอด Reconciliation</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";
                    break;
                case SendMailCodeConstants.ReconciliationCancel:
                    bssMimeMessage.Subject = "ยกเลิกกระทบยอด Reconciliation";
                    mailMessageBody = $@"
                        <h2>ยกเลิกกระทบยอด Reconciliation</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";
                    break;
                case SendMailCodeConstants.ReconciliationPrepareEdit:
                    bssMimeMessage.Subject = "แก้ไข Header Card - Prepare";
                    mailMessageBody = $@"
                        <h2>แก้ไข Header Card - Prepare</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";
                    break;
                case SendMailCodeConstants.ReconciliationMachineEdit:
                    bssMimeMessage.Subject = "แก้ไข Header Card - Machine";
                    mailMessageBody = $@"
                        <h2>แก้ไข Header Card - Machine</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";
                    break;
                default:
                    throw new Exception("mail type code is not valid.");
            }

            bssMimeMessage.OriginalBodyMessage = mailMessageBody;
            bssMimeMessage.Body = new TextPart(textFormat) { Text = mailMessageBody };
            return bssMimeMessage;
        }
    }
}