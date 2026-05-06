package storageRepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d02-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

type Repository interface {
	GetLevelDetailByUserAndSubLessonId(userId string, subLessonId int) ([]constant.LevelWithDataEntity, error)
	GetInventoryByStudentId(studentId *string) (*constant.InventoryEntity, error)
	GetStudentIdFromUserId(userId string) (*string, error)
	GetStudentData(userId string) (*constant.StudentData, error)
	GetStudentDataDetail(studentId string) (*constant.StudentDataDetailEntity, error)
	GetListHomeWorkByUserData(subjectId *int, studentData constant.StudentData, userId string) ([]constant.HomeWorkListByUserDataEntity, error)
	GetLevelByHomeWorkTemplateId(hwTemplateId *int) ([]int, error)
	GetPassLevelIndexByUserIdAndHomeworkId(userId string, homeworkId int) (map[int][]int, error)
	GetLevelBySubLessonId(subLessonId int) ([]int, error)
	GetLevelBySubjectId(subjectId int) ([]int, error)
	GetAchivementByUserAndSubLessonId(userId string, subLessonId int) ([]constant.SpecialRewardWithDataEntity, error)
	GetAchivementByUserAndSubjectId(userId string, subjectId int) ([]constant.SpecialRewardWithDataEntity, error)

	//GetLeaderBoardAll(levelIds []int, startDate string, endDate string) ([]constant.LeaderBoardDataEntity, error)
	GetLeaderBoardAll(levelIds []int, startDate string, endDate string, pagination *helper.Pagination, userId string) ([]constant.LeaderBoardDataEntity, error)
	//GetLeaderBoardBySchoolAffiliationId(levelIds []int, schoolAffiliationId int, startDate string, endDate string) ([]constant.LeaderBoardDataEntity, error)
	GetLeaderBoardBySchoolAffiliationId(levelIds []int, schoolAffiliationId int, startDate string, endDate string, pagination *helper.Pagination, userId string) ([]constant.LeaderBoardDataEntity, error)
	//GetLeaderBoardBySchoolId(levelIds []int, schoolId int, startDate string, endDate string) ([]constant.LeaderBoardDataEntity, error)
	GetLeaderBoardBySchoolId(levelIds []int, schoolId int, startDate string, endDate string, pagination *helper.Pagination, userId string) ([]constant.LeaderBoardDataEntity, error)
	//GetLeaderBoardByClassId(levelIds []int, classId int, startDate string, endDate string) ([]constant.LeaderBoardDataEntity, error)
	GetLeaderBoardByClassId(levelIds []int, classId int, startDate string, endDate string, pagination *helper.Pagination, userId string) ([]constant.LeaderBoardDataEntity, error)
	GetRewardByLevelId(levelId int) ([]constant.GameReward, error)
	GetReward(levelId int) ([]constant.GameRewardEntity, error)
	LevelCaseGetLastPlay(subLessonId, lessonId, subjectId int, studentId string) (*constant.LastPlayLevelEntity, error)
}
