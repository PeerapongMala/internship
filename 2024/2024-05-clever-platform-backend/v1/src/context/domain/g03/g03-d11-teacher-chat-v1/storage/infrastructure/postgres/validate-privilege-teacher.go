package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d11-teacher-chat-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherChatRepository) ValidatePrivilegeTeacher(req *constant.ValidateRequest) (bool, error) {
	query_subject := `
		SELECT EXISTS (
			SELECT 1
			FROM school.school_subject ss
			INNER JOIN subject.subject_teacher st
				ON ss.subject_id = st.subject_id
			where ss.school_id = $1 AND 
				  st.teacher_id = $2 AND 
				  ss.subject_id = $3
		)
	`

	query_class := `
		SELECT EXISTS (
			SELECT 1
			FROM class.class cc
			INNER JOIN school.class_teacher ct
				ON cc.id = ct.class_id
			WHERE cc.school_id = $1 AND 
				  ct.teacher_id = $2 AND
				  cc.id = $3
		)
	`

	query_group := `
		SELECT EXISTS (
			SELECT 1
  			FROM class.class cc
			INNER JOIN class.study_group sg
  				ON cc.id = sg.class_id
			INNER JOIN subject.subject_teacher st
  				ON sg.subject_id = st.subject_id
			WHERE cc.school_id = $1 AND 
  				  st.teacher_id = $2 AND 
  				  sg.id = $3
		)
	`

	query_private := `
		SELECT EXISTS (
			SELECT 1 
			FROM user.student st
			WHERE st.school_id = $1 AND 
				  st.user_id = $3
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
