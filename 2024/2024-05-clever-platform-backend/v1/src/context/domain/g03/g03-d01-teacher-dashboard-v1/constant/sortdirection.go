package constant

import "errors"

type SortDirection string

const (
	Asc  SortDirection = "ASC"
	Desc SortDirection = "DESC"
)

func (dir SortDirection) IsValid() error {
	switch dir {
	case Asc,
		Desc:
		return nil
	}
	return errors.New("invalid type of SortDirection")
}
