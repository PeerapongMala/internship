using BSS_API.Helpers;
using BSS_API.Models.Entities;

namespace BSS_API.Services
{
    using BSS_API.Repositories.Interface;
    using Core.Constants;
    using Core.CustomException;
    using DocumentFormat.OpenXml.Bibliography;
    using Interface;
    using Models.ModelHelper;
    using Models.RequestModels;
    using Models.ResponseModels;

    public class UnsortReceiveDeliveryService(IUnitOfWork unitOfWork) : IUnsortReceiveDeliveryService
    {
  
        //Add By MarK
        public async Task<List<SendUnsortCCResponse>> LoadSendUnsortCCList(int departmentId,int userId,
          CancellationToken ct = default)
        {
            var configs =
                (await unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync(ConfigConstants.BSS_DAY));

            var startDateTime = configs.ToBssWorkDayStartDateTime();
            var endDateTime = configs.ToBssWorkDayEndDateTime();

            var data = (await unitOfWork.TransactionSendUnsortCCRepos.GetSendUnsortCCDetailsAsync(departmentId,
                startDateTime, endDateTime, ct)).ToList();


            foreach (var header in data)
            {
                // 1. เช็กเงื่อนไข Security: ผู้ส่ง (CreatedBy) กับ ผู้รับ (userId) ต้องไม่ตรงกัน
                bool isDifferentUser = header.CreatedBy != userId;

                // 2. เช็กสถานะการใช้งานระดับ Item ทั้งใบนำส่ง (เพื่อคุม Header)
                bool isAnyItemUsedInHeader = header.ContainerData?.Any(c =>
                    c.UnsortCCReceiveData?.Any(u => u.BanknoteQty != u.RemainingQty || u.AdjustQty != 0) ?? false
                ) ?? false;

                // 2. เช็กว่ามีการ "เริ่มใช้งาน" (Prepare) ไปแล้วหรือยังในระดับ Header
                // ใช้สูตรเดียวกับที่คุณส่งมา: Pqty = BanknoteQty - RemainingQty - AdjustQty
                bool hasAnyItemStartedPrepare = header.ContainerData?.Any(c =>
                    c.UnsortCCReceiveData?.Any(u =>
                        (u.BanknoteQty - u.RemainingQty - (u.AdjustQty ?? 0)) > 0
                    ) ?? false
                ) ?? false;

                // --- [ระดับ Header (ใบนำส่ง)] ---
                // จะแก้ใบนำส่งได้ต้อง: (ผู้รับไม่ตรงกับผู้ส่ง) AND (ยังไม่มี Item ไหนถูกแก้ไข)
                header.CanEdit = isDifferentUser && !hasAnyItemStartedPrepare;
                header.CanDelete = isDifferentUser && !hasAnyItemStartedPrepare;

                if (header.ContainerData != null)
                {
                    foreach (var container in header.ContainerData)
                    {
                        // --- [ระดับ Container (ตู้/ถุงเงิน)] ---
                        // เช็กว่า Item เฉพาะในตู้นี้ มีการแก้ไขหรือยัง?
                        bool isAnyItemUsedInContainer = container.UnsortCCReceiveData?.Any(u =>
                            u.BanknoteQty != u.RemainingQty || u.AdjustQty != 0
                        ) ?? false;

                        // กฎ: ถ้า Item ในตู้นี้ยังไม่ถูกแก้ไขเลย และเรามีสิทธิ์ (ชื่อไม่ตรง) -> ลบ Container ได้
                        container.CanEdit = isDifferentUser && !hasAnyItemStartedPrepare;
                        container.CanDelete = isDifferentUser && !hasAnyItemStartedPrepare;

                        if (container.UnsortCCReceiveData != null)
                        {
                            foreach (var item in container.UnsortCCReceiveData)
                            {
                                //// --- [ระดับ Item (รายการธนบัตร)] ---
                                //// เช็กว่า Item ตัวนี้ตัวเดียว ถูกแก้ไขหรือยัง?
                                //bool isThisItemUsed = (item.BanknoteQty != item.RemainingQty || item.AdjustQty != 0);
                                //isThisItemUsed = false;

                                //// กฎ: ถ้าชื่อไม่ตรงกัน และ Item นี้ยังไม่ถูกใช้งาน -> แก้ไข Item ได้
                                //item.CanEdit = isDifferentUser && !isThisItemUsed;
                                //item.CanDelete = isDifferentUser && !isThisItemUsed;


                                item.CanEdit = isDifferentUser;
                                item.CanDelete = isDifferentUser;

                            }
                        }
                    }
                }
            }


            return data;
        }

