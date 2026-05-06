package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) BestSchoolListByAvgClassStars(pagination *helper.Pagination, filter *constant.BestTeacherListByClassStarsFilter) ([]constant.BestSchoolListByAvgClassStars, error) {
	query := `
		WITH play_logs_ids AS (
			SELECT
				lpl.id,
				lpl.student_id,
				lpl.class_id,
				lpl.level_id,
				lpl.star,
				lpl.played_at
			FROM "level".level_play_log lpl
			WHERE TRUE
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
		),
		play_logs AS (
			SELECT
				student_id,
				class_id,
				level_id,
				MAX(star) AS max_stars
			FROM play_logs_ids
			GROUP BY student_id, class_id, level_id
		),
		group_play_logs AS (
			SELECT
				pl.class_id,
				SUM(pl.max_stars) AS total_stars,
				COUNT(pl.level_id) AS total_levels
			FROM school.class_student cs
			INNER JOIN play_logs pl ON pl.class_id = cs.class_id AND pl.student_id = cs.student_id
			GROUP BY pl.class_id
		),
		class_student_count AS (
			SELECT	
				gpl.class_id,
				COUNT(cs.student_id) AS class_student_count
			FROM group_play_logs gpl
			INNER JOIN school.class_student	cs ON gpl.class_id = cs.class_id
			GROUP BY gpl.class_id
		),
		teacher_stat AS (
			SELECT
				st.school_id,
				st.user_id,
				MAX(
					CASE 
						WHEN csc.class_student_count = 0 OR csc.class_student_count IS NULL THEN 0 
    					ELSE gpl.total_stars / csc.class_student_count 
					END 
				) AS max_total_stars
			FROM school.school_teacher st
			LEFT JOIN school.class_teacher ct ON st.user_id = ct.teacher_id
			LEFT JOIN group_play_logs gpl ON ct.class_id = gpl.class_id
			LEFT JOIN class_student_count csc ON gpl.class_id = csc.class_id
			GROUP BY st.school_id, st.user_id
		),
		school_stat AS (
			SELECT
				sc.id,
				sc.code,
				sc.name,
				SUM(ts.max_total_stars) / COUNT(st.user_id) AS avg_stars
			FROM school.school sc
			LEFT JOIN school.school_teacher st ON sc.id = st.school_id
			LEFT JOIN teacher_stat ts ON st.user_id = ts.user_id
			GROUP BY sc.id, sc.code, sc.name
		),
		class_count AS (
			SELECT
				sc.id,
				COUNT(c.id) AS class_count
			FROM school.school sc
			LEFT JOIN "class"."class" c ON sc.id = c.school_id
			GROUP BY sc.id
		),
		active_class_count AS (
			SELECT
				c.school_id,
				COUNT(gpl.class_id) AS active_class_count
			FROM group_play_logs gpl
			INNER JOIN "class"."class" c ON gpl.class_id = c.id
			GROUP BY c.school_id
		),
		teacher_count AS (
			SELECT
				school_id,
				COUNT(DISTINCT user_id) AS teacher_count
			FROM teacher_stat
			GROUP BY school_id
		),
		student_count AS (
			SELECT
				sc.id,
				COUNT(s.user_id) AS student_count
			FROM school.school sc
			INNER JOIN "user".student s ON sc.id = s.school_id
			GROUP BY sc.id
		),
		active_student_count AS (
			SELECT
				s.school_id,
				COUNT(DISTINCT s.user_id) FILTER (WHERE lpl.id IS NOT NULL) AS student_count
			FROM "user"."student" s
			LEFT JOIN "level"."level_play_log" lpl ON s.user_id = lpl.student_id
			GROUP BY s.school_id
		)
		SELECT
			st.code AS school_code,
			st.name AS school_name,
			COALESCE(cc.class_count, 0) AS class_count,
			COALESCE(tc.teacher_count, 0) AS teacher_count,
			COALESCE(st.avg_stars, 0) AS avg_stars,
			COALESCE(acc.active_class_count, 0) AS active_class_count,
			COALESCE(sc.student_count, 0) AS student_count,
			COALESCE(stuc.student_count, 0) AS "active_student_count"
		FROM school_stat st
		LEFT JOIN class_count cc ON st.id = cc.id
		LEFT JOIN teacher_count tc ON st.id = tc.school_id
		LEFT JOIN active_class_count acc ON st.id = acc.school_id
		LEFT JOIN student_count sc ON st.id = sc.id
		LEFT JOIN school_affiliation.school_affiliation_school sas ON st.id = sas.school_id
		LEFT JOIN school_affiliation.school_affiliation sa ON sas.school_affiliation_id = sa.id
		LEFT JOIN active_student_count stuc ON st.id = stuc.school_id
		WHERE TRUE
	`

	if filter.SchoolAffiliationType != nil {
		query += fmt.Sprintf(` AND "sa"."school_affiliation_group" = $%d`, argsIndex)
		args = append(args, filter.SchoolAffiliationType)
		argsIndex++
	}
	if filter.SchoolId != nil {
		query += fmt.Sprintf(` AND "st"."id" = $%d`, argsIndex)
		args = append(args, filter.SchoolId)
		argsIndex++
	}
	if filter.SchoolCode != nil {
		query += fmt.Sprintf(` AND "st"."code" = $%d`, argsIndex)
		args = append(args, filter.SchoolCode)
		argsIndex++
	}
	if filter.SchoolName != nil {
		query += fmt.Sprintf(` AND "st"."name" ILIKE $%d`, argsIndex)
		args = append(args, "%"+helper.Deref(filter.SchoolName)+"%")
		argsIndex++
	}

	if pagination != nil {
		query += fmt.Sprintf(` ORDER BY COALESCE(st.avg_stars, 0) DESC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	bestSchools := []constant.BestSchoolListByAvgClassStars{}
	err := postgresRepository.Database.Select(&bestSchools, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return bestSchools, nil
}
