package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d01-grade-template-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) GradeTemplateInsert(tx *sqlx.Tx, entity *constant.GradeTemplateEntity) (insertId int, err error) {
	
	query := `
		INSERT INTO grade.template (
			"school_id",
			"year",
			"template_name",
			"active_flag",
			"version",
			"status",
			"created_at",
			"created_by",
			"updated_at",
			"updated_by",
			"admin_login_as"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id;
	`

	err = tx.QueryRowx(
		query,
		entity.SchoolId,
		entity.Year,
		entity.TemplateName,
		entity.ActiveFlag,
		entity.Version,
		entity.Status,
		entity.CreatedAt,
		entity.CreatedBy,
		entity.UpdatedAt,
		entity.UpdatedBy,
		entity.AdminLoginAs,
	).Scan(&insertId)
	
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, err
	}

	return insertId, nil
}
