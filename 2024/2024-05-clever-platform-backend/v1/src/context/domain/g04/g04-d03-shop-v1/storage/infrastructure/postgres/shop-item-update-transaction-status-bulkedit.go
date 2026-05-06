package postgres

import (
	"fmt"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"
	"github.com/lib/pq"
)

func (postgresRepository *postgresRepository) UpdateShopItemTransactionStatusBulkEdit(items []constant.BulkEditTransactionList) (r []constant.ShopItemTransactionEntity, err error) {
	if len(items) == 0 {
		return r, nil
	}

	var ids []int
	var status []string
	var values []interface{}
	var updatedTime []string
	for _, item := range items {
		ids = append(ids, item.Id)
		status = append(status, ` WHEN id =`+(fmt.Sprintf("%v", item.Id))+` THEN '`+item.Status+`'`)
		if item.Status == "enabled" {
			updatedTime = append(updatedTime, `bought_at = CASE WHEN id =`+(fmt.Sprintf("%v", item.Id))+` THEN NOW() ELSE bought_at END`)
		} else if item.Status == "recalled" {
			updatedTime = append(updatedTime, `recalled_at = CASE WHEN id =`+(fmt.Sprintf("%v", item.Id))+` THEN NOW() ELSE recalled_at END`)
		}
	}
	values = append(values, pq.Array(ids))

	queryUpdate := `
					UPDATE "teacher_store"."teacher_store_transaction"
					SET 
						status = CASE`
	queryUpdate += strings.Join(status, "")
	queryUpdate += ` END`
	queryUpdate += ", " + strings.Join(updatedTime, ", ")
	queryUpdate += ` WHERE id = ANY($1)
					RETURNING *
				`
	rows, err := postgresRepository.Database.Queryx(queryUpdate, values...)
	if err != nil {
		return r, err
	}

	defer rows.Close()
	for rows.Next() {
		var item constant.ShopItemTransactionEntity
		if err := rows.StructScan(&item); err != nil {
			return r, err
		}
		r = append(r, item)
	}

	return r, nil
}
