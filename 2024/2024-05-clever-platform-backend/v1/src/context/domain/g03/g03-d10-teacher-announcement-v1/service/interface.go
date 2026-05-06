package service

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d10-teacher-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type ServiceInterface interface {
	AnnouncementCreate(req constant.TeacherAnnounceCreate, Role constant.CheckRoleRequest) error
	AnnouncementUpdate(req constant.TeacherAnnounceUpdate, Role constant.CheckRoleRequest) error
	GetAnnouncementByid(announceId int, Role constant.CheckRoleRequest) (*constant.TeacherAnnounceResponse, error)
	AnnouncementList(pagination *helper.Pagination, filter constant.TeacherAnnounceFilter, Role constant.CheckRoleRequest) ([]constant.TeacherAnnounceResponse, int, error)
	TeacherAnnounceCsvDownload(req constant.CsvDowloadRequest, teacherId string, filter constant.TeacherAnnounceFilter) ([]byte, error)
	TeacherAnnounceCsvUpload(req constant.CSVUploadRequest, Role constant.CheckRoleRequest) error
	AnnouncementBulkEdit(req []constant.AnnouncementBulkEdit, Role constant.CheckRoleRequest) error
}
