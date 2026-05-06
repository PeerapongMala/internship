package core

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"strings"
	"time"

	"github.com/jmoiron/sqlx"
)

var MockFileSelected = []string{
	"1-question-demo-mock.sql",
	"2-admin-demo-mock.sql",
	"4-level-reward-homework-mock.sql",
	"5-mock-grade-data-entry.sql",
	"6-school-subject-student-inventory.sql",
	"7-seed-subject-reward.sql",
	"8-coupon-coupon.sql",
	"mock-add-teacher-school.sql",
	"mock-school-affiliation.sql",
}

var MockFileAfterCSV = []string{
	"mock-student-with-play-log.sql",
}

func autoMigrateDB(db *sqlx.DB, port string) {

	autoMigrate := os.Getenv("AUTO_MIGRATE")
	if autoMigrate != "true" {
		return
	}

	fmt.Println("Auto migrating database...")
	currentDir, err := os.Getwd()
	if err != nil {
		log.Fatalf("unable to get current directory: %v", err)
	}

	dir, err := os.ReadDir(fmt.Sprintf("%s/src/context/domain/migration/postgres", currentDir))
	if err != nil {
		log.Fatalf("unable to get current directory: %v", err)
	}

	migrationPaths := []string{
		fmt.Sprintf("%s/src/context/domain/migration/postgres/helper/0-delete-all-schema.sql", currentDir),
	}

	for _, file := range dir {
		if strings.Contains(file.Name(), ".sql") {
			migrationPaths = append(migrationPaths, fmt.Sprintf("%s/src/context/domain/migration/postgres/%s", currentDir, file.Name()))
		}
	}

	migrationMockPath := []string{}
	migrationMockAfterCSV := []string{}
	for _, fileName := range MockFileSelected {
		migrationMockPath = append(migrationMockPath, fmt.Sprintf("%s/src/context/domain/migration/postgres/helper/%s", currentDir, fileName))
	}

	for _, fileName := range MockFileAfterCSV {
		migrationMockAfterCSV = append(migrationMockAfterCSV, fmt.Sprintf("%s/src/context/domain/migration/postgres/helper/%s", currentDir, fileName))
	}

	progressBar := func(current, total int) {
		percentage := float64(current) / float64(total) * 100
		barLength := 50
		progress := int(percentage / 100 * float64(barLength))
		fmt.Printf("\r[%-*s] %.2f%%", barLength, strings.Repeat("=", progress)+">", percentage)
	}

	total := len(migrationPaths) + len(migrationMockPath)

	//executing all migration
	for idx, path := range migrationPaths {
		progressBar(idx, total)
		script, err := os.ReadFile(path)
		if err != nil {
			log.Fatalf("unable to read sql script: %v", err)
		}

		sqlScript := string(script)

		//remove gooseDown
		position := strings.Index(sqlScript, `-- +goose Down`)
		if position != -1 {
			sqlScript = sqlScript[:position]
		}

		_, err = db.Exec(sqlScript)
		if err != nil {
			log.Fatalf("unable to execute sql script: %v", err)
		}

	}

	//executing all mock
	for idx, path := range migrationMockPath {
		progressBar(len(migrationPaths)+idx, total)
		script, err := os.ReadFile(path)
		if err != nil {
			log.Fatalf("unable to read sql script: %v", err)
		}

		sqlScript := string(script)
		_, err = db.Exec(sqlScript)
		if err != nil {
			log.Fatalf("unable to execute sql script: %v", err)
		}
	}

	progressBar(100, 100)
	fmt.Println("")
	fmt.Println("Migration & MockData done")

	autoDumpCSV(db, port, currentDir, migrationMockAfterCSV)
}

func autoDumpCSV(db *sqlx.DB, port string, currentDir string, migrationMockAfterCSV []string) {
	go func() {
		//sleep for 5 seconds because need to services sucessfully started
		time.Sleep(5 * time.Second)

		loginUrl := fmt.Sprintf("http://localhost:%s/arriving/v1/auth/login/email-password", port)
		username := "admin@admin.com"
		password := "patdoepass"
		filePath := fmt.Sprintf("%s/src/context/domain/migration/postgres/helper/3-level-main.csv", currentDir)
		csvUrl := fmt.Sprintf("http://localhost:%s/academic-level/v1/1/levels/upload/csv", port)

		loginCmd := exec.Command("curl", "-s", "-X", "POST", loginUrl, "-H", "Content-Type: application/json", "-d", fmt.Sprintf(`{"email": "%s", "password": "%s"}`, username, password))
		loginOutput, err := loginCmd.CombinedOutput()
		if err != nil {
			log.Fatalf("failed to execute login command: %v", err)
		}

		authToken := strings.Split(strings.Split(string(loginOutput), `"access_token":"`)[1], `"`)[0]
		cmd := exec.Command("curl", "-X", "POST", csvUrl, "-H", fmt.Sprintf("Authorization: Bearer %s", authToken), "-F", fmt.Sprintf("csv_file=@%s", filePath))
		_, err = cmd.CombinedOutput()

		if err != nil {
			log.Fatalf("failed to execute curl command: %v", err)
		}

		//executing all mock
		scriptCount := 0
		for _, path := range migrationMockAfterCSV {
			script, err := os.ReadFile(path)
			if err != nil {
				log.Fatalf("unable to read sql script: %v", err)
			}

			sqlScript := string(script)
			_, err = db.Exec(sqlScript)
			if err != nil {
				log.Fatalf("unable to execute sql script: %v", err)
			}
			scriptCount++
		}

		fmt.Printf("CSV & MockData done, %d script executed\n", scriptCount)
		//update all status to enabled
		query1 := `UPDATE "level"."level" SET status = 'enabled'`
		query2 := `UPDATE "subject"."sub_lesson" SET status = 'enabled'`

		_, err = db.Exec(query1)
		if err != nil {
			log.Fatalf("failed to update level status: %v", err)
		}

		_, err = db.Exec(query2)
		if err != nil {
			log.Fatalf("failed to update sub lesson status: %v", err)
		}

	}()
}
