package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g02/g02-d02-global-zone-v1/constant"
)

func (p *postgresRepository) GetSubjectsBySchoolId(userId string) ([]constant.SubjectResponse, error) {
	var subjects []constant.SubjectResponse

	query := `
		WITH current_year AS (
			SELECT
				"c"."year"
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
		SELECT DISTINCT ON ("sub"."id")
			sub.name AS subject_name,
		    sg.seed_subject_group_id,
			sub.id AS subject_id,
			sy."name" AS year_name,
			sy.short_name AS year_short_name,
			cg.name AS curriculum_group_name,
			ss.is_enabled,
			("ss"."is_enabled" = TRUE) AS "is_school_subject_enabled",
			("c"."status" = $2) AS "is_contract_enabled",
			(CURRENT_TIMESTAMP BETWEEN "c"."start_date" AND "c"."end_date") AS "is_in_contract_time",
			("csg"."is_enabled" = TRUE) AS "is_contract_subject_group_enabled",
			("cg"."status" = $2) AS "is_curriculum_group_enabled",
			("p"."status" = $2) AS "is_platform_enabled",
			("y"."status" = $2) AS "is_year_enabled",
			("sg"."status" = $2) AS "is_subject_group_enabled",
			("sub"."status" = $2) AS "is_subject_enabled",
			sub.image_url
		FROM
			"user"."student" stu
		LEFT JOIN
			"school_affiliation"."school_affiliation_school" sas 
			ON stu.school_id = sas.school_id
		LEFT JOIN
			"school_affiliation"."contract" c 
			ON sas.school_affiliation_id = c.school_affiliation_id
		LEFT JOIN
			"school_affiliation"."contract_subject_group" csg 
			ON c.id = csg.contract_id
		LEFT JOIN
			"curriculum_group"."subject_group" sg 
			ON "csg"."subject_group_id" = "sg"."id"	
		LEFT JOIN
			"subject"."subject" sub
			ON "sg"."id" = "sub"."subject_group_id"	
		LEFT JOIN
			"school"."school_subject" ss
			ON "c"."id" = "ss"."contract_id"
			AND "sub"."id" = "ss"."subject_id"
		LEFT JOIN
			"curriculum_group"."year" y
			ON "sg"."year_id" = "y"."id"
		LEFT JOIN
			"curriculum_group"."platform" p
			ON "y"."platform_id" = "p"."id"
		LEFT JOIN	
			"curriculum_group"."curriculum_group" cg
			ON "p"."curriculum_group_id" = "cg"."id"
		LEFT JOIN
			"curriculum_group"."seed_year" sy
			ON "y"."seed_year_id" = "sy"."id"
		LEFT JOIN
			current_year cy
			ON "sy"."short_name" = "cy"."year"
		WHERE
			stu.user_id = $1
			AND "ss"."school_id" = "stu"."school_id"
			AND "sy"."short_name" = "cy"."year"
	`

	err := p.Database.Select(&subjects, query, userId, constant.Enabled)
	if err != nil {
		return nil, err
	}

	return subjects, nil
}
