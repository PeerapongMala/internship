package postgres

import (
	"strconv"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"
	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/core/helper"
)

func (postgresRepository *postgresRepository) GetShopItemLists(pagination *helper.Pagination, filter *constant.ShopItemListFilter) (r []constant.ShopItemResponse, err error) {
	query := `
				SELECT t_store.id, item.name as item_name, item.description as item_description, t_store.open_date, t_store.closed_date,
				t_store.price, t_store.stock, t_store.initial_stock, t_store.status, 
				user_1.first_name as created_by_name, user_2.first_name as updated_by_name, t_store.created_at, t_store.created_by,
				t_store.updated_at, t_store.updated_by, t_store.item_id, item.type as item_type
				FROM "teacher_store"."teacher_store_item" as t_store
				LEFT JOIN "item"."item" as item ON t_store.item_id = item.id
				LEFT JOIN "user"."user" as user_1 ON t_store.created_by = user_1.id
				LEFT JOIN "user"."user" as user_2 ON t_store.updated_by = user_2.id
				`
	values := []interface{}{}
	var condition = ""
	if filter.Type != nil {
		if condition == "" {
			condition += ` WHERE item.type = $` + strconv.Itoa(len(values)+1)
		} else {
			condition += ` AND item.type = $` + strconv.Itoa(len(values)+1)
		}
		values = append(values, filter.Type)
	}
	if filter.Status != nil {
		if condition == "" {
			condition += ` WHERE t_store.status = $` + strconv.Itoa(len(values)+1)
		} else {
			condition += ` AND t_store.status = $` + strconv.Itoa(len(values)+1)
		}
		values = append(values, filter.Status)
	}

	if filter.SearchText != nil {
		if condition == "" {
			condition += ` WHERE item.name LIKE $` + strconv.Itoa(len(values)+1)
		} else {
			condition += ` AND item.name LIKE $` + strconv.Itoa(len(values)+1)
		}
		values = append(values, "%"+*filter.SearchText+"%")
	}
	query += condition

	queryCount := `SELECT count(*) FROM (` + query + `)`
	err = postgresRepository.Database.QueryRow(queryCount, values...).Scan(&pagination.TotalCount)
	if err != nil {
		return r, err
	}

	if pagination != nil {
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
