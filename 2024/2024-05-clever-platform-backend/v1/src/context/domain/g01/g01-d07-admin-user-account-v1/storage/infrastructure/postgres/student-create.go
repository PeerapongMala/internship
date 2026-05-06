package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentCreate(tx *sqlx.Tx, student *constant.StudentEntity) (*constant.StudentEntity, error) {
	type QueryMethod func(query string, args ...interface{}) *sqlx.Row
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.QueryRowx
		}
		return postgresRepository.Database.QueryRowx
	}()
	query := `
		INSERT INTO "user"."student" (
			"user_id",
			"school_id",
			"student_id",
			"year",
			"birth_date",
			"nationality",
			"ethnicity",
			"religion",
			"father_title",
			"father_first_name",
			"father_last_name",
			"mother_title",
			"mother_first_name",
			"mother_last_name",
			"parent_relationship",
			"parent_title",
			"parent_first_name",
			"parent_last_name",
			"house_number",
			"moo",
			"district",
			"sub_district",
			"province",
			"post_code",
			"parent_marital_status"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
		RETURNING *;
	`
	studentEntity := constant.StudentEntity{}
	err := queryMethod(
		query,
		student.UserId,
		student.SchoolId,
		student.StudentId,
		student.Year,
		student.BirthDate,
		student.Nationality,
		student.Ethnicity,
		student.Religion,
		student.FatherTitle,
		student.FatherFirstName,
		student.FatherLastName,
		student.MotherTitle,
		student.MotherFirstName,
		student.MotherLastName,
		student.ParentRelationship,
		student.ParentTitle,
		student.ParentFirstName,
		student.ParentLastName,
		student.HouseNumber,
		student.Moo,
		student.District,
		student.SubDistrict,
		student.Province,
		student.PostCode,
		student.ParentMaritalStatus,
	).StructScan(&studentEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &studentEntity, nil
}
