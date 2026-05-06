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
                BssMimeMessage bssMimeMessage = new BssMimeMessage();
                using var smtp = new SmtpClient();
                if (AppConfig.BssSmtpIgnoreValidateCert)
                {
                    smtp.ServerCertificateValidationCallback = (sender, certificate, chain, errors) => true;
                }

                base.SetSmtpClient(smtp);
                if (!await base.CanConnectAsync(AppConfig.BssSmtpHost, AppConfig.BssSmtpPort,
                        AppConfig.BssSmtpUser, AppConfig.BssSmtpPassword, AppConfig.BssSmtpUseTls))
                {
                    throw new Exception("cannot connect to SMTP server.");
                }

                bssMimeMessage.RefCode =
                    RefCodeGenerator.GenerateRefCode(SendMailCodeConsLengthConstants.RefCodeLength);
                bssMimeMessage.OtpCode = base.GenerateOtp(SendMailCodeConsLengthConstants.OtpCodeLength);
                bssMimeMessage = GetMailMessageBodyByTypeCode(request.BssMailSystemTypeCode, bssMimeMessage,
                    TextFormat.Html);

                // Todo get user data from database
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

                // Todo insert data to database
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

                // Todo send after insert data to database success
                await base.SendMailAsync(bssMimeMessage);

                bssMailResponse.IsSuccess = true;
                bssMailResponse.RefCode = bssMimeMessage.RefCode;
                bssMailResponse.OtpExpireIn = AppConfig.BssSmtpOtpExpire;
                bssMailResponse.ResponseMessage = $"send mail {request.BssMailSystemTypeCode} success";
                bssMailResponse.BssMailSystemTypeCode = request.BssMailSystemTypeCode;
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

                    bssMimeMessage.Subject = "แก้ใข Preparation Unfit";
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

                    bssMimeMessage.Subject = "แก้ใข Preparation CA Non Member";
                    mailMessageBody = $@"
                        <h2>แก้ใขข้อมูล Preparation CA Non Member</h2></br>
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

                    bssMimeMessage.Subject = "แก้ใข Preparation CA Member";
                    mailMessageBody = $@"
                        <h2>แก้ใขข้อมูล Preparation CA Member</h2></br>
                        <p>Ref code : {bssMimeMessage.OtpCode}</p>
                        <p>OTP code : {bssMimeMessage.RefCode}</p>";

                    break;
                case SendMailCodeConstants.PrepareCAMemberDelete:

                    bssMimeMessage.Subject = "ลบข้อมูล Preparation CA Member";
                    mailMessageBody = $@"
                        <h2>ลบข้อมูล Preparation CA Member</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";

                    break;
                case SendMailCodeConstants.PrepareUnSortCCEdit:

                    bssMimeMessage.Subject = "แก้ใข Preparation UnSoft CC";
                    mailMessageBody = $@"
                        <h2>แก้ใขข้อมูล Preparation UnSoft CC</h2></br>
                        <p>Ref code : {bssMimeMessage.RefCode}</p>
                        <p>OTP code : {bssMimeMessage.OtpCode}</p>";

                    break;
                case SendMailCodeConstants.PrepareUnSortCCDelete:

                    bssMimeMessage.Subject = "ลบ Preparation UnSoft CC";
                    mailMessageBody = $@"
                        <h2>ลบข้อมูล Preparation UnSoft CC</h2></br>
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