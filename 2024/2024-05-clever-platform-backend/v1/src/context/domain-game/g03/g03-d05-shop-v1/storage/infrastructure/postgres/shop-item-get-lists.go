package postgres

import (
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain-game/g03/g03-d05-shop-v1/constant"
)

func (postgresRepository *postgresRepository) GetShopItemLists(subjectId int, t string, studentId string, classId int, studyGroupIds []int) (r []constant.ShopItem, err error) {
	query := `
		WITH "student_school" AS (
			SELECT
				"school_id"
			FROM "user"."student" stu
			WHERE "stu"."user_id" = $4
		),
		items AS (
				SELECT
					tsi.id,
					tsi.stock,
					tsi.initial_stock,
					tsi.price,
					i.id AS item_id, 
					i."name",
					i.description,
					i.image_url,
					b.template_path,
					b.badge_description
				FROM
					teacher_store.teacher_store_item tsi
					LEFT JOIN item.item i ON tsi.item_id = i.id
					LEFT JOIN item.badge b ON i.id = b.item_id
					LEFT JOIN teacher_store.teacher_store ts ON tsi.teacher_store_id = ts.id
					LEFT JOIN "school"."school_teacher" sct ON "sct"."user_id" = "ts"."teacher_id" 
					LEFT JOIN "student_school" ss ON "sct"."school_id" = "ss"."school_id"
					LEFT JOIN subject.subject_teacher st ON ts.subject_id = st.subject_id AND ts.teacher_id = st.teacher_id
					LEFT JOIN "teacher_store"."class_teacher_shop" cts ON "tsi"."id" = "cts"."teacher_shop_item_id"
					LEFT JOIN "teacher_store"."study_group_teacher_shop" sgts ON "tsi"."id" = "sgts"."teacher_shop_item_id"
					LEFT JOIN "teacher_store"."student_teacher_shop" sts ON "tsi"."id" = "sts"."teacher_shop_item_id"
				WHERE
					tsi.status = $1
					AND (
						tsi.teacher_store_id IS NULL
						OR (st.subject_id = $2 AND "sct"."school_id" = "ss"."school_id")
					)
					AND (
						NOW() >= tsi.open_date
						AND (NOW() <= tsi.closed_date OR closed_date IS NULL)
					)
				  	AND (
				  	    tsi.stock > 0
				  	    OR tsi.initial_stock = -1
				  	    OR tsi.initial_stock IS NULL
					)
					AND i."type" = $3
					AND (
					    (sts.user_id IS NULL AND sgts.study_group_id IS NULL AND cts.class_id IS NULL)
					    OR (sts.user_id = $4 OR sgts.study_group_id = ANY($5) OR cts.class_id = $6)
					)
			),
			inventory_items AS (
				SELECT
					ii.item_id,
					ii.amount,
					ii.is_equipped
				FROM
					inventory.inventory_item ii
					LEFT JOIN inventory.inventory i ON ii.inventory_id = i.id
					LEFT JOIN item.item it ON ii.item_id = it.id
				WHERE
					i.student_id = $4
			)
		SELECT DISTINCT ON ("items"."id")
			items.*,
			ii.amount,
			COALESCE(is_equipped, FALSE) AS is_equipped,
			CASE
				WHEN ii.item_id IS NOT NULL THEN TRUE
				ELSE FALSE
			END AS is_bought
		FROM
			items
			LEFT JOIN inventory_items ii ON items.item_id = ii.item_id
		ORDER BY "items"."id" DESC
	`

	err = postgresRepository.Database.Select(&r, query, "enabled", subjectId, t, studentId, studyGroupIds, classId)
	if err != nil {
		return r, err
	}
	return r, nil

}
