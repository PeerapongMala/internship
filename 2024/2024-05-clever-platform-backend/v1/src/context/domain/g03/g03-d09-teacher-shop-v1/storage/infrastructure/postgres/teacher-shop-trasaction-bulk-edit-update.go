package postgres

import (
	"fmt"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g03/g03-d09-teacher-shop-v1/constant"
	"github.com/lib/pq"
)

func (postgresRepository *postgresRepository) TeacherShopTransactionUpdateStatusBulkEdit(items []constant.BulkEditTransactionList) (r []constant.ShopItemTransactionEntity, err error) {
	if len(items) == 0 {
		return r, err
	}

	var ids []int
	var status []string
	var values []interface{}
	var updateTimeField string
	for _, item := range items {
		ids = append(ids, item.Id)
		status = append(status, ` WHEN id =`+(fmt.Sprintf("%v", item.Id))+` THEN '`+item.Status+`'`)
		if item.Status == "enabled" {
			updateTimeField = "bought_at"
		} else if item.Status == "recalled" {
			updateTimeField = "recalled_at"
		}
	}
	values = append(values, pq.Array(ids))

	queryUpdate := `
					UPDATE "teacher_store"."teacher_store_transaction"
					SET 
						status = CASE`
	queryUpdate += strings.Join(status, "")
	queryUpdate += ` END, `
	queryUpdate += updateTimeField + ` = NOW()`
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
