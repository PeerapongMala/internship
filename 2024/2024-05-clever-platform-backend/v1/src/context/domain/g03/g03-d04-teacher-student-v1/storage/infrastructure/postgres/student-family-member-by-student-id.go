package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d04-teacher-student-v1/constant"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresTeacherStudentRepository) StudentFamilyMemberByStudentId(studentId string) ([]constant.StudentFamilyEntity, error) {
	sql := `
		WITH const_traget_family AS ( 
			SELECT 
				id,
				fm.user_id
			FROM "family"."family" f
			LEFT JOIN "family".family_member fm ON fm.family_id = f.id
			LEFT JOIN "user".student s ON s.user_id = fm.user_id
			WHERE s.user_id = $1
		)
		SELECT 
			family_id,
			user_id,
			is_owner,
			title,
			first_name,
			last_name
		FROM "family".family_member fm
		LEFT JOIN "user"."user" u ON u.id = fm.user_id
		WHERE family_id =
			(SELECT id
			FROM const_traget_family)
		AND user_id !=
			(SELECT user_id
			FROM const_traget_family)
		ORDER BY is_owner DESC
	`

	studentFamilyMembers := []constant.StudentFamilyEntity{}
	err := postgresRepository.Database.Select(&studentFamilyMembers, sql, studentId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return studentFamilyMembers, err
	}

	return studentFamilyMembers, nil
}
