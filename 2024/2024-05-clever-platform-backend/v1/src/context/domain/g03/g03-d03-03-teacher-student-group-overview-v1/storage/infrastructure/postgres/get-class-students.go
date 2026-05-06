package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/constant"

func (postgresRepository postgresRepository) GetClassStudents(classId int) (entities []constant.ClassStudentEntity, err error) {
	query := `
		SELECT
			*
		FROM
			"school"."class_student"
		WHERE
			class_id = $1
	`

	rows, err := postgresRepository.Database.Queryx(query, classId)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.ClassStudentEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}

	return
}
