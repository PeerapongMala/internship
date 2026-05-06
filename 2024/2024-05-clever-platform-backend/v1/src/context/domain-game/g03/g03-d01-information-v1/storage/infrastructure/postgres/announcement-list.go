package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d01-information-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) AnouncementList(schoolID int, userID string, pagination *helper.Pagination) ([]*constant.AnnouncementList, error) {
	query := `
		WITH latest_academic_year AS (
			SELECT DISTINCT ON (cs.student_id) cs.student_id, cc.academic_year
			FROM school.class_student cs
			INNER JOIN class.class cc 
  				ON cs.class_id = cc.id
  			WHERE 
				cs.student_id = $2 
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
		LEFT JOIN announcement.user_announcement ua
			ON ua.announcement_id = a.id
			
		WHERE 
			cc.academic_year = l.academic_year
			AND a.school_id = $1
			AND (
				a.scope = 'ระดับโรงเรียน'
				OR (
					a.scope = 'ระดับวิชา'
					AND (
						ar.academic_year = l.academic_year
						OR ae.academic_year = l.academic_year
						OR as_.academic_year = l.academic_year
					)
					AND sy.short_name = cc.year
				)
			)
			AND cs.student_id = $2
			AND DATE(NOW()) BETWEEN DATE(a.started_at) AND DATE(a.ended_at)
			AND (ua.is_read <> TRUE OR ua.is_read ISNULL)
			AND a.status = 'enabled'

			GROUP BY 
				a.school_id,
				a.id
	`

	args := []interface{}{schoolID, userID}
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

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	announcements := []*constant.AnnouncementList{}

	for rows.Next() {
		announcement := constant.AnnouncementList{}
		err := rows.StructScan(&announcement)

		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}

		announcements = append(announcements, &announcement)
	}

	return announcements, nil
}
