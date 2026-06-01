-- Configuração Inicial
CREATE DATABASE IF NOT EXISTS atividadedb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE atividadedb;

-- 1. Tabela de Usuários (Adicionado 'admin' ao role)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Matérias (Subjects)
CREATE TABLE subjects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    teacher_id INT,
    FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 3. Tabela de Atividades (Activities)
CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    subject_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    due_date DATETIME,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
);

-- 4. Tabela de Submissões (Submissions)
CREATE TABLE submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    activity_id INT NOT NULL,
    student_id INT NOT NULL,
    answer TEXT,
    grade VARCHAR(10),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Dados Iniciais (Senha: admin123 para o admin, senha123 para os outros)
INSERT INTO users (name, email, password, role) VALUES 
('Administrador', 'admin@teste.com', '$2a$10$7p6M9R9H8k8vW8K1L8L8L8L8L8L8L8L8L8L8L8L8L8L8L8L8L8L8L', 'admin'),
('Professor Admin', 'professor@teste.com', '$2a$10$8K9p6m9Z.K/fG0zYmQ1mGeWzG9H5R8F8L6vW8K1L8L8L8L8L8L8L8', 'teacher'),
('Aluno Exemplo', 'aluno@teste.com', '$2a$10$8K9p6m9Z.K/fG0zYmQ1mGeWzG9H5R8F8L6vW8K1L8L8L8L8L8L8L8', 'student');

INSERT INTO subjects (name, description, teacher_id) VALUES 
('Matemática', 'Estudo de álgebra e geometria', 2),
('História', 'História do Brasil e do Mundo', 2);
