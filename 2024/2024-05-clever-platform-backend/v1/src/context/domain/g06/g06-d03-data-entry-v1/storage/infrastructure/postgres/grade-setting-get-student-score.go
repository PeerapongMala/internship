package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d03-data-entry-v1/constant"

func (postgresRepository *postgresRepository) GradeSettingGetStudentScore(students []int, subLessonIds []int, schoolId int) ([]constant.GradeSettingScore, error) {
	query := `
		SELECT
			"es"."id" AS "evaluation_student_id",
			"l"."sub_lesson_id",
			"l"."level_type",
			"l"."difficulty",
			MAX("lpl"."star") AS "score"
		FROM "grade"."evaluation_student" es
		INNER JOIN "user"."student" s ON "es"."student_id" = "s"."student_id" AND "s"."school_id" = $1
		INNER JOIN "level"."level_play_log" lpl ON "s"."user_id" = "lpl"."student_id"
		INNER JOIN "level"."level" l ON "lpl"."level_id" = "l"."id"
		INNER JOIN "subject"."sub_lesson" sl ON "l"."sub_lesson_id" = "sl"."id"
		WHERE
			"sl"."id" = ANY($2)
			AND "es"."id" = ANY($3)
		GROUP BY "es"."id", "l"."id", "l"."sub_lesson_id", "l"."level_type", "l"."difficulty"
	`
	gradeSettingScore := []constant.GradeSettingScore{}
	err := postgresRepository.Database.Select(&gradeSettingScore, query, schoolId, subLessonIds, students)
	if err != nil {
		return nil, err
	}
	return gradeSettingScore, nil
}
