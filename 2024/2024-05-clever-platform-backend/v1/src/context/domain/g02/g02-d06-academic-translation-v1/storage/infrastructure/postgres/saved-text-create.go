package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d06-academic-translation-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SavedTextCreate(tx *sqlx.Tx, savedText *constant.SavedTextEntity) (*constant.SavedTextEntity, error) {
	query := `
		INSERT INTO "curriculum_group"."saved_text" (
			"curriculum_group_id",
			"group_id",
			"language",
			"text",
			"text_to_ai",
			"speech_url",
			"status",
			"created_at",
			"created_by",
			"updated_at",
			"updated_by",
			"admin_login_as"
		)	
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
		RETURNING *
	`
	if savedText.SpeechUrl != nil && *savedText.SpeechUrl == "" {
		savedText.SpeechUrl = nil
	}
	savedTextEntity := constant.SavedTextEntity{}
	err := tx.QueryRowx(
		query,
		savedText.CurriculumGroupId,
		savedText.GroupId,
		savedText.Language,
		savedText.Text,
		savedText.TextToAi,
		savedText.SpeechUrl,
		savedText.Status,
		savedText.CreatedAt,
		savedText.CreatedBy,
		savedText.UpdatedAt,
		savedText.UpdatedBy,
		savedText.AdminLoginAs,
	).StructScan(&savedTextEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &savedTextEntity, nil
}
