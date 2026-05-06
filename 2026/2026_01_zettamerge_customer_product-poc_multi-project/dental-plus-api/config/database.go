package config

import (
	"context"
	"fmt"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

var DB *pgxpool.Pool

func ConnectDatabase() error {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		databaseURL = "postgres://postgres:postgres@localhost:5432/dental_faq?sslmode=disable"
	}

	config, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return fmt.Errorf("unable to parse database URL: %w", err)
	}

	pool, err := pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		return fmt.Errorf("unable to create connection pool: %w", err)
	}

	// Test connection
	if err := pool.Ping(context.Background()); err != nil {
		return fmt.Errorf("unable to ping database: %w", err)
	}

	DB = pool
	fmt.Println("Connected to PostgreSQL database")

	// Run migrations
	if err := runMigrations(context.Background()); err != nil {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	return nil
}

// runMigrations creates necessary tables if they don't exist
func runMigrations(ctx context.Context) error {
	migrations := []string{
		// FAQs table with vector embedding
		`CREATE TABLE IF NOT EXISTS faqs (
			id SERIAL PRIMARY KEY,
			question TEXT NOT NULL,
			answer TEXT NOT NULL,
			category VARCHAR(100),
			views INTEGER DEFAULT 0,
			embedding vector(768),
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		)`,

		// FAQ Categories table
		`CREATE TABLE IF NOT EXISTS faq_categories (
			id VARCHAR(50) PRIMARY KEY,
			name VARCHAR(100) NOT NULL
		)`,

		// Chat questions table
		`CREATE TABLE IF NOT EXISTS chat_questions (
			id SERIAL PRIMARY KEY,
			question TEXT NOT NULL,
			customer_name VARCHAR(100),
			channel VARCHAR(50),
			frequency INTEGER DEFAULT 1,
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		)`,

		// Settings table
		`CREATE TABLE IF NOT EXISTS settings (
			id INTEGER PRIMARY KEY DEFAULT 1,
			intro_message TEXT,
			updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		)`,

		// Doctor schedules table
		`CREATE TABLE IF NOT EXISTS doctor_schedules (
			id SERIAL PRIMARY KEY,
			doctor_name VARCHAR(100) NOT NULL,
			branch VARCHAR(100) NOT NULL,
			day_of_week INTEGER NOT NULL,
			start_time TIME NOT NULL,
			end_time TIME NOT NULL,
			is_available BOOLEAN DEFAULT true
		)`,

		// Promotions table
		`CREATE TABLE IF NOT EXISTS promotions (
			id SERIAL PRIMARY KEY,
			title VARCHAR(200) NOT NULL,
			description TEXT,
			discount_percent INTEGER,
			start_date DATE,
			end_date DATE,
			is_active BOOLEAN DEFAULT true,
			created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
		)`,
	}

	for _, migration := range migrations {
		if _, err := DB.Exec(ctx, migration); err != nil {
			return fmt.Errorf("migration failed: %w", err)
		}
	}

	// Insert sample data if tables are empty
	if err := insertSampleData(ctx); err != nil {
		fmt.Printf("Warning: Failed to insert sample data: %v\n", err)
	}

	fmt.Println("Migrations completed successfully")
	return nil
}

