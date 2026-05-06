package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/pkg/errors"
	"log"
)

func (postgresRepository *postgresRepository) TeacherShopItemGet(teacherShopItemId int) (*constant.ShopItem, error) {
	query := `
		SELECT 
			"ts"."subject_id",
			"i"."id" AS "item_id",
			"i"."name",
			"i"."description",
			"i"."image_url",
			"i"."image_url" AS "image_key",
			"tsi"."initial_stock",
			"tsi"."limit_per_user",
			"tsi"."price",
			"tsi"."open_date",
			"tsi"."closed_date",
			"tsi"."status"
		FROM
			"teacher_store"."teacher_store_item" tsi
		INNER JOIN "item"."item" i ON "tsi"."item_id" = "i"."id"
		INNER JOIN "teacher_store"."teacher_store" ts ON "tsi"."teacher_store_id" = "ts"."id"
		LEFT JOIN "teacher_store"."class_teacher_shop" cts ON "tsi"."id" = "cts"."teacher_shop_item_id"
		LEFT JOIN "teacher_store"."study_group_teacher_shop" sgts ON "tsi"."id" = "sgts"."teacher_shop_item_id"
		LEFT JOIN "teacher_store"."student_teacher_shop" sts ON "tsi"."id" = "sts"."teacher_shop_item_id"
		WHERE "tsi"."id" = $1
		GROUP BY 
			"tsi"."id",
			"ts"."subject_id",
			"i"."id",
			"i"."name",
			"i"."description",
			"i"."image_url",
			"tsi"."initial_stock",
			"tsi"."price",
			"tsi"."open_date",
			"tsi"."closed_date",
			"tsi"."status"
	`
	teacherShopItem := constant.ShopItem{}
	err := postgresRepository.Database.QueryRowx(query, teacherShopItemId).StructScan(&teacherShopItem)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
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
	if err = postgresRepository.Database.Select(&classes, query, teacherShopItemId); err != nil {
		log.Printf("err : %s", err.Error())
		return &teacherShopItem, err
	}
	teacherShopItem.ClassIds = classes

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
	if err = postgresRepository.Database.Select(&studyGroups, query, teacherShopItemId); err != nil {
		log.Printf("err : %s", err.Error())
		return &teacherShopItem, err
	}
	teacherShopItem.StudyGroupIds = studyGroups

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
	if err = postgresRepository.Database.Select(&students, query, teacherShopItemId); err != nil {
		log.Printf("err : %s", err.Error())
		return &teacherShopItem, err
	}
	teacherShopItem.StudentIds = students

	return &teacherShopItem, nil
}
