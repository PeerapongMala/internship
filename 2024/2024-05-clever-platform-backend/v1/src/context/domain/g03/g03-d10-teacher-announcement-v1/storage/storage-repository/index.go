package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d10-teacher-announcement-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type TeacherAnnounceRepository interface {
	AnnouncementCreate(req constant.TeacherAnnounceCreate) error
	AnnouncementUpdate(req constant.TeacherAnnounceUpdate) error
	GetAnnouncementByid(announceId int) (*constant.TeacherAnnounceResponse, error)
	GetSchoolByUserId(teacherId string) (int, error)
	AnnouncementList(pagination *helper.Pagination, schoolId int, filter constant.TeacherAnnounceFilter) ([]constant.TeacherAnnounceResponse, int, error)
	SChoolList() ([]constant.SchoolListResponse, error)
	AnnouncementBulkEdit(req constant.AnnouncementBulkEdit) error
}