        public async Task<List<ContainerBySendUnsortIdResponse>> LoadContainerBySendUnsortIdList(string SendUnsortId,
          CancellationToken ct = default)
        {
            var configs =
                (await unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync(ConfigConstants.BSS_DAY));

            var startDateTime = configs.ToBssWorkDayStartDateTime();
            var endDateTime = configs.ToBssWorkDayEndDateTime();

            var data = (await unitOfWork.TransactionSendUnsortCCRepos.GetContainerBySendUnsortId(SendUnsortId,ct)).ToList();

           
            return data;
        }

        public async Task<SendUnsortCCResponse> GetReceiveBySendUnsortCode(string SendUnsortCode, int departmentId, CancellationToken ct = default)
        {
            var configs =
                (await unitOfWork.ConfigRepos.GetByConfigTypeCodeAsync(ConfigConstants.BSS_DAY));

            var startDateTime = configs.ToBssWorkDayStartDateTime();
            var endDateTime = configs.ToBssWorkDayEndDateTime();

            var data = (await unitOfWork.TransactionSendUnsortCCRepos.GetReceiveBySendUnsortCode(SendUnsortCode, departmentId,
                startDateTime, endDateTime, ct));

            return data;
        }

        public async Task<int> RemoveBinContainerNotPrepareData(int RegisterUnsortId, int UserId, CancellationToken ct = default)
        {
            

            var data = (await unitOfWork.TransactionSendUnsortCCRepos.RemoveBinContainerNotPrepareData(RegisterUnsortId, UserId, ct));

            return RegisterUnsortId;
        }


        public async Task<bool> ExecuteReceiveDelivery(int sendUnsortId, int userId, CancellationToken ct = default)
        {
            // สถานะ 6 = รับมอบ
            return await unitOfWork.TransactionSendUnsortCCRepos.UpdateSendUnsortStatusAsync(sendUnsortId, userId, 6, null, ct);
        }

        public async Task<bool> ExecuteRejectDelivery(int sendUnsortId, int userId, string note, CancellationToken ct = default)
        {
            // สถานะ 5 = ไม่รับมอบ
            return await unitOfWork.TransactionSendUnsortCCRepos.UpdateSendUnsortStatusAsync(sendUnsortId, userId, 5, note, ct);
        }


        public async Task<bool> ExecuteReturnDelivery(List<int> ids, int userId, string note, CancellationToken ct = default)
        {
            // ใช้ Method ที่ Interface เตรียมไว้ให้ (ExecuteWithTransactionAsync)
            return await unitOfWork.ExecuteWithTransactionAsync(async () =>
            {
                foreach (var id in ids)
                {
                    var success = await unitOfWork.TransactionSendUnsortCCRepos
                        .UpdateSendUnsortStatusAsync(id, userId, 31, note, ct);

                    if (!success) throw new Exception($"Failed to update ID: {id}");
                }

                await unitOfWork.SaveChangeAsync(); // ใช้ SaveChangeAsync ตามที่มีใน Interface
                return true;
            });
        }


        public async Task<UnsortCCReceiveResponse> UpdateRemainingQtyReceive(UpdateRemainingQtyReceiveRequest request, CancellationToken ct = default)
        {
            // ใช้ Method ที่ Interface เตรียมไว้ให้
            return await unitOfWork.ExecuteWithTransactionAsync(async () =>
            {
                // 1. เรียก Repository ที่ตอนนี้คืนค่าเป็น UnsortCCReceiveResponse แล้ว
                var result = await unitOfWork.TransactionSendUnsortCCRepos
                    .UpdateRemainingQtyReceive(request, ct);

                // 2. ถ้าผลลัพธ์เป็น null (หา ID ไม่เจอ) ให้โยน Exception เพื่อให้ระบบ Transaction ทำการ Rollback
                if (result == null)
                {
                    throw new Exception($"ไม่พบข้อมูลที่ต้องการอัปเดต: RegisterUnsortId {request.RegisterUnsortId}");
                }

                // 3. บันทึกการเปลี่ยนแปลง (ถ้าใน Repository ยังไม่ได้สั่ง SaveChanges ภายในตัวมันเอง)
                await unitOfWork.SaveChangeAsync();

                // 4. ส่งค่า Object ที่อัปเดตแล้วกลับไป
                return result;
            });
        }

    }
}