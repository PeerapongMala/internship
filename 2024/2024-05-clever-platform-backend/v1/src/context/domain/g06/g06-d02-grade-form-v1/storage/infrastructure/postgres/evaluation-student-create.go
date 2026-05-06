package postgres

import (
	"log"

	constant2 "github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) EvaluationStudentCreate(tx *sqlx.Tx, students []constant2.EvaluationStudent) error {

	query := `
		INSERT INTO grade.evaluation_student (
			form_id,
			citizen_no,
			student_id,
			gender,
			title,
			thai_first_name,
			thai_last_name,
			eng_first_name,
			eng_last_name,
			birth_date,
			ethnicity,
			nationality,
			religion,
			parent_marital_status,
			father_title,
			father_first_name,
			father_last_name,
			mother_title,
			mother_first_name,
			mother_last_name,
			guardian_relation,
			guardian_title,
			guardian_first_name,
			guardian_last_name,
			address_no,
			address_moo,
			address_sub_district,
			address_district,
			address_province,
			address_postal_code 
		)
		VALUES (
			:form_id,
			:citizen_no,
			:student_id,
			:gender,
			:title,
			:thai_first_name,
			:thai_last_name,
			:eng_first_name,
			:eng_last_name,
			:birth_date,
			:ethnicity,
			:nationality,
			:religion,
			:parent_marital_status,
			:father_title,
			:father_first_name,
			:father_last_name,
			:mother_title,
			:mother_first_name,
			:mother_last_name,
			:guardian_relation,
			:guardian_title,
			:guardian_first_name,
			:guardian_last_name,
			:address_no,
			:address_moo,
			:address_sub_district,
			:address_district,
			:address_province,
			:address_postal_code
		)
	`

	_, err := tx.NamedExec(query, students)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	return nil
}
