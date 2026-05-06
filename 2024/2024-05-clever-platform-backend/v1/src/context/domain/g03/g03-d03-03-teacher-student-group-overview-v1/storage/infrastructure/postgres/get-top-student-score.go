package postgres

import (
	"fmt"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d03-03-teacher-student-group-overview-v1/constant"
)

func (postgresRepository postgresRepository) GetTopStudentScore(classId int, studyGroupId int, filter constant.TopStudentScoreFilter) (entities []constant.StudentScoreEntity, err error) {
	// get best star per level for each user
	args := []interface{}{}
	argsIndex := 1

	subQuery := `
		SELECT 
			"sgs"."student_id", "llpl"."level_id", MAX("llpl"."star") AS best_score
		FROM 
		    "class"."study_group" sg 
		INNER JOIN "class"."study_group_student" sgs ON "sg"."id" = "sgs"."study_group_id"
		LEFT JOIN "level"."level_play_log" llpl ON "sgs"."student_id" = "llpl"."student_id"
	`

	if filter.StartAt != nil {
		subQuery += fmt.Sprintf(` AND "llpl"."played_at" >= $%d`, argsIndex)
		args = append(args, filter.StartAt)
		argsIndex++
	}
	if filter.EndAt != nil {
		subQuery += fmt.Sprintf(` AND "llpl"."played_at" <= $%d`, argsIndex)
		args = append(args, filter.EndAt)
		argsIndex++
	}

	subQuery += `
		LEFT JOIN "level"."level" ll ON "llpl"."level_id" = "ll"."id"
	`
	if len(filter.SubLessonIds) > 0 {
		subQuery += fmt.Sprintf(` AND "ll"."sub_lesson_id" = ANY($%d)`, argsIndex)
		args = append(args, filter.SubLessonIds)
		argsIndex++
	}

	subQuery += fmt.Sprintf(`
		WHERE "sg"."id" = $%d
	`, argsIndex)
	args = append(args, studyGroupId)

	subQuery += ` GROUP BY "sgs"."student_id", "llpl"."level_id"`

	mainQuery := fmt.Sprintf(`	
		SELECT
			CONCAT("uu"."first_name", ' ', "uu".last_name) AS full_name,
			"uu"."id",
			COALESCE(SUM("best_scores"."best_score"), 0) as sum
		FROM
			(%s) best_scores
		INNER JOIN "user"."user" uu ON "uu"."id" = "best_scores"."student_id"
		GROUP BY "uu"."id"
		ORDER BY sum DESC
	`, subQuery)
	args = append(args)
	argsIndex++

	limit := 10
	if filter.Limit != nil {
		limit = *filter.Limit
	}

	mainQuery += fmt.Sprintf(` LIMIT $%d`, argsIndex)
	args = append(args, limit)
	argsIndex++

	rows, err := postgresRepository.Database.Queryx(mainQuery, args...)
	if err != nil {
		return
	}
	defer rows.Close()

	for rows.Next() {
		item := constant.StudentScoreEntity{}
		err = rows.StructScan(&item)
		if err != nil {
			return
		}
		entities = append(entities, item)
	}
	return
}
