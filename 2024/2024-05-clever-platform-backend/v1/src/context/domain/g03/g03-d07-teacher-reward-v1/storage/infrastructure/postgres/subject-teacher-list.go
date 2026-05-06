package postgres

import "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"

func (postgresRepository *postgresRepository) GetSubjectByTeacherId(teacherId string) ([]constant.SubjectTeacher, error) {
	query := `
	SELECT
	"sj"."id",
	"sj"."name"
	FROM "subject"."subject_teacher" st
	LEFT JOIN "subject"."subject" sj
	ON "st"."subject_id" = "sj"."id"
	WHERE "st"."teacher_id" = $1
	`
	response := []constant.SubjectTeacher{}
	err := postgresRepository.Database.Select(&response, query, teacherId)
	if err != nil {
		return nil, err
	}
	return response, nil
}
