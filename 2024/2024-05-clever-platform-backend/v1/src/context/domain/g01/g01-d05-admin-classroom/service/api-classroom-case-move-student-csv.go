package service

import (
	"encoding/csv"
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d05-admin-classroom/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/gofiber/fiber/v2"
	"github.com/pkg/errors"
	"io"
	"log"
	"mime/multipart"
	"net/http"
	"slices"
	"sort"
	"strconv"
	"strings"
)

// ==================== Request ==========================

type ClassroomCaseMoveStudentCsvRequest struct {
	SchoolId  int                   `params:"schoolId" validate:"required"`
	ForceMove bool                  `form:"force_move"`
	CsvFile   *multipart.FileHeader `form:"csv_file"`
}

// ==================== Response ==========================

type ClassroomCaseMoveStudentCsvResponse struct {
	StatusCode int                 `json:"status_code"`
	Data       []constant.Conflict `json:"data"`
	Message    string              `json:"message"`
}

// ==================== Endpoint ==========================

func (api *APiStruct) ClassroomCaseMoveStudentCsv(context *fiber.Ctx) error {
	request, err := helper.ParseAndValidateRequest(context, &ClassroomCaseMoveStudentCsvRequest{}, helper.ParseOptions{
		Body:   true,
		Params: true,
	})
	if err != nil {
		return helper.RespondHttpError(context, err)
	}

	csvFile, err := context.FormFile("csv_file")
	if err != nil {
		return helper.RespondHttpError(context, err)
	}
	request.CsvFile = csvFile

	subjectId, ok := context.Locals("subjectId").(string)
	if !ok {
		log.Printf("%+v", errors.WithStack(err))
		return helper.RespondHttpError(context, helper.NewHttpError(http.StatusInternalServerError, nil))
	}

	classroomCaseMoveStudentCsvOutput, err := api.Service.ClassroomCaseMoveStudentCsv(&ClassroomCaseMoveStudentCsvInput{
		SubjectId:                          subjectId,
		ClassroomCaseMoveStudentCsvRequest: request,
	})
	if err != nil {
		if classroomCaseMoveStudentCsvOutput != nil {
			return context.Status(http.StatusConflict).JSON(ClassroomCaseMoveStudentCsvResponse{
				StatusCode: http.StatusConflict,
				Data:       classroomCaseMoveStudentCsvOutput.Conflicts,
				Message:    "Conflicts",
			})
		}
		return helper.RespondHttpError(context, err)
	}

	return context.Status(http.StatusOK).JSON(ClassroomCaseMoveStudentCsvResponse{
		StatusCode: http.StatusOK,
		Data:       classroomCaseMoveStudentCsvOutput.Conflicts,
		Message:    "Uploaded",
	})
}

// ==================== Service ==========================

type ClassroomCaseMoveStudentCsvInput struct {
	SubjectId string
	*ClassroomCaseMoveStudentCsvRequest
}

type ClassroomCaseMoveStudentCsvOutput struct {
	Conflicts []constant.Conflict
}

