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

func (api *ApiStruct) GetTTestPairModelStatCsv(ctx *fiber.Ctx) (err error) {

	in, err := helper.ParseAndValidateRequest(ctx, &constant.GetTTestPairModelStatListAndCsvParams{}, helper.ParseOptions{Query: true})
	if err != nil {
		return helper.RespondHttpError(ctx, err)
	}

	err = in.ParseDateTimeFilter(constant.DateFormat)
	if err != nil {
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusBadRequest, nil))
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

	data, err := api.Service.GetTTestPairModelStatCsv(teacherId, studyGroupId, in)
	if err != nil {
		var httpError helper.HttpError
		if errors.As(err, &httpError) {
			return helper.RespondHttpError(ctx, httpError)
		}
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	reader := bytes.NewReader(data)
	ctx.Attachment("t_test_pair_model_stat_study_group.csv")

	return ctx.SendStream(reader)
}

// ==================== Service ==========================

func (service serviceStruct) GetTTestPairModelStatCsv(teacherId string, studyGroupId int, in *constant.GetTTestPairModelStatListAndCsvParams) (constant.GetTTestPairModelStatCsvResult, error) {

	studentIds, err := service.storage.GetStudentIdsByStudentGroupIdAndTeacherId(studyGroupId, teacherId)
	if err != nil {
		return nil, errors.New(fmt.Sprintf("get study group from id error: %s", err.Error()))
	}

	ents, err := service.storage.GetTTestPairModelStatListByParams(studentIds, in)
	if err != nil {
		return nil, err
	}

	csvMapped := [][]string{constant.GroupTTestPairModelStatCsvHeader}
	for i, ent := range ents {
		csvMapped = append(csvMapped, []string{
			fmt.Sprintf("%d", i+1),
			ent.StudentFullname,
			fmt.Sprintf("%d", helper.Deref(ent.PostTestScore)),
			fmt.Sprintf("%d", helper.Deref(ent.PreTestScore)),
		})
	}

	return helper.WriteCSV(csvMapped, nil)
}
