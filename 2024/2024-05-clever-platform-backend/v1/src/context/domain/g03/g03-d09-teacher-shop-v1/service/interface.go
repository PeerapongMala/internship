package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	TeacherShopSubjectLists(pagination *helper.Pagination, teacherId string) (r []constant.SubjectTeacherResponse, err error)
	TeacherShopLists(pagination *helper.Pagination, filter *constant.TeacherShopListFilter, subjectId int, teacherId string) (r []constant.ShopItemResponse, err error)
	TeacherShopSubjectGet(subjectId int, teacherId string) (r constant.SubjectTeacherResponse, err error)
	TeacherShopGet(storeItemId int, teacherId string, subjectId int) (r constant.ShopItemResponse, err error)
	TeacherShopCreate(c constant.ShopItemRequest, teacherId string) (r *constant.ShopItemEntity, err error)
	TeacherShopUpdate(in *TeacherShopUpdateInput) (err error)
	TeacherShopUpdateStatus(storeItemId int, c constant.ShopItemStatusRequest) (r constant.ShopItemEntity, err error)
	TeacherShopUpdateStatusBulkEdit(items constant.ShopItemStatusBulkEditRequest, updateBy string) (r []constant.ShopItemEntity, err error)

	// Transaction //
	TeacherShopTransactionList(pagination *helper.Pagination, filter *constant.TeacherShopListFilter, storeItemId int) (r []constant.ShopItemTransactionResponse, err error)
	TeacherShopTransactionUpdateStatusBulkEdit(items constant.ShopItemTransactionStatusBulkEditRequest) (r []constant.ShopItemTransactionEntity, err error)
	TeacherShopTransactionUpdateStatus(transactionId int, c constant.ShopItemTransactionStatusRequest) (r constant.ShopItemTransactionEntity, err error)

	TeacherShopCaseCopy(in *TeacherShopCaseCopyInput) (*TeacherShopCaseCopyOutput, error)
}
