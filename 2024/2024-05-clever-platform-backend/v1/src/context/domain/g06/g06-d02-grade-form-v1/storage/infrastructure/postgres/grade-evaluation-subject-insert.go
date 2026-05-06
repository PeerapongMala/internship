package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d02-grade-form-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) EvaluationFormSubjectInsert(tx *sqlx.Tx, entity *constant.GradeEvaluationFormSubjectEntity) (insertId int, err error) {

	query := `
		INSERT INTO grade.evaluation_form_subject (
			"form_id",
			"template_subject_id",
			"clever_subject_template_id",
			"subject_no",
			"learning_area",
			"credits",
			"is_extra",
			"subject_name",
			"is_clever",
			"clever_subject_id",
			"hours"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING id;
	`

	err = tx.QueryRowx(
		query,
		entity.FormId,
		entity.SubjectTemplateId,
		entity.CleverSubjectTemplateId,
		entity.SubjectNo,
		entity.LearningArea,
		entity.Credits,
		entity.IsExtra,
		entity.SubjectName,
		entity.IsClever,
		entity.CleverSubjectId,
		entity.Hours,
	).Scan(&insertId)

	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return insertId, err
	}

	return insertId, nil
}
