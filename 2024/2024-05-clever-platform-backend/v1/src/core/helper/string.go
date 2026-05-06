package helper

import (
	"log"
	"net/url"
	"reflect"

	"github.com/pkg/errors"
)

func UnescapeStringFields(request any) error {
	rv := reflect.ValueOf(request).Elem()
	rt := rv.Type()
	for i := 0; i < rv.NumField(); i++ {
		if rt.Field(i).Type.Kind() == reflect.String {
			orig := rv.Field(i).String()
			unescaped, err := url.QueryUnescape(orig)
			if err != nil {
				log.Printf("query unescape error for field %s : %+v", rt.Field(i).Name, errors.WithStack(err))
				return errors.Wrapf(err, "unescape field: %s", rt.Field(i).Name)
			}
			rv.Field(i).SetString(unescaped)
		}
	}
	return nil
}
