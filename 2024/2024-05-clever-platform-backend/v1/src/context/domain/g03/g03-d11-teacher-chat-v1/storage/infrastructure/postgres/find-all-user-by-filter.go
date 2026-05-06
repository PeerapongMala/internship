package postgres

import (
	"log"

	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherChatRepository) FindAllUsersByFilter(schoolID int, roomType string, roomID string) ([]*string, error) {
	subjectQuery := `
		with cte_subject_student AS (
			SELECT 
  				cs.student_id as user_id
			FROM school.school_subject ss
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
            INNER JOIN school.class_student cs
            	ON cc.id = cs.class_id
			WHERE 
            	ss.school_id = $1 AND
				s.status = 'enabled' AND
				ss.is_enabled = true 
  				AND s.id = $2
		),
 		cte_subject_teacher AS (
			SELECT 
             	u.id as user_id
            FROM school.school_subject ss
            INNER JOIN subject.subject_teacher st
                ON ss.subject_id = st.subject_id
  			INNER JOIN "user"."user" u
  				ON u.id = st.teacher_id
            INNER JOIN subject.subject s
				ON ss.subject_id = s.id
            INNER JOIN curriculum_group.subject_group sg
				ON sg.id = s.subject_group_id
            INNER JOIN curriculum_group.year y
            	ON sg.year_id = y.id
            INNER JOIN curriculum_group.seed_year sy
            	ON y.seed_year_id = sy.id
  			WHERE 
  				s.status = 'enabled'
  				AND s.id = $2
   				AND ss.school_id = $1
		)
		SELECT st.user_id
		FROM cte_subject_teacher st
		UNION ALL
		SELECT ss.user_id
		FROM cte_subject_student ss
	`

	classQuery :=
		`
		with cte_class_teacher as (
			SELECT 
				ct.teacher_id as user_id
			FROM class.class cc
			INNER JOIN school.class_teacher ct
				ON cc.id = ct.class_id
			WHERE 
				cc.school_id = $1
				AND cc.id = $2
		),
		cte_class_student as (
			SELECT 
				cs.student_id as user_id
			FROM class.class cc
			INNER JOIN school.class_student cs
				ON cc.id = cs.class_id
			WHERE 
				cc.school_id = $1
				AND cc.id = $2
		)
		SELECT
			user_id
		FROM cte_class_teacher 
		UNION ALL
		SELECT
			user_id
		FROM cte_class_student
	`

	groupQuery :=
		`
		with cte_group_teacher as (
			SELECT 
				u.id AS user_id
			FROM school.school_subject ss
			INNER JOIN subject.subject_teacher st
				ON ss.subject_id = st.subject_id
			INNER JOIN "user"."user" u
				ON u.id = st.teacher_id
			INNER JOIN subject.subject s
				ON ss.subject_id = s.id
			INNER JOIN curriculum_group.subject_group sg
				ON sg.id = s.subject_group_id
			INNER JOIN curriculum_group.year y
				ON sg.year_id = y.id
			INNER JOIN curriculum_group.seed_year sy
				ON y.seed_year_id = sy.id
			INNER JOIN class.study_group stg
				ON stg.subject_id = s.id
			WHERE 
				s.status = 'enabled'
				AND stg.id = $2
				AND ss.school_id = $1
		),
		cte_group_student as (
			SELECT 
				sgs.student_id AS user_id
			FROM school.school_subject ss
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
			INNER JOIN class.study_group stg
				ON stg.class_id = cc.id
				AND stg.subject_id = s.id
			INNER JOIN class.study_group_student sgs
				ON stg.id = sgs.study_group_id
			WHERE 
				ss.school_id = $1
				AND s.status = 'enabled'
				AND ss.is_enabled = true
				AND stg.id = $2
		)
		SELECT
			user_id
		FROM cte_group_teacher 
		UNION ALL
		SELECT
			user_id
		FROM cte_group_student
	`

	var query string
	switch roomType {
	case "subject":
		query = subjectQuery
	case "class":
		query = classQuery
	case "group":
		query = groupQuery
	}

	args := []interface{}{schoolID, roomID}
	users := []*string{}
	err := postgresRepository.Database.Select(&users, query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return users, nil
}
