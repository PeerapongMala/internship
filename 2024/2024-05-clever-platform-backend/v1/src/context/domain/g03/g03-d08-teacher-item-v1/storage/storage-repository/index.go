package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d08-teacher-item-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	//GetTeacherItem(id int) (*constant.TeacherItemResponse, error)
	//CreateTeacherItem(teacherItem *constant.TeacherItemRequest) (*constant.TeacherItemResponseCreate, error)
	//UpdateTeacherItem(teacherItem *constant.TeacherItemRequest) (*constant.TeacherItemResponseUpdate, error)
	//ListTeacherItem(pagination *helper.Pagination, teacherItemId string, filter constant.TeacherItemListFilter) (*[]constant.TeacherItemResponse, error)
	//
	//ListItemByTeacherItemGroupId(pagination *helper.Pagination, teacherItemId string, filter constant.ItemListFilter) (*[]constant.ItemListResponse, error)

	TeacherItemGroupList(pagination *helper.Pagination, teacherId string, filter *constant.TeacherItemGroupFilter) ([]constant.TeacherItemGroupEntity, error)
	TeacherItemList(pagination *helper.Pagination, filter constant.TeacherItemFilter, teacherId string) ([]constant.ItemEntity, error)
	ItemCreate(tx *sqlx.Tx, item *constant.ItemEntity, subjectId int, userId string) (*int, error)
	BadgeCreate(tx *sqlx.Tx, badge *constant.BadgeEntity) error
	ItemGet(itemId int) (*constant.ItemEntity, error)
	ItemUpdate(tx *sqlx.Tx, item *constant.ItemEntity) error
	BadgeUpdate(tx *sqlx.Tx, badge *constant.BadgeEntity) error
	TeacherItemGroupUpdate(tx *sqlx.Tx, teacherItemGroup *constant.TeacherItemGroupEntity) error
	TemplateItemList(pagination *helper.Pagination, itemType string) ([]constant.TemplateItemEntity, error)
	ValidateTeacher(teacherId string, schoolId int) (bool, error)
}
