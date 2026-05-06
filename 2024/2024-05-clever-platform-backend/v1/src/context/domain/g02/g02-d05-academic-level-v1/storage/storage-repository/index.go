package storageRepository

import (
	"time"

	userConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/jmoiron/sqlx"
)

type Repository interface {
	BeginTx() (*sqlx.Tx, error)
	CurriculumGroupCaseListContentCreator(curriculumGroupId int) ([]userConstant.UserEntity, error)
	LessonCaseListBySubject(subjectId int) ([]constant.LessonDataEntity, error)
	SubLessonCaseListByLesson(lessonId int) ([]constant.SubLessonDataEntity, error)
	TagCaseListBySubject(subjectId int) ([]constant.TagGroupEntity, error)

	SubjectCaseGetCurriculumGroupId(subjectId int) (*int, error)
	LessonCaseGetCurriculumGroupId(lessonId int) (*int, error)
	SubLessonCaseGetCurriculumGroupId(subLessonId int) (*int, error)
	SubLessonCaseGetLastLevelIndex(subLessonId int) (*int, error)
	LevelCaseGetLevelToShift(tx *sqlx.Tx, subLessonId int, targetLevelIndex int) ([]constant.LevelEntity, error)
	SubCriteriaCaseListByCurriculumGroup(curriculumGroupId int) ([]constant.SubCriteriaDataEntity, error)
	LevelCaseGetCurriculumGroupId(levelId int) (*int, error)
	LevelCaseGetLastQuestionIndex(levelId int) (*int, error)
	QuestionCaseGetCurriculumGroupId(questionId int) (*int, error)
	SubCriteriaTopicCaseGetByShortName(curriculumGroupId int, shortName string) (*constant.SubCriteriaTopicEntity, error)
	CriteriaCaseGetByShortName(curriculumGroupid int, shortName string) (*constant.CriteriaEntity, error)
	IndicatorCaseGetByShortName(curriculumGroupId int, shortName string) (*constant.IndicatorEntity, error)
	SubCriteriaTopicCaseDeleteByLevelId(tx *sqlx.Tx, levelIds []int) error
	TagCaseDeleteByLevelId(tx *sqlx.Tx, levelIds []int) error
	SubCriteriaTopicCheckIfExists(subCriteriaShortName string, index, curriculumGroupId int) (int, error)
	LevelSubCriteriaTopicCreate(tx *sqlx.Tx, subCriteriaTopicId, levelId int) error
	SubLessonCaseGetSubjectId(subLessonId int) (*int, error)
	TagCheckIfExists(tagId, tagGroupIndex, subjectId int) (*bool, error)
	LevelTagCreate(tx *sqlx.Tx, tagId, levelId int) error

	LevelCreate(tx *sqlx.Tx, level *constant.LevelEntity) (*constant.LevelEntity, error)
	LevelGet(levelId int) (*constant.LevelGetDataEntity, error)
	LevelUpdate(tx *sqlx.Tx, level *constant.LevelUpdateEntity) (*constant.LevelEntity, error)
	LevelDelete(tx *sqlx.Tx, levelIds []int) error
	LevelList(subLessonId int, filter *constant.LevelFilter, pagination *helper.Pagination, noCriteria bool) ([]constant.LevelListDataEntity, error)
	LevelCaseSort(tx *sqlx.Tx, levels map[int]int, subLessonId int) error
	LevelCaseCheckIfExists(subLessonId int, index int) (*bool, error)
	LevelCaseGetStandard(levelId int) (*constant.LevelStandardEntity, error)

	SavedTextCreate(tx *sqlx.Tx, savedText *constant.SavedTextEntity) (*constant.SavedTextEntity, error)
	SavedTextGet(tx *sqlx.Tx, savedTextId int) (*constant.SavedTextEntity, error)
	SavedTextUpdate(tx *sqlx.Tx, savedText *constant.SavedTextEntity) (*constant.SavedTextEntity, error)
	SavedTextList(curriculumGroupId int, filter *constant.SavedTextFilter, pagination *helper.Pagination) ([]constant.SavedTextListDataEntity, error)
	SavedTextCaseGetByText(tx *sqlx.Tx, language string, text string) (*constant.SavedTextEntity, error)
	SavedTextCaseGetByGroupLanguage(tx *sqlx.Tx, groupId string, language string) (*constant.SavedTextEntity, error)
	SavedTextCaseGetByGroupId(groupId string) (*constant.SavedTextDataEntity, error)
	SavedTextCaseDeleteSpeech(tx *sqlx.Tx, savedText *constant.SavedTextEntity) (*constant.SavedTextEntity, error)

	QuestionCreate(tx *sqlx.Tx, question *constant.QuestionEntity) (*constant.QuestionEntity, error)
	QuestionGet(questionId int) (*constant.QuestionEntity, error)
	QuestionUpdate(tx *sqlx.Tx, question *constant.QuestionEntity) (*constant.QuestionEntity, error)
	QuestionDelete(tx *sqlx.Tx, questionIds ...int) error
	QuestionCaseListByLevelId(levelId int, pagination *helper.Pagination) ([]constant.QuestionEntity, error)
	QuestionCaseSort(tx *sqlx.Tx, questions map[int]int, levelId int) error
	QuestionCaseGetQuestionToShift(levelId int,
		targetQuestionIndex int) ([]constant.QuestionEntity, error)

	QuestionTextCreate(tx *sqlx.Tx, questionText *constant.QuestionTextEntity) (*constant.QuestionTextEntity, error)
	QuestionTextCaseGetByType(questionId int, textType string, isMainDescription ...*bool) (*constant.QuestionTextDataEntity, error)
	QuestionTextCaseDeleteByType(tx *sqlx.Tx, questionText *constant.QuestionTextEntity) ([]string, error)
	QuestionTextCaseDeleteByQuestionId(tx *sqlx.Tx, questionIds ...int) ([]string, error)

	QuestionTextTranslationCreate(tx *sqlx.Tx, questionTextTranslation *constant.QuestionTextTranslationEntity) (*constant.QuestionTextTranslationEntity, error)

	// multiple choice
	QuestionMultipleChoiceCreate(tx *sqlx.Tx, questionMultipleChoice *constant.QuestionMultipleChoiceEntity) (*constant.QuestionMultipleChoiceEntity, error)
	QuestionMultipleChoiceGet(questionMultipleChoiceId int) (*constant.QuestionMultipleChoiceEntity, error)
	QuestionMultipleChoiceUpdate(tx *sqlx.Tx, questionMultipleChoice *constant.QuestionMultipleChoiceEntity) (*constant.QuestionMultipleChoiceEntity, error)
	QuestionMultipleChoiceDelete(tx *sqlx.Tx, questionIds ...int) error

	QuestionMultipleChoiceTextChoiceCreate(tx *sqlx.Tx, questionMultipleChoiceTextChoice *constant.QuestionMultipleChoiceTextChoiceEntity) (*constant.QuestionMultipleChoiceTextChoiceEntity, error)
	QuestionMultipleChoiceTextChoiceCaseDeleteAll(tx *sqlx.Tx, questionIds ...int) error
	QuestionMultipleChoiceTextChoiceCaseListByQuestion(questionId int) ([]constant.QuestionMultipleChoiceTextChoiceDataEntity, error)

	QuestionMultipleChoiceImageChoiceCreate(tx *sqlx.Tx, questionMultipleChoiceImageChoice *constant.QuestionMultipleChoiceImageChoiceEntity) (*constant.QuestionMultipleChoiceImageChoiceEntity, error)
	QuestionMultipleChoiceImageChoiceCaseDeleteAll(tx *sqlx.Tx, questionMultipleChoiceIds ...int) ([]string, error)
	QuestionMultipleChoiceImageChoiceCaseListByQuestion(questionId int) ([]constant.QuestionMultipleChoiceImageChoiceEntity, error)

	// sort
	QuestionSortCreate(tx *sqlx.Tx, _ *constant.QuestionSortEntity) (*constant.QuestionSortEntity, error)
	QuestionSortGet(questionSortId int) (*constant.QuestionSortEntity, error)
	QuestionSortUpdate(tx *sqlx.Tx, questionSort *constant.QuestionSortEntity) (*constant.QuestionSortEntity, error)
	QuestionSortDelete(tx *sqlx.Tx, questionIds ...int) error

	QuestionSortTextChoiceCreate(tx *sqlx.Tx, questionSortTextChoice *constant.QuestionSortTextChoiceEntity) (*constant.QuestionSortTextChoiceEntity, error)
	QuestionSortTextChoiceCaseDeleteByQuestionId(tx *sqlx.Tx, questionIds ...int) error

	QuestionSortTextChoiceCaseListByQuestion(questionId int) ([]constant.QuestionSortTextChoiceDataEntity, error)

	QuestionSortAnswerCreate(tx *sqlx.Tx, questionSortAnswer *constant.QuestionSortAnswerEntity) (*constant.QuestionSortAnswerEntity, error)
	QuestionSortAnswerCaseDeleteByQuestionId(tx *sqlx.Tx, questionSortIds ...int) error

	//group
	QuestionGroupCreate(tx *sqlx.Tx, questionGroup *constant.QuestionGroupEntity) (*constant.QuestionGroupEntity, error)
	QuestionGroupGet(questionGroupId int) (*constant.QuestionGroupEntity, error)
	QuestionGroupUpdate(tx *sqlx.Tx, questionGroup *constant.QuestionGroupEntity) (*constant.QuestionGroupEntity, error)
	QuestionGroupDelete(tx *sqlx.Tx, questionIds ...int) error

	QuestionGroupGroupCreate(tx *sqlx.Tx, questionGroupGroup *constant.QuestionGroupGroupEntity) (*constant.QuestionGroupGroupEntity, error)
	QuestionGroupGroupCaseListByQuestion(tx *sqlx.Tx, questionId int) ([]constant.QuestionGroupGroupDataEntity, error)
	QuestionGroupGroupCaseDeleteByQuestionId(tx *sqlx.Tx, questionIds ...int) error

	QuestionGroupChoiceCreate(tx *sqlx.Tx, questionGroupChoice *constant.QuestionGroupChoiceEntity) (*constant.QuestionGroupChoiceEntity, error)
	QuestionGroupChoiceCaseDeleteByQuestionId(tx *sqlx.Tx, questionIds ...int) ([]string, error)
	QuestionGroupChoiceCaseListByQuestion(questionId int) ([]constant.QuestionGroupChoiceDataEntity, error)

	QuestionGroupGroupMemberCreate(tx *sqlx.Tx, questionGroupGroupMember *constant.QuestionGroupGroupMemberEntity) (*constant.QuestionGroupGroupMemberEntity, error)
	QuestionGroupGroupMemberCaseDeleteByQuestionGroupGroupId(tx *sqlx.Tx, questionGroupGroupId int) error
	QuestionGroupGroupMemberCaseDeleteByQuestionGroupChoiceId(tx *sqlx.Tx, questionGroupChoiceId int) error
	QuestionGroupGroupMemberCaseDeleteByQuestionId(tx *sqlx.Tx, questionIds ...int) error

	// placeholder
	QuestionPlaceholderCreate(tx *sqlx.Tx, questionPlaceholder *constant.QuestionPlaceholderEntity) (*constant.QuestionPlaceholderEntity, error)
	QuestionPlaceholderGet(questionId int) (*constant.QuestionPlaceholderEntity, error)
	QuestionPlaceholderUpdate(tx *sqlx.Tx, questionPlaceholder *constant.QuestionPlaceholderEntity) (*constant.QuestionPlaceholderEntity, error)
	QuestionPlaceholderDelete(tx *sqlx.Tx, questionIds ...int) error

	QuestionPlaceholderTextChoiceCreate(tx *sqlx.Tx, questionPlaceholderTextChoice *constant.QuestionPlaceholderTextChoiceEntity) (*constant.QuestionPlaceholderTextChoiceEntity, error)
	QuestionPlaceholderTextChoiceCaseDeleteByQuestion(tx *sqlx.Tx, questionIds ...int) error
	QuestionPlaceholderChoiceCaseListByQuestion(questionId int) ([]constant.QuestionPlaceholderTextChoiceEntity, error)

	QuestionPlaceholderDescriptionCaseListByQuestion(questionId int) ([]constant.QuestionPlaceholderDescriptionEntity, error)
	QuestionPlaceholderCaseDeleteDescription(tx *sqlx.Tx, questionIds ...int) ([]string, error)

	QuestionPlaceholderAnswerCreate(tx *sqlx.Tx, questionPlaceholderAnswer *constant.QuestionPlaceholderAnswerEntity) (*constant.QuestionPlaceholderAnswerEntity, error)
	QuestionPlaceholderAnswerCaseDeleteByQuestionId(tx *sqlx.Tx, questionId int) error

	QuestionPlaceholderAnswerTextCreate(tx *sqlx.Tx, questionPlaceholderAnswerText *constant.QuestionPlaceholderAnswerTextEntity) (*constant.QuestionPlaceholderAnswerTextEntity, error)

	// input
	QuestionInputCreate(tx *sqlx.Tx, questionInput *constant.QuestionInputEntity) (*constant.QuestionInputEntity, error)
	QuestionInputGet(questionId int) (*constant.QuestionInputEntity, error)
	QuestionInputUpdate(tx *sqlx.Tx, questionInput *constant.QuestionInputEntity) (*constant.QuestionInputEntity, error)
	QuestionInputDelete(tx *sqlx.Tx, questionIds ...int) error

	QuestionInputAnswerCreate(tx *sqlx.Tx, questionInputAnswer *constant.QuestionInputAnswerEntity) (*constant.QuestionInputAnswerEntity, error)

	QuestionInputAnswerTextCreate(tx *sqlx.Tx, questionInputAnswerText *constant.QuestionInputAnswerTextEntity) (*constant.QuestionInputAnswerTextEntity, error)

	QuestionInputCaseListDescription(questionId int) ([]constant.QuestionInputDescriptionEntity, error)
	QuestionInputCaseDeleteDescription(tx *sqlx.Tx, questionIds ...int) ([]string, error)

	// lesson
	LessonGet(lessonId int) (*constant.LessonEntity, error)

	// sub lesson
	SubLessonCreate(tx *sqlx.Tx, subLesson *constant.SubLessonEntity) (*constant.SubLessonEntity, error)
	SubLessonGet(subLessonId int) (*constant.SubLessonEntity, error)
	SubLessonCaseGetByName(tx *sqlx.Tx, lessonId int, name string) (*int, error)
	SubLessonCaseGetStandard(subLessonId int) (*constant.SubLessonStandardEntity, error)

	// auth
	AuthEmailPasswordGet(userId string) (*constant.AuthEmailPasswordEntity, error)

	// subject language
	LevelCaseGetSubjectLanguage(levelId int) (*string, error)
	QuestionCaseGetSubjectLanguage(questionId int) (*string, error)

	StudentMultipleChoiceAnswerGet(questionPlayLogId int) (*constant.StudentMultipleChoiceAnswerEntity, error)
	StudentGroupAnswerGet(questionPlayLogId int) ([]constant.StudentGroupAnswerEntity, error)
	StudentSortAnswerGet(questionPlayLogId int) ([]constant.StudentSortAnswerEntity, error)
	StudentPlaceholderAnswerGet(questionPlayLogId int) ([]constant.StudentPlaceholderAnswerEntity, error)
	StudentInputAnswerGet(questionPlayLogId int) ([]constant.StudentInputAnswerEntity, error)
	QuestionPlayLogList(levelPlayLogId int) ([]constant.QuestionPlayLogEntity, error)
	LevelListByIndicatorId(indicatorId int, subLessonIds []int) ([]constant.IndicatorLevelsEntity, error)

	LevelSpecialRewardDelete(tx *sqlx.Tx, levelIds []int) error
	LevelCaseAutoSort(tx *sqlx.Tx, subLessonId int) error

	SubLessonIdListByLesson(lessonId int) ([]int, error)
	SubLessonTimeListByLesson(lessonId int) ([]constant.SubLessonTime, error)
	SubLessonFileStatusUpdate(subLessonId int, status bool, userId string, updatedAt *time.Time) error
	//SubLessonFileStatusUpdate(subLessonId int, status bool, userId string) error
	SubLessonFileStatusTxUpdate(tx *sqlx.Tx, subLessonIds []int, status bool, userId string) error
	SavedTextCaseGetSubLessonId(tx *sqlx.Tx, savedTextGroupId string) ([]int, error)
	LessonCaseListSubLesson(tx *sqlx.Tx, lessonIds []int) ([]int, error)
	LessonLevelCaseBulkEdit(tx *sqlx.Tx, lessonIds []int, status, userId string) error
	LevelCaseBulkUpdate(tx *sqlx.Tx, levels map[int]constant.LevelUpdateEntity) error
	SubLessonCaseGetMeta(subLessonId int) (*constant.SubLessonMetaEntity, error)

	QuestionLearnCreate(tx *sqlx.Tx, questionLearn *constant.QuestionLearnEntity) (*constant.QuestionLearnEntity, error)
	QuestionLearnGet(questionId int) (*constant.QuestionLearnEntity, error)
	QuestionLearnUpdate(tx *sqlx.Tx, questionLearn *constant.QuestionLearnEntity) (*constant.QuestionLearnEntity, error)
	QuestionLearnDelete(tx *sqlx.Tx, questionIds ...int) error

	SubLessonCaseGetSubjectMeta(subLessonId int) (*constant2.SubjectMetaEntity, error)
	LessonCaseGetSubLessonCount(lessonId int) (int, error)
}
