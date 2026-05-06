package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) ClassLessonIdList(classId int) (lessonIds []int, err error) {
	query := `
-- 		SELECT
-- 			COUNT(*)
-- 		FROM "school"."school" sc
-- 		INNER JOIN "school_affiliation"."school_affiliation_school" sas ON "sc"."id" = "sas"."school_id"
-- 		INNER JOIN "school_affiliation"."contract" c ON sas.school_affiliation_id = c.school_affiliation_id
-- 		INNER JOIN "school_affiliation"."contract_subject_group" csg ON c.id = csg.contract_id
-- 		INNER JOIN "curriculum_group"."subject_group" sg ON "csg"."subject_group_id" = "sg"."id"	
-- 		INNER JOIN "subject"."subject" sub ON "sg"."id" = "sub"."subject_group_id"
-- 		INNER JOIN "school"."school_subject" ss
-- 			ON "c"."id" = "ss"."contract_id" 
-- 			AND "sub"."id" = "ss"."subject_id"
-- 		INNER JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
-- 		INNER JOIN "curriculum_group"."platform" p ON "y"."platform_id" = "p"."id"
-- 		INNER JOIN "curriculum_group"."curriculum_group" cg ON "p"."curriculum_group_id" = "cg"."id"
		SELECT
			DISTINCT "sl"."lesson_id"
		FROM
		    "school"."school_lesson" sl
		INNER JOIN "subject"."lesson" ls ON "sl"."lesson_id" = "ls"."id"
		INNER JOIN "class"."class" c ON "c"."id" = $1
		INNER JOIN "subject"."subject" s ON "ls"."subject_id" = "s"."id"
		INNER JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"	
		INNER JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
		INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
		WHERE
			"sl"."class_id" = $1
			AND "c"."year" = "sy"."short_name"
	`
	err = postgresRepository.Database.Select(&lessonIds, query, classId)
	if err != nil {
		log.Println("%+v", errors.WithStack(err))
		return lessonIds, err
	}

	return lessonIds, nil
}
