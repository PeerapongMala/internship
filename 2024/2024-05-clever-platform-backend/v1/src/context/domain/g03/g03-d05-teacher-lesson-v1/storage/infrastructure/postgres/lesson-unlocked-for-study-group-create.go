package postgres

import (
	"fmt"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) LessonUnlockedForStudyGroupCreate(lessonId int, studyGroupIds []int) error {
	if len(studyGroupIds) == 0 {
		return nil
	}
	query := `
		INSERT INTO "school"."lesson_unlocked_for_study_group" (
			"study_group_id",
			"lesson_id",
			"lock"
		)
		VALUES 
	`
	args := []interface{}{}
	placeholders := []string{}

	for i, studyGroupId := range studyGroupIds {
		start := i*3 + 1
		placeholders = append(placeholders, fmt.Sprintf(`($%d, $%d, $%d)`, start, start+1, start+2))
		args = append(args,
			studyGroupId,
			lessonId,
			false,
		)
	}

	query += fmt.Sprintf(`%s ON CONFLICT ("study_group_id", "lesson_id") DO NOTHING`, strings.Join(placeholders, ","))

	_, err := postgresRepository.Database.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
