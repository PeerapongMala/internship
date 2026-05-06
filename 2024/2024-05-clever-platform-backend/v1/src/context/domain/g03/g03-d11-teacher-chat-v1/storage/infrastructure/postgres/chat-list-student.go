package postgres

import (
	"fmt"
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherChatRepository) ChatListStudent(filter *constant.ChatFilter, pagination *helper.Pagination) ([]*constant.ChatListStudent, error) {
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
				count(DISTINCT cs.student_id) as member_count,
				cc.academic_year
			FROM school.class_student cs
            INNER JOIN class.class cc
            	ON cs.class_id = cc.id
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
            WHERE 
            	cc.school_id = $1 
                AND sy.short_name = cc.year
				AND cs.student_id = $2
            GROUP BY ss.subject_id, sy.short_name, cc.academic_year, s.name , ss.school_id, s.image_url
		),
		cte_class AS (
			SELECT 
				COUNT(DISTINCT st.user_id) AS member_count,
				CAST(cc.id AS TEXT) AS id,
				concat('ห้อง ', cc.year, '/',cc.name) AS room_name, 
				cc.school_id, 
				'class' AS room_type,
                cc.academic_year,
          		sc.image_url
			FROM school.class_student cs
			INNER JOIN "user".student st 
				ON cs.student_id = st.user_id
			INNER JOIN class.class cc 
				ON cs.class_id = cc.id
          	INNER JOIN school.school sc
          		ON sc.id = cc.school_id
			WHERE 
            	cc.status = 'enabled'
				AND cs.student_id = $2
			GROUP BY cc.id, cc.name, cc.school_id, cc.academic_year, sc.image_url
			ORDER BY cc.academic_year DESC
		),
		cte_group AS (
			SELECT
				COUNT(DISTINCT cs.student_id) AS member_count,
				CAST(sg.id AS TEXT) AS id, 
				sg.name AS room_name, 
				cc.school_id, 
				'group' AS room_type,
          		sc.image_url,
          		cc.academic_year,
				sg.subject_id
			FROM school.class_student cs
			INNER JOIN class.class cc
				ON cs.class_id = cc.id
			INNER JOIN class.study_group sg
				ON sg.class_id = cs.class_id
			INNER JOIN class.study_group_student sgs
				ON sgs.study_group_id = sg.id AND "sgs"."student_id" = $2
         	INNER JOIN school.school sc
          		ON cc.school_id = sc.id
          	WHERE cs.student_id = $2
			GROUP BY sg.id, sg.name, cc.school_id, sc.image_url, cc.academic_year
		),
		cte_private_subject as (SELECT 
                st.academic_year,
				CAST(st.teacher_id AS TEXT) AS id,
                CONCAT(u.first_name, ' ', u.last_name) AS room_name,
                ss.school_id,
                'private' AS room_type,
				concat(s.name, ' ', sy.short_name) AS private_class,
                u.image_url,
                cc.id as class_id,
                ss.subject_id
			FROM class.class cc  
            INNER JOIN school.class_student cs
            	ON cs.class_id = cc.id
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
            INNER JOIN subject.subject_teacher st
            	ON st.subject_id = ss.subject_id
                   AND st.academic_year = cc.academic_year
            INNER JOIN "user"."user" u
            	ON u.id = st.teacher_id
            WHERE 
            	cc.school_id = $1 
                AND sy.short_name = cc.year
                AND cs.student_id = $2
            GROUP BY 
            	ss.subject_id, sy.short_name, st.academic_year, 
                s.name , ss.school_id, st.teacher_id, 
                u.first_name, u.last_name, u.image_url, cc.id
		),
		cte_private as (
			SELECT 
   				COALESCE(cps.id, ct.teacher_id) as id,
                COALESCE(cps.room_name, concat(u.first_name, ' ', u.last_name)) as room_name,
                COALESCE(cps.school_id, cc.school_id) as school_id,
                COALESCE(cps.room_type, 'private') as room_type,
                COALESCE(cps.image_url, u.image_url) as image_url,
				CASE 
					WHEN  ct.teacher_id IS NOT NULL THEN concat(cc.year, '/', cc.name)
					ELSE NULL   
				END class_name,
          		COALESCE(cps.academic_year, cc.academic_year) as academic_year,
                ARRAY_AGG(
                    DISTINCT CASE 
                        WHEN cps.id IS NOT NULL THEN cps.private_class
                        ELSE NULL 
                    END
                ) AS subject_name,
                ARRAY_AGG(DISTINCT cps.subject_id) AS subject_ids,
          		cps.class_id
			FROM school.class_teacher ct
			FULL JOIN cte_private_subject cps
				ON ct.class_id = cps.class_id 
          		AND ct.teacher_id = cps.id
          	INNER JOIN class.class cc
				ON cc.id = cps.class_id
			
            LEFT JOIN "user".user u
            	ON u.id = ct.teacher_id
            GROUP BY 
              cps.id,
              cps.room_name,
              cps.school_id,
              cps.room_type,
              cps.image_url,
              u.first_name,
              u.last_name,
              cc.school_id,
              cc.academic_year,
              cps.academic_year,
          	  ct.teacher_id,
              u.image_url,
              cc.year,
              cc.name,
              cps.class_id
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
			NULL as image_url,
			s.member_count,
			NULL as class_name,
			NULL::text[] as subject_name,
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
			c.member_count,
			NULL as class_name,
			NULL::text[] as subject_name,
			c.academic_year,
			r.message_id
		FROM cte_class c
		LEFT JOIN cte_recently r
			ON r.school_id = c.school_id AND r.room_type = c.room_type AND r.room_id = c.id
		WHERE true
			AND (SELECT is_enabled FROM chat_configs WHERE chat_level = c.room_type)`

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
			g.member_count,
			NULL as class_name,
			NULL::text[] as subject_name,
			g.academic_year,
			r.message_id
		FROM cte_group g
		LEFT JOIN cte_recently r
			ON r.school_id = g.school_id AND r.room_type = g.room_type AND r.room_id = g.id
		WHERE true
			AND (SELECT is_enabled FROM chat_configs WHERE chat_level = g.room_type)`

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
			NULL as member_count,
			p.class_name,
			p.subject_name,
			p.academic_year,
			r.message_id
		FROM cte_private p
		LEFT JOIN cte_recently r
			ON r.school_id = p.school_id 
            AND ((r.receiver_id = $2 AND r.sender_id = p.id) OR 
                 (r.receiver_id = p.id AND r.sender_id = $2))
		WHERE true
			AND (SELECT is_enabled FROM chat_configs WHERE chat_level = r.room_type)
			AND NOT (r.receiver_id = $2 AND r.content = '_init_')
	`

	// var baseQuery string
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
		privateQuery += fmt.Sprintf(`
		ORDER BY p.id, p.academic_year desc`)
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
	`)

	if filter.Search != "" {
		args = append(args, filter.Search)
		query += fmt.Sprintf(` WHERE room_name ILIKE '%%' || $%d || '%%'`, argsIndex)
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

	var ChatList []*constant.ChatListStudent
	err = postgresRepository.Database.Select(&ChatList, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return ChatList, nil
}
