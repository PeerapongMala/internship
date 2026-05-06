package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d05-teacher-lesson-v1/constant"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) LevelUnlockedForStudyGroupCreate(levelUnlockedForStudyGroup []constant.LevelUnlockedForStudyGroup) error {
	query := `
		INSERT INTO "level"."level_unlocked_for_study_group" (
			"level_id",
			"study_group_id",
			"created_at",
			"created_by",
			"admin_login_as"
		)
		VALUES
		
	`
	args := []interface{}{}
	placeholders := []string{}

	for i, record := range levelUnlockedForStudyGroup {
		start := i*5 + 1
		placeholders = append(placeholders, fmt.Sprintf(`($%d, $%d, $%d, $%d, $%d)`, start, start+1, start+2, start+3, start+4))
		args = append(args,
			record.LevelId,
			record.StudyGroupId,
			record.CreatedAt,
			record.CreatedBy,
			record.AdminLoginAs,
		)
	}

	query += fmt.Sprintf(`%s ON CONFLICT ("level_id", "study_group_id") DO NOTHING`, strings.Join(placeholders, ","))

	_, err := postgresRepository.Database.Exec(query, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
