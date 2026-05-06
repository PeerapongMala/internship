package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g01/g01-d04-admin-school-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

func (postgresRepository *postgresRepository) StudentCreate(tx *sqlx.Tx, studentData *constant.StudentDataEntity) (*constant.StudentDataEntity, error) {
	query := `
		INSERT INTO "user"."user" (
			"id",
			"email",
			"title",
			"first_name",	
			"last_name",
			"id_number",
			"image_url",
			"status",
			"created_at",
			"created_by",
			"updated_at",
			"updated_by",
			"last_login"
		)	
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
		RETURNING *
	`
	userEntity := constant.UserEntity{}
	err := tx.QueryRowx(
		query,
		studentData.Id,
		studentData.Email,
		studentData.Title,
		studentData.FirstName,
		studentData.LastName,
		studentData.IdNumber,
		studentData.ImageUrl,
		studentData.Status,
		studentData.CreatedAt,
		studentData.CreatedBy,
		studentData.UpdatedAt,
		studentData.UpdatedBy,
		studentData.LastLogin,
	).StructScan(&userEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query = `
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
			"parent_marital_status",
			"parent_title",
			"parent_first_name",
			"parent_last_name",
			"parent_relationship",
			"house_number",
			"moo",
			"district",
			"sub_district",
			"province",
			"post_code"
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25)
		RETURNING *
	`
	studentEntity := constant.StudentEntity{}
	err = tx.QueryRowx(
		query,
		userEntity.Id,
		studentData.SchoolId,
		studentData.StudentId,
		studentData.Year,
		studentData.BirthDate,
		studentData.Nationality,
		studentData.Ethnicity,
		studentData.Religion,
		studentData.FatherTitle,
		studentData.FatherFirstName,
		studentData.FatherLastName,
		studentData.MotherTitle,
		studentData.MotherFirstName,
		studentData.MotherLastName,
		studentData.ParentMaritalStatus,
		studentData.ParentTitle,
		studentData.ParentFirstName,
		studentData.ParentLastName,
		studentData.ParentRelationship,
		studentData.HouseNumber,
		studentData.Moo,
		studentData.District,
		studentData.SubDistrict,
		studentData.Province,
		studentData.PostCode,
	).StructScan(&studentEntity)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query = `
		INSERT INTO "user"."user_role" (
			"user_id",
			"role_id"
		)	
		VALUES	
			($1, $2)
	`
	_, err = tx.Exec(query, userEntity.Id, constant.Student)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query = `
		INSERT INTO "inventory"."inventory" (
			"student_id",
			"gold_coin",
			"arcade_coin",
			"ice"
		)
		VALUES ($1, $2, $3, $4)
		RETURNING "id"
	`

	var inventoryId int
	err = tx.QueryRowx(
		query,
		studentEntity.UserId,
		0,
		0,
		0,
	).Scan(&inventoryId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	query = `
		INSERT INTO "inventory"."inventory_avatar" (
		    "inventory_id",
			"avatar_id",
			"is_equipped"
		)
		VALUES ($1, $2, $3)
	`
	_, err = tx.Exec(
		query,
		inventoryId,
		1,
		true,
	)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}

	return &constant.StudentDataEntity{
		UserEntity:    &userEntity,
		StudentEntity: &studentEntity,
	}, nil
}
