package storagerepository

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)

	CreateLevelPlayLog(tx *sqlx.Tx, entity *constant.LevelPlayLogEntity) error
	CreateQuestionPlayLog(tx *sqlx.Tx, entity *constant.QuestionPlayLogEntity) error
	CreateStudentInputAnswers(tx *sqlx.Tx, entities []constant.StudentInputAnswerEntity) error
	CreateStudentMultipleChoiceAnswers(tx *sqlx.Tx, entities []constant.StudentMultipleChoiceAnswerEntity) error
	CreateStudentSortAnswers(tx *sqlx.Tx, entities []constant.StudentSortAnswerEntity) error
	CreateStudentGroupAnswers(tx *sqlx.Tx, entities []constant.StudentGroupAnswerEntity) error
	CreateStudentPlaceholderAnswers(tx *sqlx.Tx, entities []constant.StudentPlaceholderAnswerEntity) error
	GetStudentCurrentClassId(studentId string) (*int, error)
	GetQuestionsFromLevelId(levelId int) ([]constant.QuestionEntity, error)

	GetHomeworkTemplateLevels(homeworkId int) (entities []constant.HomeworkTemplateLevel, err error)
	GetHomeworkSubmissions(studentId string, homeworkId int) (entities []constant.HomeworkSubmissionJoinLevelPlayLog, err error)
	CreateHomeworkSubmission(tx *sqlx.Tx, entity *constant.HomeworkSubmission) (err error)

	CheckLevelPassed(levelId int, userId string) (*bool, *int, error)
	GetLevelSpecialReward(levelId int) ([]constant.SpecialReward, error)
	GetLevelReward(levelId int, star int, maxStar int) ([]constant.Reward, error)
	InventoryAddSpecialReward(tx *sqlx.Tx, userId string, specialRewards []constant.SpecialReward) error
	InventoryAddReward(tx *sqlx.Tx, userId string, rewards []constant.Reward) error
	RewardLogCreate(tx *sqlx.Tx, logs []constant.RewardLog) error
}
