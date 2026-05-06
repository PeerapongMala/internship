package postgres

import "log"

func (postgresRepository *postgresRepository) StudyGroupGetByUserId(userId string) ([]int, error) {
	query := `
		WITH current_class AS (
			SELECT
				"c"."id"
			FROM
				"user"."student" s
			LEFT JOIN
       			"school"."class_student" cs
       			ON "cs"."student_id" = "s"."user_id"
			LEFT JOIN
       			"class"."class" c
       			ON "cs"."class_id" = "c"."id"
			WHERE
				"s"."user_id" = $1
				AND "c"."academic_year" = (
					SELECT
						MAX("c2"."academic_year")
					FROM
						"user"."student" s2
					LEFT JOIN "school"."class_student" cs2
						ON "cs2"."student_id" = "s2"."user_id"
					LEFT JOIN "class"."class" c2
						ON "cs2"."class_id" = "c2"."id"
					WHERE
						"s2"."user_id" = $1
				)
		)
		SELECT DISTINCT ON ("sg"."id")
			"sg"."id"
		FROM current_class cc
		INNER JOIN "class"."study_group" sg ON "cc"."id" = "sg"."class_id"
		INNER JOIN "class"."class" c ON "sg"."class_id" = "c"."id"
		INNER JOIN "class"."study_group_student" sgs ON "sg"."id" = "sgs"."study_group_id"
		WHERE "sgs"."student_id" = $1
	`
	studyGroupIds := []int{}
	err := postgresRepository.Database.Select(&studyGroupIds, query, userId)
	if err != nil {
		log.Printf("%+v", err)
		return nil, err
	}
	return studyGroupIds, nil
}
