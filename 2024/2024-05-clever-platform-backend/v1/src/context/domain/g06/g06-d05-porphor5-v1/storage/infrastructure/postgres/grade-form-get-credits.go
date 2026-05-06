package postgres

import (
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GradeFormGetCredits(formId int) (int, int, error) {
	query := `
		SELECT
			COALESCE(SUM(CASE WHEN COALESCE("ts"."is_extra", FALSE) = FALSE THEN "ts"."credits" END), 0) AS "normal_credits",
			COALESCE(SUM(CASE WHEN COALESCE("ts"."is_extra", FALSE) = TRUE THEN "ts"."credits" END), 0) AS "extra_credits"
		FROM "grade"."evaluation_form_subject" efs
		INNER JOIN "grade"."template_subject" ts ON "efs"."template_subject_id" = "ts"."id"
		WHERE "efs"."form_id" = $1
	`
	normalCredits, extraCredits := 0, 0
	err := postgresRepository.Database.QueryRowx(query, formId).Scan(&normalCredits, &extraCredits)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return 0, 0, err
	}
	return normalCredits, extraCredits, nil
}
