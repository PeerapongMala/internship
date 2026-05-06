package postgres

import "time"

func (postgresRepository *postgresRepository) SubLessonFileStatusUpdate(subLessonId int, status bool, userId string, updatedAt *time.Time) error {
	query := `
		INSERT INTO "subject"."sub_lesson_file_status" (
			"sub_lesson_id",
		    "is_updated",
		    "updated_at",
			"updated_by"
		)
		VALUES ($1, $2, $3, $4)
		ON CONFLICT ("sub_lesson_id")
		DO UPDATE SET
    		"is_updated" = EXCLUDED."is_updated",
    		"updated_at" = EXCLUDED."updated_at",
    		"updated_by" = EXCLUDED."updated_by"
	`
	_, err := postgresRepository.Database.Exec(query, subLessonId, status, updatedAt, userId)
	if err != nil {
		return err
	}

	return nil
}
