package service

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
)

// ==================== Request ==========================

// ==================== Response ==========================

type academicYearFilterResponse struct {
	StatusCode int                  `json:"status_code"`
	Pagination helper.Pagination    `json:"_pagination"`
	Data       []academicYearFilter `json:"data"`
	Message    string               `json:"message"`
}

type academicYearFilter struct {
	AcademicYear int       `json:"academic_year"`
	StartDate    time.Time `json:"start_date"`
	EndDate      time.Time `json:"end_date"`
}

// ==================== Endpoint ==========================

func (api *apiStruct) ListAcademicYearsFilter(context *fiber.Ctx) (err error) {
	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}
	pagination := helper.PaginationNew(context)
	academicYearFilters, err := api.service.ListAcademicYearFilters(&listAcademicYearFiltersInput{
		TeacherId:  subjectId,
		Pagination: pagination,
	})
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, err)
	}
	return context.Status(http.StatusOK).JSON(academicYearFilterResponse{
		StatusCode: http.StatusOK,
		Pagination: *pagination,
		Data:       academicYearFilters,
		Message:    "Data retrieved",
	})
}

// ==================== Service ==========================

type listAcademicYearFiltersInput struct {
	TeacherId  string
	Pagination *helper.Pagination
}

func (service *serviceStruct) ListAcademicYearFilters(in *listAcademicYearFiltersInput) (academicYearFilters []academicYearFilter, err error) {
	academicYearFilters = []academicYearFilter{}

	// get school id
	schoolId, err := service.storage.GetTeacherSchoolId(in.TeacherId)
	if err != nil {
		err = fmt.Errorf("get teacher school id error: %s", err.Error())
		return
	}
	if schoolId == nil {
		err = errors.New("school id is null")
		return
	}

	// get school academic year
	schoolAcademicYears, err := service.storage.GetSchoolAcademicYears(*schoolId, in.Pagination)
	if err != nil {
		err = fmt.Errorf("get school academic years error: %s", err.Error())
		return
	}

	for _, say := range schoolAcademicYears {
		year, convertErr := strconv.Atoi(say.Name)
		if convertErr != nil {
			err = fmt.Errorf("convert academic years error: %s", convertErr.Error())
			return
		}
		academicYearFilters = append(academicYearFilters, academicYearFilter{
			AcademicYear: year,
			StartDate:    say.StartDate,
			EndDate:      say.EndDate,
		})
	}
	// // get class ids
	// classIds, err := service.storage.GetTeacherClassIds(*schoolId, in.TeacherId, nil)
	// if err != nil {
	// 	err = fmt.Errorf("get teacher class ids error: %s", err.Error())
	// 	return
	// }
	// if len(classIds) == 0 {
	// 	return
	// }

	// // get classes
	// classes, err := service.storage.GetClasses(classIds, nil, in.Pagination)
	// if err != nil {
	// 	err = fmt.Errorf("get classes error: %s", err.Error())
	// 	return
	// }
	// if len(classIds) == 0 {
	// 	return
	// }

	// // TODO: check unique
	// for _, c := range classes {
	// 	academicYearFilters = append(academicYearFilters, academicYearFilter{
	// 		AcademicYear: c.AcademicYear,
	// 	})
	// }
	return
}

// ==================== Helper ==========================
