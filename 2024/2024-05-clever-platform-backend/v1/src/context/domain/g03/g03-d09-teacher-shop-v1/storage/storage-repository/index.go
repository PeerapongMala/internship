package storageRepository

import (
	rewardConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type TeacherShopRepository interface {
	BeginTx() (*sqlx.Tx, error)
	ItemCreate(tx *sqlx.Tx, entity rewardConstant.ItemEntity) (int, error)

	TeacherShopSubjectLists(pagination *helper.Pagination, teacherId string) (r []constant.SubjectTeacherResponse, err error)
	TeacherShopLists(pagination *helper.Pagination, filter *constant.TeacherShopListFilter, subjectId int, teacherId string) (r []constant.ShopItemResponse, err error)
	TeacherShopSubjectGet(subjectId int, teacherId string) (r constant.SubjectTeacherResponse, err error)
	TeacherShopGet(storeItemId int, teacherId string, subjectId int) (r constant.ShopItemResponse, err error)
	TeacherShopCreate(tx *sqlx.Tx, c constant.ShopItemRequest, teacherId string) (r *constant.ShopItemEntity, err error)
	TeacherShopUpdate(tx *sqlx.Tx, storeItemId int, itemId int, c constant.ShopItemRequest) (err error)
	TeacherShopUpdateStatus(storeItemId int, c constant.ShopItemStatusRequest) (r constant.ShopItemEntity, err error)
	TeacherShopUpdateStatusBulkEdit(items []constant.BulkEditList, updateBy string) (r []constant.ShopItemEntity, err error)

	// Transaction //
	TeacherShopTransactionList(pagination *helper.Pagination, filter *constant.TeacherShopListFilter, storeItemId int) (r []constant.ShopItemTransactionResponse, err error)
	TeacherShopTransactionUpdateStatusBulkEdit(items []constant.BulkEditTransactionList) (r []constant.ShopItemTransactionEntity, err error)
	TeacherShopTransactionUpdateStatus(transactionId int, c constant.ShopItemTransactionStatusRequest) (r constant.ShopItemTransactionEntity, err error)

	ClassTeacherShopCreate(tx *sqlx.Tx, teacherShopItemId int, classId int) error
	StudyGroupTeacherShopCreate(tx *sqlx.Tx, teacherShopItemId int, studyGroupId int) error
	StudentTeacherShopCreate(tx *sqlx.Tx, teacherShopItemId int, studentId string) error
	TeacherShopItemGet(teacherShopItemId int) (*constant.ShopItem, error)
}
