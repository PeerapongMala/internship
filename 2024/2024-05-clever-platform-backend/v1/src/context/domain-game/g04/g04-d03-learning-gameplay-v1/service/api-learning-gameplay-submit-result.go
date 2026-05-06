package service

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g04/g04-d03-learning-gameplay-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type quizSubmitResultResponse struct {
	StatusCode int    `json:"status_code"`
	Message    string `json:"message"`
}

// ==================== Endpoint ==========================

func (api *apiStruct) QuizSubmitResult(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	levelId, err := context.ParamsInt("levelId")
	if err != nil {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}
	request, err := helper.ParseAndValidateRequest(context, &constant.QuizSubmitResultRequest{})
	if err != nil {
		return helper.RespondHttpError(context, err)

	}
	err = api.Service.QuizSubmitResult(&quizSubmitResultInput{
		SubjectId: subjectId,
		LevelId:   levelId,
		Request:   request,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(fiber.StatusOK).JSON(quizSubmitResultResponse{
		StatusCode: fiber.StatusOK,
		Message:    "Result submitted",
	})
}

// ==================== Service ==========================

type quizSubmitResultInput struct {
	SubjectId string
	LevelId   int
	Request   *constant.QuizSubmitResultRequest
}

func (service *serviceStruct) QuizSubmitResult(in *quizSubmitResultInput) (err error) {
	// get user class id
	classId, err := service.storage.GetStudentCurrentClassId(in.SubjectId)
	if err != nil {
		err = fmt.Errorf("get class_id from student_id error: %s", err.Error())
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	levelPlayLog := constant.LevelPlayLogEntity{
		ClassId:      classId,
		StudentId:    in.SubjectId,
		LevelId:      in.LevelId,
		HomeworkId:   in.Request.HomeworkId,
		PlayedAt:     in.Request.PlayedAt,
		Star:         in.Request.Star,
		TimeUsed:     in.Request.TimeUsed,
		AdminLoginAs: in.Request.AdminLoginAs,
	}

	isPassed, maxStars, err := service.storage.CheckLevelPassed(in.LevelId, in.SubjectId)
	if err != nil {
		return err
	}
	if in.Request.Star >= 1 {
		rewardLogs := []constant.RewardLog{}
		if in.Request.Star > *maxStars {
			rewards, err := service.storage.GetLevelReward(in.LevelId, in.Request.Star, *maxStars)
			if err != nil {
				return err
			}
			err = service.storage.InventoryAddReward(nil, in.SubjectId, rewards)
			if err != nil {
				return err
			}

			for _, reward := range rewards {
				rewardLog := constant.RewardLog{
					UserId:           &in.SubjectId,
					GoldCoinAmount:   reward.GoldCoins,
					ArcadeCoinAmount: reward.ArcadeCoins,
					Description:      "level",
					ReceivedAt:       time.Now().UTC(),
					CreatedAt:        time.Now().UTC(),
				}
				rewardLogs = append(rewardLogs, rewardLog)
			}
		}

		if !*isPassed {
			specialRewards, err := service.storage.GetLevelSpecialReward(in.LevelId)
			if err != nil {
				return err
			}
			err = service.storage.InventoryAddSpecialReward(nil, in.SubjectId, specialRewards)
			if err != nil {
				return err
			}

			for _, specialReward := range specialRewards {
				rewardLog := constant.RewardLog{
					UserId:      &in.SubjectId,
					ItemId:      specialReward.ItemId,
					ItemAmount:  specialReward.Amount,
					Description: fmt.Sprintf("level id %d", in.LevelId),
					ReceivedAt:  time.Now().UTC(),
					CreatedAt:   time.Now().UTC(),
				}
				rewardLogs = append(rewardLogs, rewardLog)
			}
		}

		err = service.storage.RewardLogCreate(nil, rewardLogs)
		if err != nil {
			return err
		}
	}

	err = service.storage.CreateLevelPlayLog(nil, &levelPlayLog)
	if err != nil {
		err = fmt.Errorf("create level play log error: %s", err.Error())
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	tx, err := service.storage.BeginTx()
	if err != nil {
		err = fmt.Errorf("start transcation error: %s", err.Error())
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	defer tx.Rollback()

	for _, question := range in.Request.Questions {
		questionPlayLog := constant.QuestionPlayLogEntity{
			LevelPlayLogId: levelPlayLog.Id,
			QuestionId:     question.QuestionId,
			IsCorrect:      question.IsCorrect,
			TimeUsed:       &question.TimeUsed,
		}
		err = service.storage.CreateQuestionPlayLog(tx, &questionPlayLog)
		if err != nil {
			err = fmt.Errorf("create question play log error: %s", err.Error())
			log.Printf("%+v", errors.WithStack(err))
			return err
		}

		studentInputAnswers := []constant.StudentInputAnswerEntity{}
		studentMultipleChoiceAnswers := []constant.StudentMultipleChoiceAnswerEntity{}
		studentSortAnswers := []constant.StudentSortAnswerEntity{}
		studentGroupAnswers := []constant.StudentGroupAnswerEntity{}
		studentPlaceholderAnswers := []constant.StudentPlaceholderAnswerEntity{}

		switch question.QuestionType {

		case constant.QuestionType(constant.Input):
			data := []constant.QuestionInputData{}
			err = castSliceMapStringToInterfaceToSliceOfStruct(question.Data, &data)
			if err != nil {
				return err
			}
			if len(data) <= 0 {
				break
			}
			for _, d := range data {
				i := d.ToStorageEntity()
				i.QuestionPlayLogId = questionPlayLog.Id
				studentInputAnswers = append(studentInputAnswers, i)
			}
			err = service.storage.CreateStudentInputAnswers(tx, studentInputAnswers)
			if err != nil {
				err = fmt.Errorf("create student input answer error: %s", err.Error())
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
		case constant.QuestionType(constant.MultipleChoice):
			data := []constant.QuestionMultipleChoiceData{}
			err = castSliceMapStringToInterfaceToSliceOfStruct(question.Data, &data)
			if err != nil {
				return err
			}
			if len(data) <= 0 {
				break
			}
			for _, d := range data {
				i := d.ToStorageEntity()
				i.QuestionPlayLogId = questionPlayLog.Id
				studentMultipleChoiceAnswers = append(studentMultipleChoiceAnswers, i)
			}
			err = service.storage.CreateStudentMultipleChoiceAnswers(tx, studentMultipleChoiceAnswers)
			if err != nil {
				err = fmt.Errorf("create student multiple choice answer error: %s", err.Error())
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
		case constant.QuestionType(constant.Sort):
			data := []constant.QuestionSortData{}
			err = castSliceMapStringToInterfaceToSliceOfStruct(question.Data, &data)
			if err != nil {
				return err
			}
			if len(data) <= 0 {
				break
			}
			for _, d := range data {
				i := d.ToStorageEntity()
				i.QuestionPlayLogId = questionPlayLog.Id
				studentSortAnswers = append(studentSortAnswers, i)
			}
			err = service.storage.CreateStudentSortAnswers(tx, studentSortAnswers)
			if err != nil {
				err = fmt.Errorf("create student sort answer error: %s", err.Error())
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
		case constant.QuestionType(constant.Group):
			data := []constant.QuestionGroupData{}
			err = castSliceMapStringToInterfaceToSliceOfStruct(question.Data, &data)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
			if len(data) <= 0 {
				break
			}
			for _, d := range data {
				i := d.ToStorageEntity()
				i.QuestionPlayLogId = questionPlayLog.Id
				studentGroupAnswers = append(studentGroupAnswers, i)
			}
			err = service.storage.CreateStudentGroupAnswers(tx, studentGroupAnswers)
			if err != nil {
				err = fmt.Errorf("create student group answer error: %s", err.Error())
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
		case constant.QuestionType(constant.Placeholder):
			data := []constant.QuestionPlaceholderData{}
			err = castSliceMapStringToInterfaceToSliceOfStruct(question.Data, &data)
			if err != nil {
				return err
			}
			if len(data) <= 0 {
				break
			}
			for _, d := range data {
				i := d.ToStorageEntity()
				i.QuestionPlayLogId = questionPlayLog.Id
				studentPlaceholderAnswers = append(studentPlaceholderAnswers, i)
			}
			err = service.storage.CreateStudentPlaceholderAnswers(tx, studentPlaceholderAnswers)
			if err != nil {
				err = fmt.Errorf("create student placeholder answer error: %s", err.Error())
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
		}
	}

	// step: insert homework submission
	if in.Request.HomeworkId != nil {
		// step: find homework template level
		homeworkTemplateLevels, findErr := service.storage.GetHomeworkTemplateLevels(*in.Request.HomeworkId)
		if findErr != nil {
			err = findErr
			return err
		}
		// step: prep
		mapLevelIdToIsSubmitted := make(map[int]bool)
		for _, htl := range homeworkTemplateLevels {
			mapLevelIdToIsSubmitted[htl.LevelId] = false
		}

		homeworkSubmissionJoinLevelPlayLogs, findErr := service.storage.GetHomeworkSubmissions(in.SubjectId, *in.Request.HomeworkId)
		if findErr != nil {
			err = findErr
			return err
		}

		// step: if homework submissions is empty insert with index 1
		homeworkSubmission := constant.HomeworkSubmission{
			LevelPlayLogId: levelPlayLog.Id,
		}
		if len(homeworkSubmissionJoinLevelPlayLogs) == 0 {
			homeworkSubmission.Index = 1
		} else { // step: else
			for _, llog := range homeworkSubmissionJoinLevelPlayLogs {
				mapLevelIdToIsSubmitted[llog.LevelId] = true
			}

			homeworkSubmission.Index = homeworkSubmissionJoinLevelPlayLogs[0].Index + 1
			for _, v := range mapLevelIdToIsSubmitted {
				if !v {
					homeworkSubmission.Index = homeworkSubmissionJoinLevelPlayLogs[0].Index
					break
				}
			}
		}
		err = service.storage.CreateHomeworkSubmission(tx, &homeworkSubmission)
		if err != nil {
			return err
		}
	}

	err = tx.Commit()
	if err != nil {
		err = fmt.Errorf("commit transaction error: %s", err.Error())
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	return err
}

// ==================== helper ==========================

func castSliceMapStringToInterfaceToSliceOfStruct[T any](in []map[string]interface{}, out *[]T) (err error) {
	bytes, err := json.Marshal(in)
	if err != nil {
		return err
	}
	err = json.Unmarshal(bytes, &out)
	if err != nil {
		return err
	}
	return err
}
