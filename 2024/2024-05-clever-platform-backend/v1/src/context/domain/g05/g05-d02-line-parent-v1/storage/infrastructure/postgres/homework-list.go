package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) HomeworkList(userID string, classID int, pagination *helper.Pagination) ([]*constant.Homework, error) {
	query := `
		SELECT
			h.id as homework_id,
			h.name AS homework_name,
			concat(s.name, ' ', sy.short_name) AS subject_name,
			les.name AS lesson,
			sl.name AS sub_lesson,
			CASE 
				WHEN hy.homework_id IS NOT NULL THEN cc.year
				WHEN hc.homework_id IS NOT NULL THEN concat(cc.year, '/', cc.name)
				WHEN hg.homework_id IS NOT NULL THEN concat(cc.year, '/', cc.name, ' ', csg.name)
				ELSE 'Not Assigned'
			END AS assign_to,
			h.started_at,
			h.due_at,
			(
    			SELECT COUNT(DISTINCT htl.level_id)
    			FROM homework.homework_template_level htl
    			WHERE htl.homework_template_id = h.homework_template_id
			) as level_count
		FROM school.class_student cs
		INNER JOIN class.class cc
			ON cs.class_id = cc.id
		LEFT JOIN class.study_group csg
			ON cc.id = csg.class_id
		INNER JOIN school.school_subject ss
			ON cc.school_id = ss.school_id
		INNER JOIN subject.subject s
			ON s.id = ss.subject_id
		INNER JOIN curriculum_group.subject_group sg
			ON s.subject_group_id = sg.id
		INNER JOIN curriculum_group.year y
			ON sg.year_id = y.id
		INNER JOIN curriculum_group.seed_year sy
			ON y.seed_year_id = sy.id 
			AND sy.short_name = cc.year
		LEFT JOIN homework.homework h
			ON h.subject_id = s.id
		LEFT JOIN homework.homework_assigned_to_class hc
			ON h.id = hc.homework_id
		LEFT JOIN homework.homework_assigned_to_study_group hg
			ON h.id = hg.homework_id
		LEFT JOIN homework.homework_assigned_to_year hy
			ON h.id = hy.homework_id
		LEFT JOIN homework.homework_template ht
			ON ht.subject_id = s.id
		LEFT JOIN homework.homework_template_level htl
			ON htl.homework_template_id = ht.id
		INNER JOIN level.level ll
			ON htl.level_id = ll.id
		INNER JOIN subject.sub_lesson sl
			ON sl.id = ll.sub_lesson_id
		INNER JOIN subject.lesson les
			ON les.id = sl.lesson_id
		WHERE cs.student_id = $1 AND cc.id = $2
		GROUP BY 
			hy.homework_id, hc.homework_id, hg.homework_id, 
			h.name, s.name, sy.short_name, 
			les.name, sl.name, cc.year, 
			cc.name, csg.name, h.started_at, 
			h.due_at, h.id
	`
	args := []interface{}{userID, classID}
	if pagination != nil {

		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		args = append(args, pagination.Offset, pagination.Limit)
		query += fmt.Sprintf(` OFFSET $3 LIMIT $4`)
	}

	homeworks := []*constant.Homework{}
	err := postgresRepository.Database.Select(&homeworks, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return homeworks, nil
}
