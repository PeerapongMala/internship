package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherChatRepository) ChatListTeacher(filter *constant.ChatFilter, pagination *helper.Pagination) ([]*constant.ChatListTeacher, error) {
	baseQuery := `
		WITH chat_configs AS (
			SELECT
				chat_level,
				is_enabled
			FROM
				message.chat_config
		),
		cte_recently AS (
			SELECT DISTINCT ON (m.school_id, m.room_type, m.room_id)
				m.id as message_id,
				m.school_id,
				m.room_type,
				m.room_id,
				m.content, 
				m.sender_id,
				m.created_at,
				CONCAT(u.first_name, ' ', u.last_name) AS sender_name,
				m.receiver_id
			FROM message.messages m
			INNER JOIN "user".user u
				ON m.sender_id = u.id
			ORDER BY m.school_id, m.room_type, m.room_id, m.created_at DESC
		),
		cte_subject AS (
			SELECT 
				CAST(ss.subject_id AS TEXT) AS id,
				ss.subject_id,
				concat(s.name, ' ', sy.short_name) AS room_name, 
				ss.school_id, 
				'subject' AS room_type,
				s.image_url,
                COUNT(cs.student_id) as member_count,
          		st.academic_year
			FROM school.school_subject ss
			INNER JOIN subject.subject_teacher st
				ON ss.subject_id = st.subject_id 
			INNER JOIN subject.subject s
				ON ss.subject_id = s.id
            INNER JOIN curriculum_group.subject_group sg
				ON sg.id = s.subject_group_id
            INNER JOIN curriculum_group.year y
            	ON sg.year_id = y.id
            INNER JOIN curriculum_group.seed_year sy
            	ON y.seed_year_id = sy.id
            INNER JOIN class.class cc
            	ON cc.school_id = ss.school_id 
          		AND cc.year = sy.short_name
          		AND st.academic_year = cc.academic_year
            INNER JOIN school.class_student cs
            	ON cc.id = cs.class_id
			WHERE 
            	ss.school_id = $1 AND
				s.status = 'enabled' AND
				ss.is_enabled = true 
                AND st.teacher_id = $2
           	GROUP BY ss.subject_id, s.name, sy.short_name, ss.school_id, s.image_url, st.academic_year
		),
		cte_class AS (
			SELECT 
				COUNT(DISTINCT cs.student_id) AS member_count,
                CAST(cc.id AS TEXT) AS id, 
				concat('ห้อง ', cc.year, '/',cc.name) AS room_name, 
				cc.school_id, 
				'class' AS room_type,
                cc.academic_year,
				sc.image_url
			FROM class.class cc
			INNER JOIN school.class_teacher ct
				ON cc.id = ct.class_id
			INNER JOIN school.school sc
            	ON cc.school_id = sc.id
            LEFT JOIN school.class_student cs
            	ON ct.class_id = cs.class_id
			WHERE 
            	cc.school_id = $1 AND 
                ct.teacher_id = $2 AND
				cc.status = 'enabled' 
            GROUP BY cc.id, cc.name, cc.school_id, sc.image_url
		),
		cte_group AS (
			SELECT 
				COUNT(DISTINCT ss.student_id) as member_count,
				CAST(sg.id AS TEXT) AS id, 
				sg.name AS room_name, 
				cc.school_id, 
				'group' AS room_type,
                st.teacher_id,
                cc.id as class_id,
                cc.year,
                cc.academic_year,
				sc.image_url,
				sg.subject_id
			FROM class.class cc
			INNER JOIN class.study_group sg
				ON cc.id = sg.class_id
			INNER JOIN school.school sc
				ON sc.id = cc.school_id
			INNER JOIN subject.subject_teacher st
				ON sg.subject_id = st.subject_id
            LEFT JOIN class.study_group_student ss
            	ON ss.study_group_id = sg.id 
			WHERE 
            	cc.school_id = $1  
                AND st.teacher_id = $2
				AND sg.status = 'enabled'
            GROUP BY sg.id, sg.name, cc.school_id, st.teacher_id, cc.id, sc.image_url
		),
		cte_private_subject as (
			SELECT 
              u.id as user_id,
  			  concat(u.first_name, ' ', u.last_name) as room_name,
              concat(cc.year, '/', cc.name) as private_class,
              cc.school_id,
		      u.image_url,
              cc.academic_year,
			  ARRAY_AGG(s.id) as subject_ids,
  			  cc.id as class_id
            FROM school.school_subject ss
            INNER JOIN subject.subject_teacher st
                ON ss.subject_id = st.subject_id
            INNER JOIN subject.subject s
				ON ss.subject_id = s.id
            INNER JOIN curriculum_group.subject_group sg
				ON sg.id = s.subject_group_id
            INNER JOIN curriculum_group.year y
            	ON sg.year_id = y.id
            INNER JOIN curriculum_group.seed_year sy
            	ON y.seed_year_id = sy.id
            INNER JOIN class.class cc
            	ON cc.school_id = ss.school_id 
          		AND cc.year = sy.short_name
          		AND st.academic_year = cc.academic_year
            INNER JOIN school.class_student cs
            	ON cc.id = cs.class_id
            INNER JOIN "user".user u
            	ON cs.student_id = u.id
            WHERE 
               	st.teacher_id = $2
            GROUP BY 
  			  u.id,
              cc.year, 
              cc.name,
              cc.school_id,
		      u.image_url,
              cc.academic_year,
			  cc.id),
		cte_private as ( 
			SELECT
				COALESCE(cps.user_id, cs.student_id) as id,
				COALESCE(cps.school_id, cc.school_id) as school_id,
				COALESCE(cps.room_name, concat(u.first_name, ' ', u.last_name)) as room_name,
				cps.subject_ids,
				COALESCE(cps.academic_year, cc.academic_year) as academic_year,
				u.image_url,
				COALESCE(cps.class_id, cc.id) as class_id,
				COALESCE(cps.private_class, concat(cc.year, '/', cc.name)) as private_class,
				'private' as room_type
			FROM school.class_teacher ct
			INNER JOIN school.class_student cs
				ON ct.class_id = cs.class_id
				AND ct.teacher_id = $2
			INNER JOIN class.class cc
				ON cc.id = cs.class_id
			FULL JOIN cte_private_subject cps
				ON cps.user_id = cs.student_id
				AND cps.class_id = cs.class_id
			INNER JOIN "user".user u
				ON u.id = COALESCE(cps.user_id, cs.student_id)
		),
	`

	subjectQuery := `
		SELECT
			r.content,
			s.school_id,
			r.sender_id,
			r.sender_name,
			s.id AS room_id,
			s.room_type,
			r.created_at,
			s.room_name,
			s.image_url,
			NULL as private_class,
			s.member_count,
			s.academic_year,
			r.message_id
		FROM cte_subject s
		LEFT JOIN cte_recently r
			ON r.school_id = s.school_id AND r.room_type = s.room_type AND r.room_id = s.id
		WHERE true
			AND (SELECT is_enabled FROM chat_configs WHERE chat_level = s.room_type) 
`

	classQuery := `
		SELECT
			r.content,
			c.school_id,
			r.sender_id,
			r.sender_name,
			c.id AS room_id,
			c.room_type,
			r.created_at,
			c.room_name,
			c.image_url,
			NULL as private_class,
			c.member_count,
			c.academic_year,
			r.message_id
		FROM cte_class c
		LEFT JOIN cte_recently r
			ON r.school_id = c.school_id AND r.room_type = c.room_type AND r.room_id = c.id
		WHERE true
			AND (SELECT is_enabled FROM chat_configs WHERE chat_level = c.room_type) `

	groupQuery := `
		SELECT
			r.content,
			g.school_id,
			r.sender_id,
			r.sender_name,
			g.id AS room_id,
			g.room_type,
			r.created_at,
			g.room_name,
			g.image_url,
			NULL as private_class,
			g.member_count,
			g.academic_year,
			r.message_id
		FROM cte_group g
		LEFT JOIN cte_recently r
			ON r.school_id = g.school_id AND r.room_type = g.room_type AND r.room_id = g.id
		WHERE true
			AND (SELECT is_enabled FROM chat_configs WHERE chat_level = g.room_type) `

	privateQuery := `
		(SELECT
			%s
			r.content,
			COALESCE (r.school_id, p.school_id) AS school_id,
			r.sender_id,
			r.sender_name,
			p.id AS room_id,
			COALESCE (r.room_type, p.room_type) AS room_type,
			r.created_at,
			p.room_name,
			p.image_url,
			p.private_class,
			NULL as member_count,
			p.academic_year,
			r.message_id
		FROM cte_recently r
		LEFT JOIN cte_private p
			ON r.school_id = p.school_id 
            AND ((r.receiver_id = $2 AND r.sender_id = p.id) OR 
                 (r.receiver_id = p.id AND r.sender_id = $2))
		WHERE true
			AND (SELECT is_enabled FROM chat_configs WHERE chat_level = r.room_type) 
			AND NOT (r.receiver_id = $2 AND r.content = '_init_')
	`
	args := []interface{}{filter.SchoolID, filter.UserID}
	argsIndex := 3

	if filter.SubjectID != 0 {
		args = append(args, filter.SubjectID)
		subjectQuery += fmt.Sprintf(` AND s.subject_id = $%d`, argsIndex)
		groupQuery += fmt.Sprintf(` AND g.subject_id = $%d`, argsIndex)
		privateQuery += fmt.Sprintf(` AND $%d = ANY(p.subject_ids)`, argsIndex)
		argsIndex++
	}

	if filter.AcademicYear != 0 {
		args = append(args, filter.AcademicYear)
		classQuery += fmt.Sprintf(` AND c.academic_year = $%d`, argsIndex)
		subjectQuery += fmt.Sprintf(` AND s.academic_year = $%d`, argsIndex)
		groupQuery += fmt.Sprintf(` AND g.academic_year = $%d`, argsIndex)

		privateQuery = fmt.Sprintf(privateQuery, ``)
		privateQuery += fmt.Sprintf(` AND p.academic_year = $%d`, argsIndex)
		argsIndex++
	} else {
		privateQuery = fmt.Sprintf(privateQuery, `DISTINCT ON (p.id)`)
		privateQuery += fmt.Sprintf(` ORDER BY p.id, p.academic_year desc`)
	}

	privateQuery += fmt.Sprintf(`)`)

	var query string
	switch filter.RoomType {
	case "subject":
		query = baseQuery + fmt.Sprintf(`cte_all as (%s)`, subjectQuery)
	case "class":
		query = baseQuery + fmt.Sprintf(`cte_all as (%s)`, classQuery)
	case "group":
		query = baseQuery + fmt.Sprintf(`cte_all as (%s)`, groupQuery)
	case "private":
		query = baseQuery + fmt.Sprintf(`cte_all as (%s)`, privateQuery)
	default:
		query = baseQuery + fmt.Sprintf(`cte_all as (%s)`, subjectQuery+` UNION ALL `+classQuery+` UNION ALL `+groupQuery+` UNION ALL `+privateQuery)
	}

	query += fmt.Sprintf(`
		SELECT *
		FROM cte_all
		WHERE room_id IS NOT NULL
	`)

	if filter.Search != "" {
		args = append(args, filter.Search)
		query += fmt.Sprintf(` AND room_name ILIKE '%%' || $%d || '%%'`, argsIndex)
		argsIndex++
	}

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
	query += fmt.Sprintf(` 
		ORDER BY created_at DESC NULLS LAST
		OFFSET $%d LIMIT $%d
	`, argsIndex, argsIndex+1)

	var ChatList []*constant.ChatListTeacher
	err = postgresRepository.Database.Select(&ChatList, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	return ChatList, nil
}
