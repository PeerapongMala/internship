package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d01-01-admin-report-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) BestTeacherListByStudyGroupStars(pagination *helper.Pagination, filter *constant.BestTeacherListByClassStarsFilter) ([]constant.BestTeacherListByStudyGroupStars, error) {
	query := `
		WITH play_log_ids AS (
			SELECT
				DISTINCT lpl.id,
				lpl.class_id,
				sg.id AS study_group_id,
				lpl.student_id,
				lpl.level_id AS level_id,
				lpl.star
			FROM school.class_teacher ct
			INNER JOIN "class"."study_group" sg ON "ct"."class_id" = "sg"."class_id"
			LEFT JOIN "class"."study_group_student" sgs ON "sg"."id" = "sgs"."study_group_id"
			LEFT JOIN level.level_play_log lpl ON ct.class_id = lpl.class_id AND sgs.student_id = lpl.student_id
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
			WHERE lpl.id IS NOT NULL 
		),
		play_logs AS (
			SELECT
				sg.id AS study_group_id,
				sgs.student_id AS student_id,
				pli.level_id AS level_id,
				MAX(pli.star) AS max_stars
			FROM school.class_teacher ct
			LEFT JOIN "class"."study_group" sg ON "ct"."class_id" = "sg"."class_id"
			LEFT JOIN "class"."study_group_student" sgs ON "sg"."id" = "sgs"."study_group_id"
			LEFT JOIN play_log_ids pli ON sg.class_id = pli.class_id AND sgs.student_id = pli.student_id
			WHERE sg.id IS NOT NULL AND pli.star > 0
			GROUP BY sg.id, sgs.student_id, pli.level_id
		),
		group_play_logs AS (
			SELECT
				pl.study_group_id,
				SUM(pl.max_stars) AS total_stars,
				COUNT(pl.level_id) AS total_levels
			FROM play_logs pl
			GROUP BY pl.study_group_id
		),
		study_group_student_count AS (
			SELECT
				gpl.study_group_id,
				COALESCE(COUNT(sgs.student_id), 0) AS student_count
			FROM group_play_logs gpl
			LEFT JOIN class.study_group_student sgs ON gpl.study_group_id = sgs.study_group_id
			GROUP BY gpl.study_group_id
		),
		attempts AS (
			SELECT
				study_group_id,
				COUNT(id) AS "attempts"
			FROM play_log_ids
			GROUP BY study_group_id
		),
		avg_time AS (
			SELECT
				pli.study_group_id,
				AVG(qpl.time_used) AS avg_time
			FROM play_log_ids pli
			INNER JOIN question.question_play_log qpl ON pli.id = qpl.level_play_log_id	
			GROUP BY pli.study_group_id
		)
		SELECT
			sc.code AS school_code,
			sc.name AS school_name,
			c.academic_year,
			c.year,
			c.name AS class_name,
			sg.id AS study_group_id,
			sg.name AS study_group_name,
			sgsc.student_count,
			COALESCE(
        		CAST(gpl.total_stars AS FLOAT) / NULLIF(sgsc.student_count, 0),
        		0
    		) AS stars,
			COALESCE(
        		CAST(gpl.total_levels AS FLOAT) / NULLIF(sgsc.student_count, 0),
        		0
    		) AS levels,
			COALESCE(a.attempts, 0) AS attempts,
			COALESCE(at.avg_time, 0) AS avg_time
		FROM group_play_logs gpl
		INNER JOIN study_group_student_count sgsc ON gpl.study_group_id = sgsc.study_group_id
		INNER JOIN "class"."study_group" sg ON "sgsc"."study_group_id" = "sg"."id"
		INNER JOIN class.class c ON sg.class_id = c.id
		INNER JOIN school.school sc ON c.school_id = sc.id
		INNER JOIN school_affiliation.school_affiliation_school sas ON sc.id = sas.school_id
		INNER JOIN school_affiliation.school_affiliation sa ON sas.school_affiliation_id = sa.id
		LEFT JOIN attempts a ON gpl.study_group_id = a.study_group_id 
		LEFT JOIN avg_time at ON gpl.study_group_id = at.study_group_id
		WHERE TRUE
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
        		CAST(gpl.total_stars AS FLOAT) / NULLIF(sgsc.student_count, 0),
        		0
    		) DESC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		argsIndex += 2
		args = append(args, pagination.Offset, pagination.Limit)
	}

	bestTeachers := []constant.BestTeacherListByStudyGroupStars{}
	err := postgresRepository.Database.Select(&bestTeachers, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return bestTeachers, nil
}
