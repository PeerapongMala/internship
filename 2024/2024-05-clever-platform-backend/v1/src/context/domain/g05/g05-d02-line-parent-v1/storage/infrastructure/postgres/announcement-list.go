package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g05/g05-d02-line-parent-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AnnouncementList(userID string, pagination *helper.Pagination) ([]*constant.AnnouncementList, error) {
	query := `
		WITH latest_academic_year AS (
				SELECT 
					DISTINCT ON (cs.student_id) 
					cs.student_id, 
					cc.academic_year
				FROM school.class_student cs
				INNER JOIN class.class cc 
					ON cs.class_id = cc.id
				WHERE 
					cs.student_id = $1 
					AND cc.status = 'enabled'
				ORDER BY cs.student_id, cc.academic_year DESC
			)
			SELECT 
				a.school_id,
				a.id as announcement_id,
				a.scope,
				a.title,
				a.type,
				a.started_at,
				a.ended_at
			FROM school.class_student cs
				INNER JOIN class.class cc
					ON cs.class_id = cc.id
				INNER JOIN latest_academic_year l
					ON l.student_id = cs.student_id 
					AND l.academic_year = cc.academic_year
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
				INNER JOIN announcement.announcement a
					ON cc.school_id = a.school_id
				LEFT JOIN announcement.announcement_reward ar
						ON a.id = ar.announcement_id 
						AND ar.subject_id = ss.subject_id
				LEFT JOIN announcement.announcement_event ae
						ON a.id = ae.announcement_id 
						AND ae.subject_id = ss.subject_id
				LEFT JOIN announcement.announcement_system as_
						ON a.id = as_.announcement_id 
						AND as_.subject_id = ss.subject_id
						
					WHERE 
						cc.academic_year = l.academic_year
						AND (
							a.scope = 'School'
							OR (
								a.scope = 'Subject'
								AND (
									ar.academic_year = l.academic_year
									OR ae.academic_year = l.academic_year
									OR as_.academic_year = l.academic_year
								)
								AND sy.short_name = cc.year
							)
						)
						AND DATE(NOW()) BETWEEN DATE(a.started_at) AND DATE(a.ended_at)
						AND a.status = 'enabled'

						GROUP BY
							a.school_id,
							a.id
	`

	args := []interface{}{userID}
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
	query += fmt.Sprintf(` OFFSET $2 LIMIT $3`)

	announcements := []*constant.AnnouncementList{}
	err = postgresRepository.Database.Select(&announcements, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	// if announcements == nil {
	// 	announcements = []*constant.AnnouncementList{}
	// }

	return announcements, nil
}
