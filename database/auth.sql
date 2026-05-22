-- SQL completo para criar o banco e as tabelas necessárias para o site.

CREATE DATABASE IF NOT EXISTS atividadedb
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE atividadedb;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('student','teacher') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS subjects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT NOT NULL,
  teacher_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_activity_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_activity_teacher FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS submissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  activity_id INT NOT NULL,
  student_id INT NOT NULL,
  answer TEXT,
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  grade VARCHAR(50),
  feedback TEXT,
  status ENUM('submitted','graded','returned') DEFAULT 'submitted',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_submission_activity FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_submission_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS subject_enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  subject_id INT NOT NULL,
  student_id INT NOT NULL,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_enrollment_subject FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  UNIQUE KEY uniq_subject_student (subject_id, student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO users (name, email, password, role) VALUES
('Aluno Teste', 'aluno@teste.com', 'senha123', 'student'),
('Professor Teste', 'professor@teste.com', 'senha123', 'teacher');

INSERT INTO subjects (name, description) VALUES
('Matemática', 'Matemática básica e intermediária'),
('Português', 'Gramática, interpretação de texto e redação');

INSERT INTO activities (subject_id, teacher_id, title, description, due_date) VALUES
(1, 2, 'Exercício de Álgebra', 'Resolva as equações abaixo.', '2026-06-10 23:59:00'),
(2, 2, 'Leitura e interpretação', 'Leia o texto e responda às perguntas.', '2026-06-12 23:59:00');

INSERT INTO submissions (activity_id, student_id, answer, grade, status) VALUES
(1, 1, 'Resposta do aluno para o exercício de álgebra.', 'A', 'graded');

-- Use no servidor hashing de senha para salvar as senhas com segurança.
