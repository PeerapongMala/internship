package service

import (
	"log"
	"net/http"
	"sort"
	"time"

	gradeFormConstant "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================
type EvaluationSheetGetRequest struct {
	EvaluationSheetId    int `params:"evaluationSheetId" validate:"required"`
	SubjectId            string
	IndicatorId          *int    `query:"indicator_id"`
	Version              *string `query:"version"`
	NoStudentLessonScore bool    `query:"no_student_lesson_score"`
}

// ==================== Response ==========================
type EvaluationSheetGetResponse struct {
	constant.StatusResponse
	Data *EvaluationSheetGetData `json:"data"`
}

type EvaluationSheetGetData struct {
	*constant.EvaluationDataEntry
	FormID                *int                                                        `json:"form_id,omitempty"`
	SheetData             *constant.EvaluationSheetDetail                             `json:"sheet_data,omitempty"`
	SubjectData           *gradeFormConstant.GradeEvaluationFormSubjectWithNameEntity `json:"subject_data,omitempty"`
	StudentList           []EvaluationSheetGetStudentData                             `json:"student_list,omitempty"`
	StudentLessonScore    []constant.StudentScore                                     `json:"student_lesson_score"`
	AcademicYearStartDate *time.Time                                                  `json:"academic_year_start_date,omitempty"`
	AcademicYearEndDate   *time.Time                                                  `json:"academic_year_end_date,omitempty"`
}

type EvaluationSheetGetStudentData struct {
	ID            int    `json:"id" db:"id"`
	No            int    `json:"no" db:"no"`
	CitizenNo     string `json:"citizen_no" db:"citizen_no"`
	StudentID     string `json:"student_id" db:"student_id"`
	Title         string `json:"title" db:"title"`
	ThaiFirstName string `json:"thai_first_name" db:"thai_first_name"`
	ThaiLastName  string `json:"thai_last_name" db:"thai_last_name"`
	EngFirstName  string `json:"eng_first_name" db:"eng_first_name"`
	EngLastName   string `json:"eng_last_name" db:"eng_last_name"`
	IsOut         *bool  `json:"is_out" db:"is_out"`
}

// ==================== Endpoint ==========================

func (api *APIStruct) EvaluationSheetGet(context *fiber.Ctx) error {

	request, err := helper.ParseAndValidateRequest(context, &EvaluationSheetGetRequest{}, helper.ParseOptions{Params: true, Query: true})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusBadRequest, nil))
	}

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	request.SubjectId = subjectId
	result, err := api.Service.EvaluationSheetGet(request)
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(EvaluationSheetGetResponse{
		StatusResponse: constant.StatusResponse{
			StatusCode: http.StatusOK,
			Message:    "Success",
		},
		Data: result,
	})
}

// ==================== Service ==========================
func (service *serviceStruct) EvaluationSheetGet(in *EvaluationSheetGetRequest) (*EvaluationSheetGetData, error) {
	students, err := service.gradeDataEntryStorage.GetListEvaluationStudentBySheetID(in.EvaluationSheetId)
	if err != nil {
		return nil, err
	}

	data, err := service.gradeDataEntryStorage.GetEvaluationDataBySheetId(in.EvaluationSheetId, helper.Deref(in.Version))
	if err != nil {
		return nil, err
	}

	sheet, err := service.gradeDataEntryStorage.EvaluationSheetGetDetailById(data.SheetID)
	if err != nil {
		return nil, err
	}

	if sheet.EvaluationFormSubjectID != nil && sheet.EvaluationFormGeneralEvaluationID == nil {
		generalSheets, err := service.gradeDataEntryStorage.GeneralSheetListBySubject(helper.Deref(sheet.FormID), helper.Deref(sheet.EvaluationFormSubjectID))
		if err != nil {
			return nil, err
		}
		data.SheetIds = generalSheets
	}

	//_, err = service.CalculateScore(&CalculateScoreInput{
	//	SheetId:  in.EvaluationSheetId,
	//	Students: students,
	//	SchoolId: sheet.SchoolID,
	//})

	if in.IndicatorId != nil {
		calculateScoreOutput, err := service.CalculateScore(&CalculateScoreInput{
			SheetId:     in.EvaluationSheetId,
			Students:    students,
			SchoolId:    sheet.SchoolID,
			IndicatorId: helper.Deref(in.IndicatorId),
		})
		if err != nil {
			return nil, err
		}

		result := EvaluationSheetGetData{
			StudentLessonScore: calculateScoreOutput.StudentScores,
		}
		return &result, nil
	}

	studentLessonScore := []constant.StudentScore{}
	if !in.NoStudentLessonScore && sheet.EvaluationFormSubjectID != nil {
		calculateScoreOutput, err := service.CalculateScore(&CalculateScoreInput{
			SheetId:     in.EvaluationSheetId,
			Students:    students,
			SchoolId:    sheet.SchoolID,
			IndicatorId: helper.Deref(in.IndicatorId),
		})
		if err != nil {
			return nil, err
		}
		studentLessonScore = calculateScoreOutput.StudentScores
	}

	subjectData, err := service.gradeFormStorage.GradeEvaluationSubjectGetBySheetId(in.EvaluationSheetId, true)
	if err != nil {
		return nil, err
	}

	sort.SliceStable(students, func(i, j int) bool {
		return helper.HandleStringPointerField(students[i].StudentID) <= helper.HandleStringPointerField(students[j].StudentID)
	})

	result := EvaluationSheetGetData{
		EvaluationDataEntry: data,
		FormID:              sheet.FormID,
		SheetData:           sheet,
		SubjectData:         subjectData,
		StudentLessonScore:  studentLessonScore,
	}
	result.StudentList = []EvaluationSheetGetStudentData{}
	for i, v := range students {
		if v.IsOut == nil {
			v.IsOut = helper.ToPtr(false)
		}
		result.StudentList = append(result.StudentList, EvaluationSheetGetStudentData{
			ID:            v.ID,
			No:            i + 1,
			CitizenNo:     helper.HandleStringPointerField(v.CitizenNo),
			StudentID:     helper.HandleStringPointerField(v.StudentID),
			Title:         helper.HandleStringPointerField(v.Title),
			ThaiFirstName: helper.HandleStringPointerField(v.ThaiFirstName),
			ThaiLastName:  helper.HandleStringPointerField(v.ThaiLastName),
			EngFirstName:  helper.HandleStringPointerField(v.EngFirstName),
			EngLastName:   helper.HandleStringPointerField(v.EngLastName),
			IsOut:         v.IsOut,
		})
	}

	academicYearRange, err := service.gradeDataEntryStorage.AcademicYearRangeGet(sheet.SchoolID, *sheet.AcademicYear)
	if err != nil {
		return nil, err
	}
	result.AcademicYearStartDate = academicYearRange.StartDate
	result.AcademicYearEndDate = academicYearRange.EndDate

	return &result, nil
}
