package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d05-academic-level-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) SavedTextUpdate(tx *sqlx.Tx, savedText *constant.SavedTextEntity) (*constant.SavedTextEntity, error) {
	var QueryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx != nil {
		QueryMethod = tx.QueryRowx
	} else {
		QueryMethod = postgresRepository.Database.QueryRowx
	}
	baseQuery := `
		UPDATE "curriculum_group"."saved_text" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if savedText.Text != nil {
		query = append(query, fmt.Sprintf(` "text" = $%d`, argsIndex))
		argsIndex++
		args = append(args, savedText.Text)
	}
	if savedText.TextToAi != nil {
		query = append(query, fmt.Sprintf(` "text_to_ai" = $%d`, argsIndex))
		argsIndex++
		args = append(args, savedText.TextToAi)
	}
	if savedText.SpeechUrl != nil {
		query = append(query, fmt.Sprintf(` "speech_url" = $%d`, argsIndex))
		argsIndex++
		args = append(args, savedText.SpeechUrl)
	}
	if savedText.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, savedText.Status)
	}
	if savedText.UpdatedAt != nil && !savedText.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, savedText.UpdatedAt)
	}
	if savedText.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, savedText.UpdatedBy)
	}

	query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
	argsIndex++
	args = append(args, savedText.AdminLoginAs)

	savedTextEntity := constant.SavedTextEntity{}
	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
		args = append(args, savedText.Id)
		log.Println(savedText.Id)
		err := QueryMethod(baseQuery, args...).StructScan(&savedTextEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	} else {
		baseQuery = `
			SELECT
				*
			FROM "curriculum_group"."saved_text"
			WHERE
				"id" = $1
		`
		err := QueryMethod(baseQuery, savedText.Id).StructScan(&savedTextEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}

	return &savedTextEntity, nil
}
