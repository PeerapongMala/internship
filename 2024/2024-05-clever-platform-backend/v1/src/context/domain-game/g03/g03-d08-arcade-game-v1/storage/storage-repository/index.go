package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d08-arcade-game-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/lib/pq"
)

type ArcadeGameRepository interface {
	ArcadeGameList(pagination *helper.Pagination) ([]constant.ArcadeGameResponse, int, error)
	GetYearByStudentId(studentId string) (string, error)
	GetCurriculumGroupByStudentId(studentId string) (int, error)
	GetClassByStudentId(studentId string, schoolId int) (int, error)
	LeaderBoardList(studentId string, filter *constant.LeaderBoardFilter, pagination *helper.Pagination) (eventIds pq.Int64Array, eventDetails *constant.LeaderBoardTitle, stats []constant.LeaderBoardResponse, err error)
	GetSchoolIdByStudentName(studentName string) (int, error)
	GetEventDateBySchoolId(schoolId int, arcadeGameId int) ([]constant.AnnouncementEventTimeStamp, error)
	GetClassByYear(Year string, schoolId int) ([]int, error)
	GetAffiliationBySchoolId(schoolId int) (int, error)
	SchoolListByAffiliationId(AffiliationId int) ([]int, error)
	ArcadeGameInfo(arcadeGameId int) (*constant.ArcadeGameInfo, error)
	UserInfoGet(studentId string) (*constant.UserResponse, error)
}
