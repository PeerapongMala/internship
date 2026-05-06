package service

import (
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

func (api *ApiStruct) GetTTestPairModelStatList(ctx *fiber.Ctx) (err error) {

	in, err := helper.ParseAndValidateRequest(ctx, &constant.GetTTestPairModelStatListAndCsvParams{}, helper.ParseOptions{Query: true})
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

	result, err := api.Service.GetTTestPairModelStatList(teacherId, studyGroupId, in)
	if err != nil {
		var httpError helper.HttpError
		if errors.As(err, &httpError) {
			return helper.RespondHttpError(ctx, httpError)
		}
		return helper.RespondHttpError(ctx, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	return ctx.Status(http.StatusOK).JSON(constant.Response{
		StatusCode: http.StatusOK,
		Data:       result,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

func (service serviceStruct) GetTTestPairModelStatList(teacherId string, studyGroupId int, in *constant.GetTTestPairModelStatListAndCsvParams) (constant.GetTTestPairModelStatListResult, error) {

	studentIds, err := service.storage.GetStudentIdsByStudentGroupIdAndTeacherId(studyGroupId, teacherId)
	if err != nil {
		return nil, errors.New(fmt.Sprintf("get study group from id error: %s", err.Error()))
	}

	in.StudyGroupId = studyGroupId
	ents, err := service.storage.GetTTestPairModelStatListByParams(studentIds, in)
	if err != nil {
		return nil, err
	}

	data := make([]constant.TTestPairModelStat, 0)
	for i, ent := range ents {
		data = append(data, constant.TTestPairModelStat{
			Index:            i + 1,
			StudentFullname:  ent.StudentFullname,
			StudentFirstName: ent.StudentFirstname,
			StudentLastName:  ent.StudentLastname,
			PreTestScore:     helper.Deref(ent.PreTestScore),
			PostTestScore:    helper.Deref(ent.PostTestScore),
		})
	}

	return data, nil
}
