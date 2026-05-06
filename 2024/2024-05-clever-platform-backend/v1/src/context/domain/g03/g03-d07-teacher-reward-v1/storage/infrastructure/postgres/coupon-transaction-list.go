package postgres

import (
	"fmt"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d07-teacher-reward-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) CouponTransactionList(filter *constant.CouponTransactionFilter, pagination *helper.Pagination) ([]constant.CouponTransaction, error) {
	query := `
		WITH "target_students" AS (
			SELECT
				"cs"."student_id"
			FROM "subject"."subject_teacher" st
			INNER JOIN "subject"."subject" s ON "st"."subject_id" = "s"."id"
			INNER JOIN "curriculum_group"."subject_group" sg ON "s"."subject_group_id" = "sg"."id"
			INNER JOIN "curriculum_group"."year" y ON "sg"."year_id" = "y"."id"
			INNER JOIN "curriculum_group"."seed_year" sy ON "y"."seed_year_id" = "sy"."id"
			INNER JOIN "school"."class_teacher"  ct ON "ct"."teacher_id" = $1
			INNER JOIN "class"."class" c ON "sy"."short_name" = "c"."year"
			INNER JOIN "school"."school_teacher" sct ON "c"."school_id" = "sct"."school_id" 
			INNER JOIN "school"."class_student" cs ON "c"."id" = "cs"."class_id"
			WHERE	
				"st"."teacher_id" = $1 AND "sct"."user_id" = $1
		)
		SELECT DISTINCT ON ("ct"."id")
		    "ct"."id",
			"i"."name" AS "reward_name",
			"u"."title",
			"u"."first_name",
			"u"."last_name",
			"c"."year",
			"c"."name" AS "class",
			"ct"."created_at",
			"ct"."status"
		FROM
			"target_students" ts
		INNER JOIN "teacher_item"."coupon_transaction" ct ON "ts"."student_id" = "ct"."user_id"
		INNER JOIN "user"."user" u ON "ct"."user_id" = "u"."id"
		INNER JOIN "item"."item" i ON "ct"."item_id" = "i"."id"
		INNER JOIN "class"."class" c ON "ct"."class_id" = "c"."id"
		WHERE TRUE
	`
	args := []interface{}{filter.TeacherId}
	argsIndex := len(args) + 1

	if filter.AcademicYear != 0 {
		query += fmt.Sprintf(` AND "c"."academic_year" = $%d`, argsIndex)
		args = append(args, filter.AcademicYear)
		argsIndex++
	}
	if filter.Year != "" {
		query += fmt.Sprintf(` AND "c"."year" = $%d`, argsIndex)
		args = append(args, filter.Year)
		argsIndex++
	}
	if filter.ClassId != 0 {
		query += fmt.Sprintf(` AND "c"."id" = $%d`, argsIndex)
		args = append(args, filter.ClassId)
		argsIndex++
	}
	if filter.SearchText != "" {
		query += fmt.Sprintf(` AND ("i"."name" ILIKE $%d OR "u"."first_name" ILIKE $%d OR "u"."last_name" ILIKE $%d)`, argsIndex, argsIndex, argsIndex)
		args = append(args, "%"+filter.SearchText+"%")
		argsIndex++
	}
	if filter.Status != "" {
		query += fmt.Sprintf(` AND "ct"."status" = $%d`, argsIndex)
		args = append(args, filter.Status)
		argsIndex++
	}

	if pagination != nil {
		countQuery := fmt.Sprintf(`SELECT COUNT(*) FROM (%s)`, query)
		err := postgresRepository.Database.QueryRowx(
			countQuery,
			args...,
		).Scan(&pagination.TotalCount)
		if err != nil {
			log.Printf("%+v", errors.WithStack(err))
			return nil, err
		}
		query += fmt.Sprintf(` ORDER BY "ct"."id" DESC OFFSET $%d LIMIT $%d`, argsIndex, argsIndex+1)
		args = append(args, pagination.Offset, pagination.Limit)
	}

	transactions := []constant.CouponTransaction{}
	err := postgresRepository.Database.Select(&transactions, query, args...)
	if err != nil {
		return transactions, err
	}

	return transactions, nil
}
