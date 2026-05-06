package service

import (
	"bytes"
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-07-teacher-student-group-research-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/middleware"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"net/http"
	"strconv"
)

// ==================== Endpoint ==========================

func (api *ApiStruct) GetDDRScoreResultCsv(ctx *fiber.Ctx) (err error) {

	in, err := helper.ParseAndValidateRequest(ctx, &constant.GetDDRParams{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(ctx, err)
	}

	teacherId, ok := ctx.Locals(middleware.LOCALS_KEY_SUBJECT_ID).(string)
	if !ok {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	studyGroupStr := ctx.Params("studyGroupId")
	if studyGroupStr == "" {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	studyGroupId, err := strconv.Atoi(studyGroupStr)
	if err != nil {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	data, err := api.Service.GetDDRScoreResultCsv(teacherId, studyGroupId, in)
	if err != nil {
		var httpError helper.HttpError
		if errors.As(err, &httpError) {
			return helper.RespondHttpError(ctx, httpError)
		}
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(data)
	ctx.Attachment("research_ddr_score.csv")

	return ctx.SendStream(reader)
}

// ==================== Service ==========================

func (service serviceStruct) GetDDRScoreResultCsv(teacherId string, studyGroupId int, in *constant.GetDDRParams) (constant.GetDDRScoreResultCsv, error) {

	//Check Permission and Get StudentIds
	studentIds, err := service.storage.GetStudentIdsByStudentGroupIdAndTeacherId(studyGroupId, teacherId)
	if err != nil {
		return nil, errors.New(fmt.Sprintf("get study group from id error: %s", err.Error()))
	}

	studentQuestionEnts, err := service.storage.GetQuestionStatByLevelIDAndStudentIds(in.LevelId, studentIds, in.Search)
	if err != nil {
		return nil, err
	}

	studentStat := make([]constant.StudentQuestionStat, 0)
	for _, ent := range studentQuestionEnts {
		studentStat = append(studentStat, constant.StudentQuestionStat{
			StudentID:        ent.StudentID,
			StudentTitle:     ent.StudentTitle,
			StudentFirstName: ent.StudentFirstname,
			StudentLastName:  ent.StudentLastname,
			QuestionData:     ent.Questions,
			ScoreSum:         ent.ScoreSum,
		})
	}

	header := constant.DDRScoreResultStatCsvHeader
	if studentQuestionEnts != nil && len(studentQuestionEnts) > 0 {
		for _, question := range studentQuestionEnts[0].Questions {
			header = append(header, fmt.Sprintf("%d", question.QuestionIndex))
		}

		header = append(header, "sum")
	}

	csvMapped := [][]string{header}
	for i, ent := range studentQuestionEnts {

		content := []string{
			fmt.Sprintf("%d", i+1),
			ent.StudentID,
			ent.StudentTitle,
			ent.StudentFirstname,
			ent.StudentLastname,
		}

		for _, question := range ent.Questions {
			content = append(content, fmt.Sprintf("%d", question.Score))
		}

		content = append(content, fmt.Sprintf("%d", ent.ScoreSum))

		csvMapped = append(csvMapped, content)
	}

	return helper.WriteCSV(csvMapped, nil)
}
