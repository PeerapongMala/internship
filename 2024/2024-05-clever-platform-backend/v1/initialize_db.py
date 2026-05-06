import os
import subprocess

# Define the SQL files and their destinations
sql_files = [
    "1-question-demo-mock.sql",
    "2-admin-demo-mock.sql",
    "4-level-reward-homework-mock.sql",
    "5-mock-grade-data-entry.sql",
    "6-school-subject-student-inventory.sql",
    "7-seed-subject-reward.sql",
    "8-coupon-coupon.sql",
    "mock-grade-evaluation.sql",
    "mock-grade-template.sql",
    "mock-level-play-log.sql",
    "mock-student-with-play-log.sql",
    "mock-pre-post-test-play-log.sql"
]

def call_api():
    # Define the API endpoints and credentials
    login_url = "http://localhost:8000/arriving/v1/auth/login/email-password"
    upload_url = "http://localhost:8000/academic-level/v1/1/levels/upload/csv"
    username = "admin@admin.com"
    password = "patdoepass"
    csv_file_path = "./src/context/domain/migration/postgres/helper/3-level-main.csv"

    # Login to the API
    login_payload = {
        "email": username,
        "password": password
    }
    login_command = [
        "curl", "-s", "-X", "POST", login_url,
        "-H", "Content-Type: application/json",
        "-d", f'{{"email": "{username}", "password": "{password}"}}'
    ]
    login_result = subprocess.run(login_command, capture_output=True, text=True, check=True)
    auth_token = login_result.stdout.split('"access_token":"')[1].split('"')[0]

    # Upload the CSV file
    upload_command = [
        "curl", "-s", "-X", "POST", upload_url,
        "-H", f"Authorization: Bearer {auth_token}",
        "-F", f"csv_file=@{csv_file_path}"
    ]
    subprocess.run(upload_command, check=True)

    print("CSV file uploaded successfully.")

# Loop through the SQL files and execute the necessary commands
for index, sql_file in enumerate(sql_files):
    docker_cp_command = f"docker cp ./src/context/domain/migration/postgres/helper/{sql_file} postgres_ZettaMerge:/{sql_file}"
    docker_exec_command = f"docker exec -it postgres_ZettaMerge psql -U postgres -f /{sql_file}"

    # Execute the docker cp command
    subprocess.run(docker_cp_command, shell=True, check=True)

    # Execute the docker exec command
    subprocess.run(docker_exec_command, shell=True, check=True)

    print(f"{index} - {sql_file} executed successfully.")
    # Call the API after the third SQL file is processed
    if index == 1:
        call_api()
