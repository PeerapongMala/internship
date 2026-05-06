package helper

import (
	"log"

	"github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
)

func HashAndSalt(password string) (*string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("%+v", errors.WithStack(err))
		return nil, err
	}
	hashString := string(hash)
	return &hashString, nil
}

func ValidatePassword(hashedPassword, password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
	return err == nil
}
