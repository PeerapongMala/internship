package g03d09teacherShopv1

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/service"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
)

func route(app *fiber.App, authMiddleware *middleware.AuthMiddleware, serviceInstance service.ServiceInterface, path string) {
	api := &service.APIStruct{Service: serviceInstance}

	group := app.Group(path, authMiddleware.CheckRoles(constant.Admin, constant.Teacher))
	group.Get("/teacher/shop/subject", api.TeacherShopSubjectLists)
	group.Get("/teacher/shop/subject_id/:subjectId", api.TeacherShopLists)
	group.Get("/teacher/shop/subject_id/:subjectId/store_item_id/:storeItemId", api.TeacherShopGet)
	group.Get("/teacher/shop/subject/subject_id/:subjectId", api.TeacherShopSubjectGet)
	group.Post("/teacher/shop", api.TeacherShopCreate)
	group.Patch("/teacher/shop/store_item_id/:storeItemId", api.TeacherShopUpdate)
	group.Patch("/teacher/shop/store_item_id/:storeItemId/status", api.TeacherShopUpdateStatus)
	group.Patch("/teacher/shop/status/bulk_edit", api.TeacherShopUpdateStatusBulkEdit)

	// Transaction //
	group.Get("/teacher/shop/store_item_id/:storeItemId/transaction", api.TeacherShopTransactionList)
	group.Patch("teacher/shop/transaction/store_transaction_id/:storeTransactionId/status", api.TeacherShopTransactionUpdateStatus)
	group.Patch("/teacher/shop/transaction/status/bulk_edit", api.TeacherShopTransactionUpdateStatusBulkEdit)
	group.Get("/teacher/shop/:teacherShopItemId/copy", api.TeacherShopCaseCopy)
}
