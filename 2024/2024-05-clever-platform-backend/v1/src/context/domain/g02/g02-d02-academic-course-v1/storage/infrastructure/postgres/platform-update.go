package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g02/g02-d02-academic-course-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) PlatformUpdate(tx *sqlx.Tx, platform *constant.PlatformEntity) (*constant.PlatformEntity, error) {
	var queryMethod func(query string, args ...interface{}) *sqlx.Row
	if tx == nil {
		queryMethod = postgresRepository.Database.QueryRowx
	} else {
		queryMethod = tx.QueryRowx
	}

	baseQuery := `
		UPDATE "curriculum_group"."platform"
		SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if platform.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, platform.Status)
	}
	if platform.SeedPlatformId != 0 {
		query = append(query, fmt.Sprintf(` "seed_platform_id" = $%d`, argsIndex))
		argsIndex++
		args = append(args, platform.SeedPlatformId)
	}
	if !platform.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, platform.UpdatedAt)
	}
	if platform.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, platform.UpdatedBy)
	}
	query = append(query, fmt.Sprintf(` "admin_login_as" = $%d`, argsIndex))
	argsIndex++
	args = append(args, platform.AdminLoginAs)

	baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, platform.Id)

	platformEntity := constant.PlatformEntity{}
	err := queryMethod(
		baseQuery,
		args...,
	).StructScan(&platformEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &platformEntity, nil
}
