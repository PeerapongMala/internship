package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentUpdate(tx *sqlx.Tx, studentData *constant.StudentDataEntity) (*constant.StudentDataEntity, error) {
	baseQuery := `
		UPDATE "user"."user" SET
	`

	query := []string{}
	args := []interface{}{}
	argsIndex := 1

	if studentData.Email != nil {
		query = append(query, fmt.Sprintf(` "email" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.Email)
	}
	if studentData.Title != "" {
		query = append(query, fmt.Sprintf(` "title" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.Title)
	}
	if studentData.FirstName != "" {
		query = append(query, fmt.Sprintf(` "first_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.FirstName)
	}
	if studentData.LastName != "" {
		query = append(query, fmt.Sprintf(` "last_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.LastName)
	}
	if studentData.IdNumber != nil {
		query = append(query, fmt.Sprintf(` "id_number" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.IdNumber)
	}
	if studentData.ImageUrl != nil {
		query = append(query, fmt.Sprintf(` "image_url" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.ImageUrl)
	}
	if studentData.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.Status)
	}
	if !studentData.UpdatedAt.IsZero() {
		query = append(query, fmt.Sprintf(` "updated_at" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.UpdatedAt)
	}
	if studentData.UpdatedBy != nil {
		query = append(query, fmt.Sprintf(` "updated_by" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.UpdatedBy)
	}
	if studentData.LastLogin != nil {
		query = append(query, fmt.Sprintf(` "last_login" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.LastLogin)
	}

	baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, studentData.Id)

	userEntity := constant.UserEntity{}
	err := tx.QueryRowx(
		baseQuery,
		args...,
	).StructScan(&userEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	baseQuery = `
		UPDATE "user"."student" SET	
	`
	query = []string{}
	args = []interface{}{}
	argsIndex = 1

	if studentData.StudentId != "" {
		query = append(query, fmt.Sprintf(` "student_id" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.StudentId)
	}
	if studentData.Year != "" {
		query = append(query, fmt.Sprintf(` "year" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.Year)
	}
	if studentData.BirthDate != nil && !studentData.BirthDate.IsZero() {
		query = append(query, fmt.Sprintf(` "birth_date" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.BirthDate)
	}
	if studentData.Nationality != nil {
		query = append(query, fmt.Sprintf(` "nationality" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.Nationality)
	}
	if studentData.Ethnicity != nil {
		query = append(query, fmt.Sprintf(` "ethnicity" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.Ethnicity)
	}
	if studentData.Religion != nil {
		query = append(query, fmt.Sprintf(` "religion" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.Religion)
	}
	if studentData.FatherTitle != nil {
		query = append(query, fmt.Sprintf(` "father_title" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.FatherTitle)
	}
	if studentData.FatherFirstName != nil {
		query = append(query, fmt.Sprintf(` "father_first_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.FatherFirstName)
	}
	if studentData.FatherLastName != nil {
		query = append(query, fmt.Sprintf(` "father_last_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.FatherLastName)
	}
	if studentData.MotherTitle != nil {
		query = append(query, fmt.Sprintf(` "mother_title" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.MotherTitle)
	}
	if studentData.MotherFirstName != nil {
		query = append(query, fmt.Sprintf(` "mother_first_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.MotherFirstName)
	}
	if studentData.MotherLastName != nil {
		query = append(query, fmt.Sprintf(` "mother_last_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.MotherLastName)
	}
	if studentData.ParentMaritalStatus != nil {
		query = append(query, fmt.Sprintf(` "parent_marital_status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.ParentMaritalStatus)
	}
	if studentData.ParentRelationship != nil {
		query = append(query, fmt.Sprintf(` "parent_relationship" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.ParentRelationship)
	}
	if studentData.ParentTitle != nil {
		query = append(query, fmt.Sprintf(` "parent_title" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.ParentTitle)
	}
	if studentData.ParentFirstName != nil {
		query = append(query, fmt.Sprintf(` "parent_first_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.ParentFirstName)
	}
	if studentData.ParentLastName != nil {
		query = append(query, fmt.Sprintf(` "parent_last_name" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.ParentLastName)
	}
	if studentData.HouseNumber != nil {
		query = append(query, fmt.Sprintf(` "house_number" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.HouseNumber)
	}
	if studentData.Moo != nil {
		query = append(query, fmt.Sprintf(` "moo" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.Moo)
	}
	if studentData.District != nil {
		query = append(query, fmt.Sprintf(` "district" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.District)
	}
	if studentData.SubDistrict != nil {
		query = append(query, fmt.Sprintf(` "sub_district" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.SubDistrict)
	}
	if studentData.Province != nil {
		query = append(query, fmt.Sprintf(` "province" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.Province)
	}
	if studentData.PostCode != nil {
		query = append(query, fmt.Sprintf(` "post_code" = $%d`, argsIndex))
		argsIndex++
		args = append(args, studentData.PostCode)
	}
	baseQuery += fmt.Sprintf(`%s WHERE "user_id" = $%d RETURNING *`, strings.Join(query, ","), argsIndex)
	args = append(args, studentData.Id)

	if len(query) == 0 {
		baseQuery = `
			SELECT
				*
			FROM
				"user"."student"
			WHERE
			    "user_id" = $1
`
		args = []interface{}{studentData.Id}
	}

	studentEntity := constant.StudentEntity{}
	err = tx.QueryRowx(
		baseQuery,
		args...,
	).StructScan(&studentEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &constant.StudentDataEntity{
		UserEntity:    &userEntity,
		StudentEntity: &studentEntity,
	}, nil
}
