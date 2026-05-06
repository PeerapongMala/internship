package postgres

import (
	"fmt"
	"log"
	"strings"

	"github.com/ZettaMerge/2024-05-clever-platform-backend/src/context/domain/g04/g04-d03-shop-v1/constant"
	"github.com/lib/pq"
)

func (postgresRepository *postgresRepository) UpdateShopItemStatusBulkEdit(items []constant.BulkEditList, updateBy string) (r []constant.ShopItemEntity, err error) {
	if len(items) == 0 {
		return r, nil
	}

	var ids []int
	var status []string
	var values []interface{}

	for _, item := range items {
		ids = append(ids, item.Id)
		status = append(status, ` WHEN id =`+(fmt.Sprintf("%v", item.Id))+` THEN '`+item.Status+`'`)
	}
	values = append(values, updateBy, pq.Array(ids))

	queryUpdate := `UPDATE 
						"teacher_store"."teacher_store_item"
					SET 
						status = CASE`
	queryUpdate += strings.Join(status, "")
	queryUpdate += ` END,
						updated_by= $1,
						updated_at = NOW()
					WHERE id = ANY($2)
					RETURNING *
				`

	rows, err := postgresRepository.Database.Queryx(queryUpdate, values...)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	for rows.Next() {
		var item constant.ShopItemEntity
		if err := rows.StructScan(&item); err != nil {
			return r, err
		}
		r = append(r, item)
	}

	return r, nil
}