func (service *serviceStruct) ClassroomCaseMoveStudentCsv(in *ClassroomCaseMoveStudentCsvInput) (*ClassroomCaseMoveStudentCsvOutput, error) {
	file, err := in.CsvFile.Open()
	if err != nil {
		return nil, err
	}
	defer file.Close()
	reader := csv.NewReader(file)
	_, err = reader.Read()
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	lineNumber := 1
	studentIdColumn := 0
	studentTitleColumn := 1
	studentFirstNameColumn := 2
	studentLastNameColumn := 3
	academicYearColumn := 4
	yearColumn := 5
	classNameColumn := 6
	studentClassMap := map[string]constant.ClassEntity{}
	studentLineNumberClassLineMap := map[string]constant.ClassEntity{}
	type studentDetails struct {
		studentId string
		title     string
		firstName string
		lastName  string
		userId    string
	}
	studentNameMap := map[string]studentDetails{}
	studentOrderMap := map[string]int{}
	conflictMap := map[string][]string{}

	for {
		lineNumber++
		row, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, err
		}
		if len(row) != len(constant.MoveStudentCsvHeader) {
			return nil, helper.NewHttpError(http.StatusBadRequest, helper.ToPtr("Incorrect number of columns"))
		}

		key := fmt.Sprintf(`%d %s %s %s %s`, lineNumber, row[studentIdColumn], row[studentTitleColumn], row[studentFirstNameColumn], row[studentLastNameColumn])
		studentOrderMap[key] = lineNumber
		conflictMap[key] = []string{}

		//if row[studentIdColumn] == "" {
		//	conflictMap[key] = append(conflictMap[key], constant.MissingStudentId)
		//}
		studentId := row[studentIdColumn]
		userId, err := service.storage.StudentCaseGetUserId(in.SchoolId, studentId)
		if err != nil {
			return nil, err
		}
		_, ok := studentClassMap[userId]
		if ok && userId != "" {
			conflictMap[key] = append(conflictMap[key], constant.DuplicateStudentId)
		}
		if userId == "" {
			conflictMap[key] = append(conflictMap[key], constant.MissingStudentId)
		}

		academicYear, err := strconv.Atoi(row[academicYearColumn])
		if err != nil {
			conflictMap[key] = append(conflictMap[key], constant.InvalidAcademicYear)
		}

		if !slices.Contains(constant.Years, row[yearColumn]) {
			conflictMap[key] = append(conflictMap[key], constant.InvalidYear)
		}
		year := row[yearColumn]

		if row[classNameColumn] == "" {
			conflictMap[key] = append(conflictMap[key], constant.InvalidClassName)
		}
		name := row[classNameColumn]

		studentClassMap[userId] = constant.ClassEntity{
			AcademicYear: academicYear,
			Year:         year,
			Name:         name,
			LineNumber:   lineNumber,
		}
		studentLineNumberClassLineMap[fmt.Sprintf(`%d%s`, lineNumber, userId)] = constant.ClassEntity{
			AcademicYear: academicYear,
			Year:         year,
			Name:         name,
			LineNumber:   lineNumber,
		}
		studentNameMap[fmt.Sprintf(`%d%s`, lineNumber, userId)] = studentDetails{
			studentId: row[studentIdColumn],
			title:     row[studentTitleColumn],
			firstName: row[studentFirstNameColumn],
			lastName:  row[studentLastNameColumn],
			userId:    userId,
		}
	}

	if !in.ForceMove {
		for userId, class := range studentLineNumberClassLineMap {
			key := fmt.Sprintf(`%d %s %s %s %s`, class.LineNumber, studentNameMap[userId].studentId, studentNameMap[userId].title, studentNameMap[userId].firstName, studentNameMap[userId].lastName)
			room, err := service.storage.StudentGetClassByAcademicYear(studentNameMap[userId].userId, class.AcademicYear)
			if err != nil {
				return nil, err
			}
			if helper.Deref(room) != "" {
				conflictMap[key] = append(conflictMap[key], constant.RoomConflict)
			}
		}
	}

	if len(conflictMap) > 0 {
		haveConflicts := false
		conflicts := []constant.Conflict{}
		for key, value := range conflictMap {
			if len(value) == 0 {
				continue
			}
			haveConflicts = true
			conflicts = append(conflicts, constant.Conflict{
				RecordId:    studentOrderMap[key],
				Name:        (strings.SplitN(key, " ", 2))[1],
				MessageList: value,
			})
		}
		sort.Slice(conflicts, func(i, j int) bool {
			return conflicts[j].RecordId > conflicts[i].RecordId
		})
		if haveConflicts {
			return &ClassroomCaseMoveStudentCsvOutput{
				Conflicts: conflicts,
			}, helper.NewHttpError(http.StatusConflict, helper.ToPtr("Conflicts"))
		}
	}

	tx, err := service.storage.BeginTx()
	if err != nil {
		return nil, err
	}
	defer tx.Rollback()

	if in.ForceMove {
		// remove student from old class of the same academic year
		err = service.storage.ClassDeleteStudent(tx, in.SchoolId, studentClassMap)
		if err != nil {
			return nil, err
		}
	}

	// create new classes
	updatedMap, err := service.storage.ClassBulkCreate(tx, in.SchoolId, in.SubjectId, studentClassMap)
	if err != nil {
		return nil, err
	}

	for studentId, class := range studentLineNumberClassLineMap {
		if class.Id == 0 {
			classId, err := service.storage.ClassGetByAcademicYearYearName(tx, in.SchoolId, class.AcademicYear, class.Year, class.Name)
			if err != nil {
				return nil, err
			}
			class.Id = classId
			studentClassMap[studentId[1:]] = class
		}
	}

	// add student to new classes
	err = service.storage.ClassBulkAddStudent(tx, studentClassMap)
	if err != nil {
		return nil, err
	}

	for _, class := range updatedMap {
		err = service.PrefillClass(&PrefillClassInput{
			Tx:       tx,
			SchoolId: in.SchoolId,
			ClassId:  class.Id,
		})
		if err != nil {
			return nil, err
		}
	}

	err = tx.Commit()
	if err != nil {
		return nil, err
	}

	return &ClassroomCaseMoveStudentCsvOutput{
		[]constant.Conflict{},
	}, nil
}
