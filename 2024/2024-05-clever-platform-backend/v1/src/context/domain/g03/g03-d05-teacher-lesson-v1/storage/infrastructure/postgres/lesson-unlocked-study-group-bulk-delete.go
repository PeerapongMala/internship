package postgres

import (
	"fmt"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) LessonUnlockedStudyGroupBulkDelete(lessonId int, studyGroupIds []int) error {
	args := []interface{}{lessonId}
	placeholders := []string{}

	for i, studyGroupId := range studyGroupIds {
		placeholders = append(placeholders, fmt.Sprintf(`($%d::integer)`, i+2))
		args = append(args, studyGroupId)
	}

	query := fmt.Sprintf(`
		DELETE FROM "school"."lesson_unlocked_for_study_group" lu
		USING (VALUES %s) AS tmp(study_group_id)
		WHERE "lu"."study_group_id" = tmp.study_group_id
		AND "lu"."lesson_id" = $1	
	`, strings.Join(placeholders, ","))

	_, err := postgresRepository.Database.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
