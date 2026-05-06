package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-03-admin-report-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GetStatPlayCountByProvinceDistrict(province, district, startDate, endDate string) (*constant.StatPlayCountEntity, error) {

	whereClause := "WHERE 1=1"
	timeClause := ""
	args := []interface{}{}
	argIndex := 1

	if province != "" {
		whereClause += fmt.Sprintf(" AND s.province = $%d", argIndex)
		args = append(args, province)
		argIndex++
	}

	if district != "" {
		whereClause += fmt.Sprintf(" AND s.district = $%d", argIndex)
		args = append(args, district)
		argIndex++
	}

	if startDate != "" && endDate != "" {
		timeClause = fmt.Sprintf(" AND lpl.played_at BETWEEN $%d AND $%d", argIndex, argIndex+1)
		args = append(args, startDate, endDate)
		argIndex += 2
	}

	query := fmt.Sprintf(`
		SELECT
			COUNT(*) AS "student_count",
			MAX(total_star) AS "max_total_star",
			SUM(total_star) AS "sum_total_star",
			MIN(total_star) AS "min_total_star"
		FROM (
			SELECT
				cs.student_id,
				COALESCE(SUM(lpl.star), 0) AS "total_star"
			FROM
				"school"."school" s
				LEFT JOIN "class"."class" c ON "s"."id" = "c"."school_id"
				LEFT JOIN "school"."class_student" cs ON "c"."id" = "cs"."class_id"
				LEFT JOIN "level"."level_play_log" lpl ON cs.student_id = lpl.student_id AND cs.class_id = lpl.class_id %s
			%s
			GROUP BY cs.student_id
		)
	`, timeClause, whereClause)

	var entity constant.StatPlayCountEntity
	err := postgresRepository.Database.QueryRowx(query, args...).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}

func (postgresRepository *postgresRepository) GetStatPlayCountAll(startDate, endDate, district string) (*constant.StatPlayCountEntity, error) {

	query := `
		SELECT
			COUNT(*) AS "student_count",
			MAX(total_star) AS "max_total_star",
			SUM(total_star) AS "sum_total_star",
			MIN(total_star) AS "min_total_star"
		FROM (
			SELECT
				cs.student_id,
				COALESCE(SUM(lpl.star), 0) AS "total_star"
			FROM
				"school"."school" s
				LEFT JOIN "class"."class" c ON "s"."id" = "c"."school_id"
				LEFT JOIN "school"."class_student" cs ON "c"."id" = "cs"."class_id"
				LEFT JOIN "level"."level_play_log" lpl ON cs.student_id = lpl.student_id AND cs.class_id = lpl.class_id AND lpl.played_at BETWEEN $1 AND $2
			WHERE
			    "s"."district" = $3
			GROUP BY cs.student_id
		)
	`

	var entity constant.StatPlayCountEntity
	err := postgresRepository.Database.QueryRowx(query, startDate, endDate, district).StructScan(&entity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &entity, nil
}
