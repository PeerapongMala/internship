package service

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-07-teacher-student-group-research-v1/constant"

type ServiceInterface interface {
	GetTTestPairModelStatList(teacherId string, studyGroupId int, in *constant.GetTTestPairModelStatListAndCsvParams) (constant.GetTTestPairModelStatListResult, error)
	GetTTestPairModelStatCsv(teacherId string, studyGroupId int, in *constant.GetTTestPairModelStatListAndCsvParams) (constant.GetTTestPairModelStatCsvResult, error)
	GetTTestPairResult(teacherId string, studyGroupId int, in *constant.GetTTestPairModelStatListAndCsvParams) (constant.GetTTestPairResultResult, error)
	GetDDRScoreResult(teacherId string, studyGroupId int, in *constant.GetDDRParams) (constant.GetDDRScoreResult, error)
	GetDDRSummaryResult(teacherId string, studyGroupId int, in *constant.GetDDRParams) (constant.GetDDRSummaryResult, error)
	GetPrePostTestLevelsParams(subLessonId int) ([]constant.LevelParamsEntity, error)
	GetDDRScoreResultCsv(teacherId string, studyGroupId int, in *constant.GetDDRParams) (constant.GetDDRScoreResultCsv, error)
	GetDDRSummaryResultCsv(teacherId string, studyGroupId int, in *constant.GetDDRParams) (constant.GetDDRSummaryResultCsv, error)
}
