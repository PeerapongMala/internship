package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d07-admin-user-account-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentUpdate(tx *sqlx.Tx, student *constant.StudentEntity) (*constant.StudentEntity, error) {
	type QueryMethod func(query string, args ...interface{}) *sqlx.Row
	queryMethod := func() QueryMethod {
		if tx != nil {
			return tx.QueryRowx
		}
		return postgresRepository.Database.QueryRowx
	}()
	baseQuery := `
		UPDATE "user"."student" SET
	`
	query := []string{}
	args := []interface{}{}
	argsIndex := 1
	if student.StudentId != "" {
		query = append(query, fmt.Sprintf(` "student_id" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.StudentId)
	}
	if student.Year != "" {
		query = append(query, fmt.Sprintf(` "year" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.Year)
	}
	if student.BirthDate != nil {
		query = append(query, fmt.Sprintf(` "birth_date" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.BirthDate)
	}
	if student.Nationality != nil {
		query = append(query, fmt.Sprintf(` "nationality" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.Nationality)
	}
	if student.Ethnicity != nil {
		query = append(query, fmt.Sprintf(` "ethnicity" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.Ethnicity)
	}
	if student.Religion != nil {
		query = append(query, fmt.Sprintf(` "religion" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.Religion)
	}
	if student.FatherTitle != nil {
		query = append(query, fmt.Sprintf(` "father_title" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.FatherTitle)
	}
	if student.FatherFirstName != nil {
		query = append(query, fmt.Sprintf(` "father_first_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.FatherFirstName)
	}
	if student.FatherLastName != nil {
		query = append(query, fmt.Sprintf(` "father_last_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.FatherLastName)
	}
	if student.MotherTitle != nil {
		query = append(query, fmt.Sprintf(` "mother_title" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.MotherTitle)
	}
	if student.MotherFirstName != nil {
		query = append(query, fmt.Sprintf(` "mother_first_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.MotherFirstName)
	}
	if student.MotherLastName != nil {
		query = append(query, fmt.Sprintf(` "mother_last_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.MotherLastName)
	}
	if student.ParentRelationship != nil {
		query = append(query, fmt.Sprintf(` "parent_relationship" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.ParentRelationship)
	}
	if student.ParentTitle != nil {
		query = append(query, fmt.Sprintf(` "parent_title" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.ParentTitle)
	}
	if student.ParentFirstName != nil {
		query = append(query, fmt.Sprintf(` "parent_first_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.ParentFirstName)
	}
	if student.ParentLastName != nil {
		query = append(query, fmt.Sprintf(` "parent_last_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.ParentLastName)
	}
	if student.HouseNumber != nil {
		query = append(query, fmt.Sprintf(` "house_number" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.HouseNumber)
	}
	if student.Moo != nil {
		query = append(query, fmt.Sprintf(` "moo" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.Moo)
	}
	if student.District != nil {
		query = append(query, fmt.Sprintf(` "district" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.District)
	}
	if student.SubDistrict != nil {
		query = append(query, fmt.Sprintf(` "sub_district" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.SubDistrict)
	}
	if student.Province != nil {
		query = append(query, fmt.Sprintf(` "province" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.Province)
	}
	if student.PostCode != nil {
		query = append(query, fmt.Sprintf(` "post_code" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.PostCode)
	}
	if student.ParentMaritalStatus != nil {
		query = append(query, fmt.Sprintf(` "parent_marital_status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, student.ParentMaritalStatus)
	}

	studentEntity := constant.StudentEntity{}
	if len(query) > 0 {
		baseQuery += fmt.Sprintf(`%s WHERE "user_id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
		args = append(args, student.UserId)
		err := queryMethod(
			baseQuery,
			args...,
		).StructScan(&studentEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	} else {
		baseQuery = fmt.Sprintf(`
		SELECT
			*
		FROM "user"."student" s
		WHERE
			"s"."user_id" = $1	
	`)
		err := queryMethod(
			baseQuery,
			student.UserId,
		).StructScan(&studentEntity)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
	}
	return &studentEntity, nil
}
