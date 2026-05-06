package service

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d03-01-streak-login-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/jinzhu/copier"
)

// ==================== Request ==========================

// ==================== Response ==========================

// ==================== Endpoint ==========================

func (api *APIStruct) SubjectCheckinUpdate(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &constant.CheckinEntity{})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	subjectCheckin := &constant.SubjectCheckinEntity{}
	if request.AdminLoginAs != nil {
		subjectCheckin, err = api.Service.SubjectCheckinGetByAdmin(request.StudentId, request.SubjectId, request.AdminLoginAs)
		if err != nil {
			return helper.RespondHttpError(context, err)
		}
	} else {
		subjectCheckin, err = api.Service.SubjectCheckinGet(request.StudentId, request.SubjectId)
		if err != nil {
			return helper.RespondHttpError(context, err)
		}
	}

	// สตรวจสอบ สถานะ LastCheckin ต้องไม่ใช่วันนี้
	now := time.Now()
	today := now.Truncate(24 * time.Hour)
	lastCheckin := subjectCheckin.LastCheckin.Truncate(24 * time.Hour)
	if lastCheckin.Equal(today) {
		return context.Status(fiber.StatusOK).JSON(DataGetResponse{
			Message: "Already checked in today",
		})
	}

	if lastCheckin.AddDate(0, 0, 1).Equal(today) {
		subjectCheckin.CurrentStreak++
	} else {
		subjectCheckin.CurrentStreak = 1
	}

	if subjectCheckin.CurrentStreak > subjectCheckin.HighestStreak {
		subjectCheckin.HighestStreak = subjectCheckin.CurrentStreak
	}

	subjectCheckin.LastCheckin = now

	// เรียกใช้ service เพื่ออัปเดตข้อมูลการ check-in ของนักเรียน จาก api SubjectCheckinUpdate
	err = api.Service.SubjectCheckinUpdate(subjectCheckin)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(fiber.StatusOK).JSON(DataGetResponse{
		Data:    []constant.SubjectCheckinEntity{*subjectCheckin},
		Message: "Data retrieved",
	})

}

// // ==================== Service ==========================

func (service *serviceStruct) SubjectCheckinUpdate(request *constant.SubjectCheckinEntity) error {
	subjectCheckinEntity := &constant.SubjectCheckinEntity{}
	copier.Copy(&subjectCheckinEntity, request)
	err := service.subjectCheckinStorage.UpdateSubjectCheckin(subjectCheckinEntity)
	if err != nil {
		return err
	}

	return nil
}
