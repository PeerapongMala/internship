package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresTeacherStudentRepository) AcademicYearRangeList(pagination *helper.Pagination, schoolId int) ([]constant.AcademicYearRangeEntity, error) {
	query := `
		SELECT
			"id",
			"school_id",
			"name",
			"start_date",
			"end_date"
		FROM
			"school"."academic_year_range"
		WHERE
			"school_id" = $1
	`
	args := []interface{}{schoolId}
	argsIndex := len(args) + 1

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(countQuery, args...).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "name" DESC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	academicYearRangeEntities := []constant.AcademicYearRangeEntity{}
	err := postgresRepository.Database.Select(&academicYearRangeEntities, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	log.Println(academicYearRangeEntities)

	return academicYearRangeEntities, nil
}
