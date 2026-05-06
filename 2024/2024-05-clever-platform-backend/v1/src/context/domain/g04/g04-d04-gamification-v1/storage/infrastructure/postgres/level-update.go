package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d04-gamification-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) LevelUpdate(tx *sqlx.Tx, level *constant.LevelEntity) error {
	baseQuery := `
		UPDATE "level"."level" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if !level.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, level.UpdatedAt)
	}
	if level.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, level.UpdatedBy)
	}

	baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d`, strings.Join(query, ","), argsIndex)
	args = append(args, level.Id)

	_, err := tx.Exec(baseQuery, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
