package postgres

import (
	"time"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/constant"
)

func (postgresRepository postgresRepository) GetLastLoggedInStudents(studyGroupId int, startAt time.Time, endAt time.Time) (entities []constant.UserEntity, err error) {
	query := `
		SELECT
			"uu".*
		FROM
			"school"."class_student" scs
				LEFT JOIN "user"."user" uu ON "scs"."student_id" = "uu"."id"
				LEFT JOIN class.study_group_student sgs
					ON sgs.student_id = uu.id
		WHERE
			sgs.study_group_id = $1 AND
			"uu"."last_login" >= $2 AND
			"uu"."last_login" <= $3 
		ORDER BY "uu"."last_login" DESC
	`
	args := []interface{}{studyGroupId, startAt, endAt}

	rows, err := postgresRepository.Database.Queryx(query, args...)
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
