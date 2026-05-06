package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d01-teacher-dashboard-v1/constant"
)

func (postgresRepository *postgresRepository) GetClassStudents(classIds, studyGroupIds []int) (entities []constant.ClassStudentEntity, err error) {
	query := `
		SELECT DISTINCT ON ("cs"."student_id")
			cs.*
		FROM
			school.class_student as cs
		LEFT JOIN class.study_group_student sgs
			ON sgs.student_id = cs.student_id
		WHERE
			cs.class_id = ANY($1)
	`
	args := []interface{}{classIds}
	argsIndex := 2

	if len(studyGroupIds) > 0 {
		query += fmt.Sprintf(" AND sgs.study_group_id = ANY($%d)", argsIndex)
		args = append(args, studyGroupIds)
		argsIndex++
	}

	rows, err := postgresRepository.Database.Queryx(query, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	entities = []constant.ClassStudentEntity{}
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
