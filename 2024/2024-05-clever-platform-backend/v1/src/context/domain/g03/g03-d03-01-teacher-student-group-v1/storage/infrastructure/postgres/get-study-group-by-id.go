package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-01-teacher-student-group-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GetStudyGroupById(id int, teacherID string) (*constant.GetStudyGroupByIDResponse, error) {

	query := `
	SELECT 
		sg.id,
		sg.subject_id,
		s."name" AS subject_name,
		sg.class_id,
		c.academic_year AS class_academic_year,
		c."year" AS class_year,
		c."name" AS class_name,
		sg.name, 
		sg.status, 
		sg.created_at,
		sg.created_by, 
		sg.updated_at, 
		sg.updated_by, 
		sg.admin_login_as,
		(
			SELECT COUNT(*)
			FROM "class".study_group_student sgs 
			WHERE sgs.study_group_id = $1
		) AS student_count
	FROM "class".study_group sg
		LEFT JOIN "class".class c on c.id = class_id
		LEFT JOIN school.class_teacher class_teacher ON class_teacher.class_id = c.id
		LEFT JOIN subject.subject s ON s.id = sg.subject_id
	WHERE 
		sg.id = $1
	`

	var studentGroup constant.GetStudyGroupByIDResponse
	err := postgresRepository.Database.QueryRowx(query, id).StructScan(&studentGroup)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &studentGroup, nil
}
