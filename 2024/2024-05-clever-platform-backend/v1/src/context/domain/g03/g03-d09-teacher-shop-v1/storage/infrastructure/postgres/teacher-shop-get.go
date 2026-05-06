package postgres

import (
	"log"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
)

func (postgresRepository *postgresRepository) TeacherShopGet(storeItemId int, teacherId string, subjectId int) (r constant.ShopItemResponse, err error) {
	query := `
		SELECT 
			t_store.id,
			item.name as item_name,
			item.description as item_description,
			item.image_url as image_url,
			t_store.open_date,
			t_store.closed_date,
			t_store.price,
			t_store.stock,
			t_store.initial_stock,
			t_store.limit_per_user,
			t_store.status,
			user_1.first_name as created_by_name,
			user_2.first_name as updated_by_name,
			t_store.created_at,
			t_store.created_by,
			t_store.updated_at,
			t_store.updated_by,
			t_store.item_id,
			item.type as item_type,
			(
			    SELECT COUNT(*)
			    FROM "teacher_store"."teacher_store_transaction"
			    WHERE "teacher_store_item_id" = t_store.id
			) AS "transaction_count"
		FROM "teacher_store"."teacher_store_item" as t_store
		LEFT JOIN "item"."item" as item
			ON t_store.item_id = item.id
		LEFT JOIN "user"."user" as user_1
			ON t_store.created_by = user_1.id
		LEFT JOIN "user"."user" as user_2
			ON t_store.updated_by = user_2.id
		WHERE
			t_store.id = $1`

	if err = postgresRepository.Database.QueryRowx(query, storeItemId).StructScan(&r); err != nil {
		log.Printf("err : %s", err.Error())
		return r, err
	}

	query = `
		SELECT	
			c."id",
			c."academic_year",
			c."name" AS "class_name",
			c."year" AS "class_year",
			COUNT(DISTINCT "cs"."student_id") AS "student_count"
		FROM
		    "teacher_store"."class_teacher_shop" cts
		INNER JOIN "class"."class" c ON "cts"."class_id" = "c"."id"
		LEFT JOIN "school"."class_student" cs ON "c"."id" = "cs"."class_id"
		WHERE
			"teacher_shop_item_id" = $1
		GROUP BY "c"."id"
	`
	classes := []constant.Class{}
	if err = postgresRepository.Database.Select(&classes, query, storeItemId); err != nil {
		log.Printf("err : %s", err.Error())
		return r, err
	}
	r.Classes = classes

	query = `
		SELECT	
			"sg"."id",
			"sg"."name" AS "study_group_name",
			"c"."name" AS "class_name",
			"c"."year" AS "class_year",
			COUNT(DISTINCT "sgs"."student_id") AS "student_count"
		FROM
		    "teacher_store"."study_group_teacher_shop" sgts
		INNER JOIN "class"."study_group" sg ON "sgts"."study_group_id" = "sg"."id"
		INNER JOIN "class"."class" c ON "sg"."class_id" = "c"."id"
		LEFT JOIN "class"."study_group_student" sgs ON "sg"."id" = "sgs"."study_group_id"
		WHERE
			"teacher_shop_item_id" = $1
		GROUP BY "sg"."id", "sg"."name", "c"."name", "c"."year"
	`
	studyGroups := []constant.StudyGroup{}
	if err = postgresRepository.Database.Select(&studyGroups, query, storeItemId); err != nil {
		log.Printf("err : %s", err.Error())
		return r, err
	}
	r.StudyGroups = studyGroups

	query = `
		SELECT	
			"u"."id" AS "user_id",
			"stu"."student_id",
			"u"."title",
			"u"."first_name",
			"u"."last_name",
			"u"."last_login"
		FROM
		    "teacher_store"."student_teacher_shop" sts
		INNER JOIN "user"."user" u ON "sts"."user_id" = "u"."id"
		INNER JOIN "user"."student" stu ON "u"."id" = "stu"."user_id"
		WHERE
			"teacher_shop_item_id" = $1
		GROUP BY "u"."id", "stu"."student_id"
	`
	students := []constant.Student{}
	if err = postgresRepository.Database.Select(&students, query, storeItemId); err != nil {
		log.Printf("err : %s", err.Error())
		return r, err
	}
	r.Students = students

	return r, nil
}
