package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) StudyGroupList(classId, subjectId int, filter constant.StudyGroupFilter, pagination *helper.Pagination) ([]constant.StudyGroupEntity, error) {
	query := `
		SELECT
			"sg"."id",
			"sg"."name"
		FROM
			"class"."study_group" sg
		WHERE
			"subject_id" = $1
			AND
			"class_id" = $2
			AND
		    "status" = 'enabled'
	`
	args := []interface{}{subjectId, classId}
	argsIndex := 3

	if filter.Id != 0 {
		query += fmt.Sprintf(` AND "sg"."id" = $%d`, argsIndex)
		args = append(args, filter.Id)
		argsIndex++
	}
	if filter.StudyGroupName != "" {
		query += fmt.Sprintf(` AND "sg"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+filter.StudyGroupName+"%")
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "sg"."id" OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	studyGroupEntities := []constant.StudyGroupEntity{}
	err := postgresRepository.Database.Select(&studyGroupEntities, query, args...)
	if err != nil {
		log.Printf("%=v", errors.WithStack(err))
		return nil, err
	}

	return studyGroupEntities, nil
}
