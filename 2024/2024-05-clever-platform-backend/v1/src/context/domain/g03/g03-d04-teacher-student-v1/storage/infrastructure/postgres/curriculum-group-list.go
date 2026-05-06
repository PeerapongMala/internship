package postgres

import (
	"fmt"
	"log"
	"net/http"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) CurriculumGroupList(pagination *helper.Pagination) ([]constant.TeacherStudentFilter, error) {
	sql := `
		SELECT 
			id,
       		short_name AS name
		FROM curriculum_group.curriculum_group cg
		`

	args := []any{}

	totalCount, err := helper.GetTotalCount(postgresRepository.Database, sql, args...)
	if err != nil {
		return nil, err
	}
	if totalCount == 0 {
		return []constant.TeacherStudentFilter{}, nil
	}
	pagination.TotalCount = totalCount

	sql += `ORDER BY id `

	if pagination.LimitResponse > 0 {
		argsIndex := len(args)
		sql += fmt.Sprintf(`LIMIT $%d OFFSET $%d`, argsIndex+1, argsIndex+2)
		args = append(args, pagination.LimitResponse, pagination.Offset)
	}

	curriculumGroupList := []constant.TeacherStudentFilter{}
	err = postgresRepository.Database.Select(&curriculumGroupList, sql, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return curriculumGroupList, helper.NewHttpError(http.StatusNotFound, nil)
	}

	return curriculumGroupList, nil
}
