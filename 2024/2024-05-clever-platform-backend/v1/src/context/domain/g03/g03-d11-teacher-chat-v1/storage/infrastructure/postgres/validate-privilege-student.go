package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherChatRepository) ValidatePrivilegeStudent(req *constant.ValidateRequest) (bool, error) {
	query_subject := `
		SELECT EXISTS (
			SELECT 1
			FROM "user".student st
			INNER JOIN school.class_student cs
				ON st.user_id = cs.student_id
			INNER JOIN class.class cc
				ON cs.class_id = cc.id
			INNER JOIN school.school_subject ss
				ON cc.school_id = ss.school_id
			WHERE cc.school_id = $1 AND 
				  st.user_id = $2 AND 
				  ss.subject_id = $3
		)
	`

	query_class := `
		SELECT EXISTS (
			SELECT 1
			FROM "user".student st
			INNER JOIN school.class_student cs
				ON st.user_id = cs.student_id
            INNER JOIN class.class cc
            	ON cs.class_id = cc.id
			WHERE cc.school_id = $1 AND 
  				  st.user_id = $2 AND 
  				  cs.class_id = $3
		)
	`

	query_group := `
		SELECT EXISTS (
			SELECT 1
			FROM "user".student st
			INNER JOIN class.study_group_student sgs
				ON st.user_id = sgs.student_id
            INNER JOIN class.study_group sg
            	ON sg.id = sgs.study_group_id
            INNER JOIN class.class cc
            	ON cc.id = sg.class_id              
			WHERE cc.school_id = $1 AND 
				  st.user_id = $2 AND 
				  sg.id = $3
		)
	`

	query_private := `
		SELECT EXISTS (
			SELECT 1 
			FROM school.school_teacher st
			WHERE st.school_id = $1 AND st.user_id = $3
		)

	`

	var query string
	switch req.RoomType {
	case "subject":
		query = query_subject
	case "class":
		query = query_class
	case "group":
		query = query_group
	case "private":
		query = query_private
	}

	args := []interface{}{req.SchoolID, req.UserID, req.OtherID}
	var exists bool
	err := postgresRepository.Database.QueryRowx(query, args...).Scan(&exists)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return false, err
	}
	return exists, nil
}
