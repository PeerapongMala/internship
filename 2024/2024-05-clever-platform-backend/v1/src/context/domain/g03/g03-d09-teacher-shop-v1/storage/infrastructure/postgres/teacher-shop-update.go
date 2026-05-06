package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
	"log"
	"strings"
)

func (postgresRepository *postgresRepository) TeacherShopUpdate(tx *sqlx.Tx, storeItemId int, itemId int, c constant.ShopItemRequest) (err error) {
	if c.Name != "" || c.Description != "" {
		baseQuery := `
			UPDATE "item"."item" SET
		`
		query := []string{}
		args := []interface{}{}
		argsIndex := 1

		if c.Name != "" {
			query = append(query, fmt.Sprintf(` "name" = $%d`, argsIndex))
			argsIndex++
			args = append(args, c.Name)
		}
		if c.Description != "" {
			query = append(query, fmt.Sprintf(` "description" = $%d`, argsIndex))
			argsIndex++
			args = append(args, c.Description)
		}
		if c.ImageKey != nil {
			query = append(query, fmt.Sprintf(` "image_url" = $%d`, argsIndex))
			argsIndex++
			args = append(args, c.ImageKey)
		}
		baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d`, strings.Join(query, ","), argsIndex)
		args = append(args, itemId)

		_, err := tx.Exec(baseQuery, args...)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return err
		}
	}

	baseQuery := `
		UPDATE "teacher_store"."teacher_store_item" SET
			"initial_stock" = $1,
			"stock" = $1,
			"limit_per_user" = $2,
			"open_date" = $3,
			"closed_date" = $4,	
	`
	query := []string{}
	args := []interface{}{c.InitialStock, c.LimitPerUser, c.OpenDate, c.ClosedDate}
	argsIndex := len(args) + 1

	if c.Price != 0 {
		query = append(query, fmt.Sprintf(` "price" = $%d`, argsIndex))
		argsIndex++
		args = append(args, c.Price)
	}
	if c.Status != "" {
		query = append(query, fmt.Sprintf(` "status" = $%d`, argsIndex))
		argsIndex++
		args = append(args, c.Status)
	}

	baseQuery += fmt.Sprintf(`%s WHERE "id" = $%d`, strings.Join(query, ","), argsIndex)
	args = append(args, storeItemId)

	_, err = tx.Exec(baseQuery, args...)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}

	deleteQuery := `
			DELETE FROM "teacher_store"."student_teacher_shop"
			WHERE "teacher_shop_item_id" = $1
		`
	_, err = tx.Exec(deleteQuery, storeItemId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	if len(c.StudentIds) > 0 {
		insertQuery := `
			INSERT INTO "teacher_store"."student_teacher_shop" (
				"teacher_shop_item_id",
				"user_id"
			)
			VALUES ($1, $2)
		`
		for _, studentId := range c.StudentIds {
			_, err := tx.Exec(insertQuery, storeItemId, studentId)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
		}
	}

	deleteQuery = `
			DELETE FROM "teacher_store"."study_group_teacher_shop"
			WHERE "teacher_shop_item_id" = $1
		`
	_, err = tx.Exec(deleteQuery, storeItemId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	if len(c.StudyGroupIds) > 0 {
		insertQuery := `
			INSERT INTO "teacher_store"."study_group_teacher_shop" (
				"teacher_shop_item_id",
				"study_group_id"
			)
			VALUES ($1, $2)
		`
		for _, studyGroupId := range c.StudyGroupIds {
			_, err := tx.Exec(insertQuery, storeItemId, studyGroupId)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
		}
	}

	deleteQuery = `
			DELETE FROM "teacher_store"."class_teacher_shop"
			WHERE "teacher_shop_item_id" = $1
		`
	_, err = tx.Exec(deleteQuery, storeItemId)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return err
	}
	if len(c.ClassIds) > 0 {
		insertQuery := `
			INSERT INTO "teacher_store"."class_teacher_shop" (
				"teacher_shop_item_id",
				"class_id"
			)
			VALUES ($1, $2)
		`
		for _, classId := range c.ClassIds {
			_, err := tx.Exec(insertQuery, storeItemId, classId)
			if err != nil {
				log.Printf("%+v", errors.WithStack(err))
				return err
			}
		}
	}

	return nil
}
