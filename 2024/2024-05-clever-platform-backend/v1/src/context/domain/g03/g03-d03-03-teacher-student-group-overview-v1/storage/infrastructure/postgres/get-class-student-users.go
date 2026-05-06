package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/constant"

func (postgresRepository postgresRepository) GetClassStudentUsers(classId int) (entities []constant.UserEntity, err error) {
	query := `
		SELECT
			"uu".*
		FROM
			"school"."class_student" scs
				LEFT JOIN "user"."user" uu
					ON "scs"."student_id" = "uu"."id"
		WHERE
			class_id = $1
	`
	rows, err := postgresRepository.Database.Queryx(query, classId)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.UserEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
