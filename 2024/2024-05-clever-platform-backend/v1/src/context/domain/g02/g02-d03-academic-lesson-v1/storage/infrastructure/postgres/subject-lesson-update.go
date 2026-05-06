package postgres

import (
	"strconv"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d03-academic-lesson-v1/constant"
)

func (postgresRepository *postgresRepository) UpdateSubjectLesson(request *constant.SubjectLessonPatchRequest) (*constant.SubjectLessonResponse, error) {
	// log.Println("request", request)
	response := constant.SubjectLessonResponse{}
	updateQuery := `
		UPDATE "subject"."lesson"
		SET
		`
	columns := []string{}
	values := []interface{}{}

	// Add fields conditionally
	if request.Index != 0 {
		columns = append(columns, "index = $"+strconv.Itoa(len(values)+1))
		values = append(values, request.Index)
	}
	if request.Name != "" {
		columns = append(columns, "name = $"+strconv.Itoa(len(values)+1))
		values = append(values, request.Name)
	}
	if request.FontName != "" {
		columns = append(columns, "font_name = $"+strconv.Itoa(len(values)+1))
		values = append(values, request.FontName)
	}
	if request.FontSize != "" {
		columns = append(columns, "font_size = $"+strconv.Itoa(len(values)+1))
		values = append(values, request.FontSize)
	}
	if request.BackgroundImagePath != "" {
		columns = append(columns, "background_image_path = $"+strconv.Itoa(len(values)+1))
		values = append(values, request.BackgroundImagePath)
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
	// log.Println("updateQuery", updateQuery)
	// log.Println("values", values)
	err := postgresRepository.Database.Get(&response, updateQuery, values...)
	if err != nil {
		return nil, err
	}

	return &response, nil
}
