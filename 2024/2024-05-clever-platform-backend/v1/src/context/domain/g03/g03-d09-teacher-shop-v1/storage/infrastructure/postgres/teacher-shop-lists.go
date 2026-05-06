package postgres

import (
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) TeacherShopLists(pagination *helper.Pagination, filter *constant.TeacherShopListFilter, subjectId int, teacherId string) (r []constant.ShopItemResponse, err error) {

	values := []interface{}{}
	query := `
		SELECT
			t_store.id,
			item.name AS item_name,
			item.description AS item_description,
			t_store.open_date,
			t_store.closed_date,
			t_store.price,
			t_store.stock,
			t_store.initial_stock,
			t_store.status,
			user_1.first_name AS created_by_name,
			user_2.first_name AS updated_by_name,
			t_store.created_at,
			t_store.created_by,
			t_store.updated_at,
			t_store.updated_by,
			t_store.item_id,
			item.type AS item_type,
			t_store.teacher_store_id,
			(
			    SELECT COUNT(*)
			    FROM "teacher_store"."teacher_store_transaction"
			    WHERE "teacher_store_item_id" = t_store.id
			) AS "transaction_count"
		FROM
			"teacher_store"."teacher_store_item" AS t_store
			LEFT JOIN "item"."item" AS item ON t_store.item_id = item.id
			LEFT JOIN "user"."user" AS user_1 ON t_store.created_by = user_1.id
			LEFT JOIN "user"."user" AS user_2 ON t_store.updated_by = user_2.id
		WHERE
			t_store.teacher_store_id = (
				SELECT
					id
				FROM
					"teacher_store"."teacher_store"
				WHERE
					teacher_id = $1
					AND subject_id = $2
			)`
	values = append(values, teacherId, subjectId)
	var condition = ""
	if filter.Type != nil {
		condition += ` AND item.type = $` + strconv.Itoa(len(values)+1)
		values = append(values, filter.Type)
	}

	if filter.Status != nil {
		condition += ` AND t_store.status = $` + strconv.Itoa(len(values)+1)
		values = append(values, filter.Status)
	}

	if filter.SearchText != nil {
		condition += ` AND item.name LIKE $` + strconv.Itoa(len(values)+1)
		values = append(values, "%"+*filter.SearchText+"%")
	}

	query += condition

	if pagination != nil {
		queryCount := `SELECT count(*) FROM (` + query + `)`
		err = postgresRepository.Database.QueryRow(queryCount, values...).Scan(&pagination.TotalCount)
		if err != nil {
			return r, err
		}
		query += ` ORDER BY "item"."id" LIMIT $` + strconv.Itoa(len(values)+1)
		values = append(values, pagination.Limit)
		query += ` OFFSET $` + strconv.Itoa(len(values)+1)
		values = append(values, pagination.Offset)
	}

	err = postgresRepository.Database.Select(&r, query, values...)
	if err != nil {
		return r, err
	}
	return r, nil
}
