package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"

func (postgresRepository *postgresRepository) StudentGet(studentId string, schoolId int) (*constant.StudentGet, error) {
	query := `
	SELECT
 		"u"."id" AS "user_id",
 		"s"."student_id",
 		"u"."title",
 		"u"."first_name",
 		"u"."last_name",
 		"c"."academic_year",
 		"c"."year",
 		"c"."name" AS "class"
	 FROM "user"."student" s
 	LEFT JOIN "user"."user" u
 		ON "s"."user_id" = "u"."id"
 	LEFT JOIN "school"."class_student" cs
		 ON "u"."id" = "cs"."student_id"
 	LEFT JOIN "class"."class" c
 		ON "cs"."class_id" = "c"."id"
     WHERE "u"."id" = $1
	 AND "s"."school_id" = $2

	`
	response := constant.StudentGet{}
	err := postgresRepository.Database.Get(&response, query, studentId, schoolId)
	if err != nil {
		return nil, err
	}
	return &response, nil
}
