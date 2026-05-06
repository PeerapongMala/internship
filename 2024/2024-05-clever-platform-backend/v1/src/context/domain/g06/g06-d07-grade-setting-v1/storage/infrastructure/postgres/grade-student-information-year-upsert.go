package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g06/g06-d07-grade-setting-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) GradeStudentInformationUpsert(
	tx *sqlx.Tx,
	schoolID int,
	academicYear, year, schoolRoom string,
	entity *constant.EvaluationStudent,
) error {
	formIDs, err := postgresRepository.getFormIDs(tx, schoolID, academicYear, year, schoolRoom)
	if err != nil {
		return err
	}

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
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
			$11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
			$21, $22, $23, $24, $25, $26, $27, $28, $29, $30
		)
		ON CONFLICT (form_id, citizen_no) DO UPDATE
		SET
			student_id = EXCLUDED.student_id,
			gender = EXCLUDED.gender,
			title = EXCLUDED.title,
			thai_first_name = EXCLUDED.thai_first_name,
			thai_last_name = EXCLUDED.thai_last_name,
			eng_first_name = EXCLUDED.eng_first_name,
			eng_last_name = EXCLUDED.eng_last_name,
			birth_date = EXCLUDED.birth_date,
			ethnicity = EXCLUDED.ethnicity,
			nationality = EXCLUDED.nationality,
			religion = EXCLUDED.religion,
			parent_marital_status = EXCLUDED.parent_marital_status,
			father_title = EXCLUDED.father_title,
			father_first_name = EXCLUDED.father_first_name,
			father_last_name = EXCLUDED.father_last_name,
			mother_title = EXCLUDED.mother_title,
			mother_first_name = EXCLUDED.mother_first_name,
			mother_last_name = EXCLUDED.mother_last_name,
			guardian_relation = EXCLUDED.guardian_relation,
			guardian_title = EXCLUDED.guardian_title,
			guardian_first_name = EXCLUDED.guardian_first_name,
			guardian_last_name = EXCLUDED.guardian_last_name,
			address_no = EXCLUDED.address_no,
			address_moo = EXCLUDED.address_moo,
			address_sub_district = EXCLUDED.address_sub_district,
			address_district = EXCLUDED.address_district,
			address_province = EXCLUDED.address_province,
			address_postal_code = EXCLUDED.address_postal_code
	`

	for _, formID := range formIDs {
		_, err = tx.Exec(
			query,
			formID,
			entity.CitizenNo,
			entity.StudentID,
			entity.Gender,
			entity.Title,
			entity.ThaiFirstName,
			entity.ThaiLastName,
			entity.EngFirstName,
			entity.EngLastName,
			entity.BirthDate,
			entity.Ethnicity,
			entity.Nationality,
			entity.Religion,
			entity.ParentMaritalStatus,
			entity.FatherTitle,
			entity.FatherFirstName,
			entity.FatherLastName,
			entity.MotherTitle,
			entity.MotherFirstName,
			entity.MotherLastName,
			entity.GuardianRelation,
			entity.GuardianTitle,
			entity.GuardianFirstName,
			entity.GuardianLastName,
			entity.AddressNo,
			entity.AddressMoo,
			entity.AddressSubDistrict,
			entity.AddressDistrict,
			entity.AddressProvince,
			entity.AddressPostalCode,
		)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	return nil
}

func (postgresRepository *postgresRepository) getFormIDs(tx *sqlx.Tx, schoolID int, academicYear, year, schoolRoom string) (formIDs []int, err error) {
	rows, err := tx.Query(`SELECT id FROM grade.evaluation_form
          WHERE school_id = $1 AND academic_year = $2 AND year = $3 AND school_room = $4 AND is_archived IS FALSE`,
		schoolID,
		academicYear,
		year,
		schoolRoom,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var formID int
		if err := rows.Scan(&formID); err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		formIDs = append(formIDs, formID)
	}

	if err = rows.Err(); err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	if len(formIDs) == 0 {
		return nil, fmt.Errorf("not found form id in school %d", schoolID)
	}

	return formIDs, nil
}
