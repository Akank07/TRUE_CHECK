CREATE DATABASE truecheck;

USE truecheck;


CREATE TABLE departments (

    department_id INT AUTO_INCREMENT PRIMARY KEY,

    department_name VARCHAR(100) NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE users (

    user_id INT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(120) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role ENUM('student','teacher','admin') NOT NULL,

    profile_image VARCHAR(255) DEFAULT NULL,

    is_active TINYINT(1) DEFAULT 1,

    last_login DATETIME DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE students (

    student_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    roll_number VARCHAR(30) UNIQUE NOT NULL,

    department_id INT,

    semester INT,

    section VARCHAR(10),

    phone VARCHAR(15),

    FOREIGN KEY(user_id)

        REFERENCES users(user_id)

        ON DELETE CASCADE,

    FOREIGN KEY(department_id)

        REFERENCES departments(department_id)

);

CREATE TABLE teachers (

    teacher_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    employee_id VARCHAR(30) UNIQUE NOT NULL,

    department_id INT,

    designation VARCHAR(100),

    phone VARCHAR(15),

    FOREIGN KEY(user_id)

        REFERENCES users(user_id)

        ON DELETE CASCADE,

    FOREIGN KEY(department_id)

        REFERENCES departments(department_id)

);

CREATE TABLE subjects (

    subject_id INT AUTO_INCREMENT PRIMARY KEY,

    subject_code VARCHAR(20) UNIQUE NOT NULL,

    subject_name VARCHAR(100) NOT NULL,

    semester INT,

    credits INT,

    department_id INT,

    FOREIGN KEY(department_id)

        REFERENCES departments(department_id)

);

CREATE TABLE classrooms (

    classroom_id INT AUTO_INCREMENT PRIMARY KEY,

    room_number VARCHAR(20) NOT NULL,

    building_name VARCHAR(100) NOT NULL,

    floor_no INT NOT NULL,

    latitude DECIMAL(10,8) NOT NULL,

    longitude DECIMAL(11,8) NOT NULL,

    allowed_radius DECIMAL(5,2) DEFAULT 15.00,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE attendance_sessions (

    session_id INT AUTO_INCREMENT PRIMARY KEY,

    teacher_id INT NOT NULL,

    subject_id INT NOT NULL,

    classroom_id INT NOT NULL,

    session_code VARCHAR(10) UNIQUE NOT NULL,

    qr_code VARCHAR(255),

    start_time DATETIME NOT NULL,

    end_time DATETIME NOT NULL,

    session_status ENUM('ACTIVE','ENDED','EXPIRED') DEFAULT 'ACTIVE',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (teacher_id)

        REFERENCES teachers(teacher_id)

        ON DELETE CASCADE,

    FOREIGN KEY (subject_id)

        REFERENCES subjects(subject_id)

        ON DELETE CASCADE,

    FOREIGN KEY (classroom_id)

        REFERENCES classrooms(classroom_id)

        ON DELETE CASCADE

);

CREATE TABLE attendance (

    attendance_id INT AUTO_INCREMENT PRIMARY KEY,

    session_id INT NOT NULL,

    student_id INT NOT NULL,

    attendance_time DATETIME DEFAULT CURRENT_TIMESTAMP,

    latitude DECIMAL(10,8) NOT NULL,

    longitude DECIMAL(11,8) NOT NULL,

    distance DECIMAL(6,2) NOT NULL,

    selfie_image VARCHAR(255),

    attendance_status ENUM('PRESENT','ABSENT') DEFAULT 'PRESENT',

    FOREIGN KEY (session_id)

        REFERENCES attendance_sessions(session_id)

        ON DELETE CASCADE,

    FOREIGN KEY (student_id)

        REFERENCES students(student_id)

        ON DELETE CASCADE,

    UNIQUE(session_id,student_id)

);

CREATE TABLE student_subjects (

    id INT AUTO_INCREMENT PRIMARY KEY,

    student_id INT NOT NULL,

    subject_id INT NOT NULL,

    academic_year VARCHAR(20),

    semester INT,

    FOREIGN KEY(student_id)

        REFERENCES students(student_id)

        ON DELETE CASCADE,

    FOREIGN KEY(subject_id)

        REFERENCES subjects(subject_id)

        ON DELETE CASCADE,

    UNIQUE(student_id,subject_id)

);

CREATE TABLE teacher_subjects (

    id INT AUTO_INCREMENT PRIMARY KEY,

    teacher_id INT NOT NULL,

    subject_id INT NOT NULL,

    academic_year VARCHAR(20),

    semester INT,

    FOREIGN KEY(teacher_id)

        REFERENCES teachers(teacher_id)

        ON DELETE CASCADE,

    FOREIGN KEY(subject_id)

        REFERENCES subjects(subject_id)

        ON DELETE CASCADE,

    UNIQUE(teacher_id,subject_id)

);

CREATE TABLE notifications (

    notification_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    title VARCHAR(150) NOT NULL,

    message TEXT NOT NULL,

    is_read TINYINT(1) DEFAULT 0,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)

        REFERENCES users(user_id)

        ON DELETE CASCADE

);

CREATE TABLE login_history (

    login_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    login_time DATETIME DEFAULT CURRENT_TIMESTAMP,

    ip_address VARCHAR(50),

    device VARCHAR(150),

    browser VARCHAR(150),

    FOREIGN KEY(user_id)

        REFERENCES users(user_id)

        ON DELETE CASCADE

);

CREATE TABLE selfie_records (

    selfie_id INT AUTO_INCREMENT PRIMARY KEY,

    attendance_id INT NOT NULL,

    image_path VARCHAR(255) NOT NULL,

    captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(attendance_id)

        REFERENCES attendance(attendance_id)

        ON DELETE CASCADE

);
SELECT * FROM DEPARTMENTS;
INSERT INTO departments (department_name)
VALUES
('Computer Science'),
('Information Technology'),
('Electronics'),
('Mechanical'),
('Civil');
SELECT department_id, department_name
FROM departments;
SHOW TABLES;
DESCRIBE attendance_sessions;
DESCRIBE teacher_subjects;
DESCRIBE classrooms;
DESCRIBE teachers;
SELECT teacher_id, user_id
FROM teachers;
SELECT * FROM subjects;
SELECT * FROM classrooms;
SELECT * FROM teacher_subjects;
SELECT * FROM teachers;
INSERT INTO subjects
(subject_name, subject_code, department_id, semester, credits)
VALUES
(
    'Java Programming',
    'CS401',
    1,
    8,
    4
);
INSERT INTO classrooms
(
    room_number,
    building_name,
    floor_no,
    latitude,
    longitude,
    allowed_radius
)
VALUES
(
    'B301',
    'Academic Block',
    3,
    20.2961,
    85.8245,
    50
);
SELECT teacher_id FROM teachers;
SELECT subject_id FROM subjects;
INSERT INTO teacher_subjects
(
    teacher_id,
    subject_id,
    academic_year,
    semester
)
VALUES
(
    1,
    1,
    '2026-2027',
    8
);
DESCRIBE subjects;
DESCRIBE classrooms;
DESCRIBE teacher_subjects;
SELECT * FROM teachers;
SELECT * FROM subjects;
SELECT * FROM classrooms;
DESCRIBE attendance;
DESCRIBE student_subjects;
SELECT * FROM student_subjects;
INSERT INTO student_subjects
(
    student_id,
    subject_id,
    academic_year,
    semester
)
VALUES
(
    2,
    1,
    '2026-2027',
    8
);
SELECT student_id, user_id, roll_number
FROM students;
SELECT * FROM student_subjects;
SELECT user_id, full_name, email, role FROM users;
SELECT *
FROM students;
SELECT email, password
FROM users;
UPDATE users
SET password = '$2b$10$kaQtc3mquC5Y29AXDGOzuuF8huuN9tJtynESfvhbLbVpcL2OHwBAS'
WHERE email = 'akankshya@test.com';
SELECT email, password
FROM users
WHERE email = 'akankshya@test.com';
SELECT email, password
FROM users
WHERE email = 'akankshya@test.com';
SELECT user_id, email
FROM users
WHERE email = 'akankshya@test.com';
UPDATE users
SET password = '$2b$10$mWFhMMoXNcpNErrOsks6TuYvDW9qssCzEUoZ/O48Wn7JjD/TBvkim'
WHERE email = 'akankshya@test.com';
SELECT email, password
FROM users
WHERE email = 'akankshya@test.com';
SELECT
    session_id,
    session_code,
    start_time,
    end_time,
    session_status
FROM attendance_sessions;
UPDATE attendance_sessions
SET
    start_time = NOW(),
    end_time = DATE_ADD(NOW(), INTERVAL 30 MINUTE),
    session_status = 'ACTIVE'
WHERE session_id = 1;