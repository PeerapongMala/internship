package postgres

import (
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d04-academic-sub-lesson-v1/constant"
)

func (postgresRepository *postgresRepository) UpdateSubjectSubLesson(request *constant.SubjectSubLessonRequest) (*constant.SubjectSubLessonResponse, error) {
	// log.Println("request", request)
	response := constant.SubjectSubLessonResponse{}
	updateQuery := `
		UPDATE "subject"."sub_lesson"
		SET
		`
	columns := []string{}
	values := []interface{}{}

	// Add fields conditionally
	if request.IndicatorId != 0 {
		columns = append(columns, "indicator_id = $"+strconv.Itoa(len(values)+1))
		values = append(values, request.IndicatorId)
	}
	if request.Name != "" {
		columns = append(columns, "name = $"+strconv.Itoa(len(values)+1))
		values = append(values, request.Name)
	}
	if request.Status != "" {
		columns = append(columns, "status = $"+strconv.Itoa(len(values)+1))
		values = append(values, request.Status)
	}
	columns = append(columns, "updated_at = $"+strconv.Itoa(len(values)+1))
	values = append(values, request.UpdatedAt)

	columns = append(columns, "updated_by = $"+strconv.Itoa(len(values)+1))
	values = append(values, request.UpdatedBy)

	if request.AdminLoginAs != nil {
		columns = append(columns, "admin_login_as = $"+strconv.Itoa(len(values)+1))
		values = append(values, request.AdminLoginAs)
	}

	updateQuery += strings.Join(columns, ", ")

	updateQuery += ` WHERE id = $` + strconv.Itoa(len(values)+1) + ` RETURNING *`

	values = append(values, request.Id)

	err := postgresRepository.Database.Get(&response, updateQuery, values...)
	if err != nil {
		return nil, err
	}

	return &response, nil
}
