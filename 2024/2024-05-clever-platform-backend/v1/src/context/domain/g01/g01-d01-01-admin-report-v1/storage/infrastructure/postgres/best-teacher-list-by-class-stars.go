package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) BestTeacherListByClassStars(pagination *helper.Pagination, filter *constant.BestTeacherListByClassStarsFilter) ([]constant.BestTeacherListByClassStars, error) {
	query := `
		WITH play_logs AS (
			SELECT
				cs.class_id AS class_id,
				cs.student_id AS student_id,
				lpl.level_id AS level_id,
				MAX(lpl.star) AS max_stars
			FROM school.class_teacher ct
			LEFT JOIN school.class_student cs ON ct.class_id = cs.class_id
			LEFT JOIN level.level_play_log lpl ON cs.class_id = lpl.class_id AND cs.student_id = lpl.student_id
	`
	args := []interface{}{}
	argsIndex := len(args) + 1

	if filter.StartDate != nil {
		query += fmt.Sprintf(` AND "lpl"."played_at" >= $%d`, argsIndex)
		args = append(args, filter.StartDate)
		argsIndex++
	}
	if filter.EndDate != nil {
		query += fmt.Sprintf(` AND "lpl"."played_at" <= $%d`, argsIndex)
		args = append(args, filter.EndDate)
		argsIndex++
	}

	query += `
			WHERE cs.class_id IS NOT NULL
			GROUP BY cs.class_id, cs.student_id, lpl.level_id
		),
		group_play_logs AS (
			SELECT
				pl.class_id,
				SUM(pl.max_stars) AS total_stars,
				COUNT(pl.level_id) AS total_levels
			FROM play_logs pl
			WHERE pl.max_stars > 0
			GROUP BY pl.class_id
		),
		teacher_stat AS (
			SELECT
				ct.teacher_id,
				ct.class_id,
				COALESCE(gpl.total_stars, 0) AS total_stars,
				COALESCE(gpl.total_levels, 0) AS total_levels,
				RANK() OVER (PARTITION BY ct.teacher_id ORDER BY COALESCE(gpl.total_stars, 0) DESC, ct.class_id) AS rank
			FROM school.class_teacher ct
			LEFT JOIN group_play_logs gpl ON gpl.class_id = ct.class_id
		),
		class_in_use AS (
			SELECT
				teacher_id,
				BOOL_AND(COALESCE(total_levels, 0) >= 1) AS all_class_in_use
			FROM teacher_stat ts
			GROUP BY teacher_id
		),
		class_student_count AS (
			SELECT
				ts.class_id,
				ts.teacher_id,
				COALESCE(COUNT(cs.student_id), 0) AS student_count
			FROM teacher_stat ts
			LEFT JOIN school.class_student cs ON ts.class_id = cs.class_id
			GROUP BY ts.class_id, ts.teacher_id
		)
		SELECT
			sc.code AS school_code,
			sc.name AS school_name,
			c.academic_year,
			c.year,
			c.name AS class_name,
			csc.student_count,
			u.id AS teacher_id,
			u.title AS teacher_title,
			u.first_name AS teacher_first_name,
			u.last_name AS teacher_last_name,
			ts.class_id,
			COALESCE(
        		CAST(ts.total_stars AS FLOAT) / NULLIF(csc.student_count, 0),
        		0
    		) AS stars,
			COALESCE(
        		CAST(ts.total_levels AS FLOAT) / NULLIF(csc.student_count, 0),
        		0
    		) AS levels,
			ciu.all_class_in_use
		FROM teacher_stat ts
		INNER JOIN class_student_count csc ON ts.class_id = csc.class_id AND ts.teacher_id = csc.teacher_id
		INNER JOIN "user"."user" u ON ts.teacher_id = u.id
		INNER JOIN class.class c ON ts.class_id = c.id
		INNER JOIN school.school sc ON c.school_id = sc.id
		INNER JOIN school_affiliation.school_affiliation_school sas ON sc.id = sas.school_id
		INNER JOIN school_affiliation.school_affiliation sa ON sas.school_affiliation_id = sa.id
		LEFT JOIN class_in_use ciu ON ts.teacher_id = ciu.teacher_id
		WHERE ts.rank = 1
	`

	if filter.SchoolAffiliationType != nil {
		query += fmt.Sprintf(` AND "sa"."school_affiliation_group" = $%d`, argsIndex)
		args = append(args, filter.SchoolAffiliationType)
		argsIndex++
	}
	if filter.SchoolId != nil {
		query += fmt.Sprintf(` AND "sc"."id" = $%d`, argsIndex)
		args = append(args, filter.SchoolId)
		argsIndex++
	}
	if filter.SchoolCode != nil {
		query += fmt.Sprintf(` AND "sc"."code" = $%d`, argsIndex)
		args = append(args, filter.SchoolCode)
		argsIndex++
	}
	if filter.SchoolName != nil {
		query += fmt.Sprintf(` AND "sc"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+helper.Deref(filter.SchoolName)+"%")
		argsIndex++
	}

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY COALESCE(
        		CAST(ts.total_stars AS FLOAT) / NULLIF(csc.student_count, 0),
        		0
    		) DESC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	bestTeachers := []constant.BestTeacherListByClassStars{}
	err := postgresRepository.Database.Select(&bestTeachers, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return bestTeachers, nil
}
