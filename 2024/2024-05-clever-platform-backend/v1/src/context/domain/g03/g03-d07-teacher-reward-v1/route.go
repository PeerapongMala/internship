package g03D07TeacherRewardV1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	app.Post(path+"/reward", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.TeacherRewardCreate)
	app.Get(path+"/reward", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.TeacherRewardList)
	app.Patch(path+"/reward/:rewardId", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.TeacherRewardCallBack)
	app.Post(path+"/reward/bulk-edit", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.TeacherRewardBulkEdit)
	app.Get(path+"/reward/download/csv", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.TeacherRewardCsvDownload)
	app.Post(path+"/reward/upload/csv", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.TeacherRewardCsvUpload)
	app.Get(path+"/reward/student/:userId", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudentGet)
	app.Get(path+"/reward/:itemId", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.ItemGet)

	//Drop-down
	app.Get(path+"/teacher-subject/drop-down", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.TeacherSubjectDropDown)
	app.Get(path+"/students/drop-down", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudentDropDown)
	app.Get(path+"/academic-year/drop-down", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.AcademicYearDropDown)
	app.Get(path+"/year/drop-down", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.YearDropDown)
	app.Get(path+"/class/drop-down", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.ClassDropDown)
	app.Get(path+"/study-group/drop-down", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.StudyGroupDropDown)
	app.Get(path+"/teacher-items/:subjectId/drop-down", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.TeacherItemDropDown)

	app.Get(path+"/coupon-transactions", authMiddleware.CheckRoles(constant.Teacher), api.CouponTransactionList)
	app.Patch(path+"/coupon-transactions/:couponTransactionId", authMiddleware.CheckRoles(constant.Teacher), api.CouponTransactionUpdate)
	app.Get(path+"/reward/:teacherRewardId/copy", authMiddleware.CheckRoles(constant.Teacher, constant.Admin), api.TeacherRewardCaseCopy)
}