// insertSampleData inserts sample data for testing
func insertSampleData(ctx context.Context) error {
	// Insert default settings
	_, _ = DB.Exec(ctx, `
		INSERT INTO settings (id, intro_message) VALUES (1, 'สวัสดีค่ะ! ยินดีต้อนรับสู่ Dental Plus มีอะไรให้ช่วยเหลือคะ?')
		ON CONFLICT (id) DO NOTHING
	`)

	// Insert default categories
	categories := []struct {
		ID   string
		Name string
	}{
		{"price", "ราคาและโปรโมชัน"},
		{"service", "บริการ"},
		{"booking", "การนัดหมาย"},
		{"general", "ทั่วไป"},
	}
	for _, c := range categories {
		_, _ = DB.Exec(ctx, `INSERT INTO faq_categories (id, name) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING`, c.ID, c.Name)
	}

	// Insert sample FAQs
	var faqCount int
	_ = DB.QueryRow(ctx, "SELECT COUNT(*) FROM faqs").Scan(&faqCount)
	if faqCount == 0 {
		faqs := []struct {
			Question string
			Answer   string
			Category string
		}{
			{"ราคาขูดหินปูนเท่าไหร่", "ค่าขูดหินปูนที่ Dental Plus เริ่มต้นที่ 800-1,500 บาท ขึ้นอยู่กับปริมาณหินปูนและความซับซ้อนค่ะ", "price"},
			{"จัดฟันราคาเท่าไหร่", "ค่าจัดฟันที่ Dental Plus มีหลายแบบค่ะ: จัดฟันโลหะ 35,000-50,000 บาท, จัดฟันใส Invisalign 80,000-150,000 บาท", "price"},
			{"คลินิกเปิดกี่โมง", "คลินิก Dental Plus เปิดให้บริการทุกวัน ตั้งแต่ 09:00-20:00 น. ค่ะ", "general"},
			{"นัดหมายยังไง", "สามารถนัดหมายได้ 3 ช่องทาง: 1) โทร 02-xxx-xxxx 2) Line @dentalplus 3) เว็บไซต์ dentalplus.co.th", "booking"},
			{"ฟอกสีฟันปลอดภัยไหม", "ฟอกสีฟันที่คลินิกเราปลอดภัยค่ะ ใช้เทคโนโลยี Zoom Whitening ที่ได้รับการรับรอง ไม่ทำลายเคลือบฟัน", "service"},
		}
		for _, f := range faqs {
			_, _ = DB.Exec(ctx, `INSERT INTO faqs (question, answer, category) VALUES ($1, $2, $3)`, f.Question, f.Answer, f.Category)
		}
		fmt.Println("Inserted sample FAQs")
	}

	// Check if doctor_schedules has data
	var count int
	err := DB.QueryRow(ctx, "SELECT COUNT(*) FROM doctor_schedules").Scan(&count)
	if err != nil {
		return err
	}

	if count == 0 {
		// Insert sample doctor schedules
		schedules := []struct {
			Name      string
			Branch    string
			DayOfWeek int
			StartTime string
			EndTime   string
		}{
			{"ทพ.สมศรี ใจดี", "สาขาสยาม", 1, "09:00", "17:00"},
			{"ทพ.สมศรี ใจดี", "สาขาสยาม", 2, "09:00", "17:00"},
			{"ทพ.สมศรี ใจดี", "สาขาสยาม", 3, "09:00", "17:00"},
			{"ทพ.วิชัย รักษ์ฟัน", "สาขาสยาม", 1, "10:00", "18:00"},
			{"ทพ.วิชัย รักษ์ฟัน", "สาขาทองหล่อ", 2, "09:00", "17:00"},
			{"ทพญ.นภา สว่างฟัน", "สาขาทองหล่อ", 1, "09:00", "17:00"},
			{"ทพญ.นภา สว่างฟัน", "สาขาเซ็นทรัลลาดพร้าว", 4, "10:00", "19:00"},
		}

		for _, s := range schedules {
			_, err := DB.Exec(ctx,
				`INSERT INTO doctor_schedules (doctor_name, branch, day_of_week, start_time, end_time)
				 VALUES ($1, $2, $3, $4::TIME, $5::TIME)`,
				s.Name, s.Branch, s.DayOfWeek, s.StartTime, s.EndTime)
			if err != nil {
				return err
			}
		}
		fmt.Println("Inserted sample doctor schedules")
	}

	// Check if promotions has data
	err = DB.QueryRow(ctx, "SELECT COUNT(*) FROM promotions").Scan(&count)
	if err != nil {
		return err
	}

	if count == 0 {
		// Insert sample promotions
		promotions := []struct {
			Title       string
			Description string
			Discount    int
			StartDate   string
			EndDate     string
		}{
			{"โปรฟันสะอาด", "ขูดหินปูน + ขัดฟัน ลดพิเศษ", 20, "2025-01-01", "2025-12-31"},
			{"โปรจัดฟันใส", "จัดฟันใส Invisalign ลดสูงสุด", 15, "2025-01-01", "2025-12-31"},
			{"โปรฟอกสีฟัน", "ฟอกสีฟันด้วยเลเซอร์ ราคาพิเศษ", 25, "2025-01-01", "2025-06-30"},
		}

		for _, p := range promotions {
			_, err := DB.Exec(ctx,
				`INSERT INTO promotions (title, description, discount_percent, start_date, end_date, is_active)
				 VALUES ($1, $2, $3, $4::DATE, $5::DATE, true)`,
				p.Title, p.Description, p.Discount, p.StartDate, p.EndDate)
			if err != nil {
				return err
			}
		}
		fmt.Println("Inserted sample promotions")
	}

	return nil
}

func CloseDatabase() {
	if DB != nil {
		DB.Close()
	}
}
