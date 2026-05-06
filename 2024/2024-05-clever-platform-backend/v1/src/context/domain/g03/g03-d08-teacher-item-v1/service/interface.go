package service

type ServiceInterface interface {
	//TeacherItemGet(id int) (*constant.TeacherItemResponse, error)
	//TeacherItemCreate(teacherItem *constant.TeacherItemRequest) (*constant.TeacherItemResponseCreate, error)
	//TeacherItemUpdate(teacherItem *constant.TeacherItemRequest) (*constant.TeacherItemResponseUpdate, error)
	//TeacherItemList(pagination *helper.Pagination, teacherItemId string, filter constant.TeacherItemListFilter) (*[]constant.TeacherItemResponse, error)
	//
	//ItemListByTeacherItemGroupId(pagination *helper.Pagination, teacherItemId string, filter constant.ItemListFilter) (*[]constant.ItemListResponse, error)
	TeacherItemGroupList(in *TeacherItemGroupListInput) (*TeacherItemGroupListOutput, error)
	TeacherItemList(in *TeacherItemListInput) (*TeacherItemListOutput, error)
	TeacherItemCreate(in *TeacherItemCreateInput) error
	TeacherItemGet(in *TeacherItemGetInput) (*TeacherItemGetOutput, error)
	TeacherItemUpdate(in *TeacherItemUpdateInput) error
	TemplateItemList(in *TemplateItemListInput) (*TemplateItemListOutput, error)
	ItemCaseBulkEdit(in *TeacherItemCaseBulkEditInput) error
}
