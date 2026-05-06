package postgres

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) SubjectListByCurriculumGroupId(curriculumGroupId int, pagination *helper.Pagination) ([]constant.TeacherStudentFilter, error) {
	sql := `
		SELECT 
			s.id,
			s."name"
		FROM subject.subject s
		INNER JOIN curriculum_group.subject_group sg ON s.subject_group_id = sg.id
		INNER JOIN curriculum_group."year" y ON sg.year_id = y.id
		WHERE y.curriculum_group_id = $1
		`

	args := []any{curriculumGroupId}

	totalCount, err := helper.GetTotalCount(postgresRepository.Database, sql, args...)
	if err != nil {
		return nil, err
	}
	if totalCount == 0 {
		return []constant.TeacherStudentFilter{}, nil
	}
	pagination.TotalCount = totalCount

	if pagination.LimitResponse > 0 {
		argsIndex := len(args)
		sql += fmt.Sprintf(`LIMIT $%d OFFSET $%d`, argsIndex+1, argsIndex+2)
		args = append(args, pagination.LimitResponse, pagination.Offset)
	}

	subjectList := []constant.TeacherStudentFilter{}
	err = postgresRepository.Database.Select(&subjectList, sql, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return subjectList, helper.NewHttpError(http.StatusNotFound, nil)
	}

	return subjectList, nil
}
