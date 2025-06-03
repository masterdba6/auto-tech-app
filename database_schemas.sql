
-- Schema para Sistema de Gestão de Oficina Multi-Empresa
-- Para uso com Laravel Migrations

-- Tabela de Empresas (Oficinas)
CREATE TABLE companies (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    INDEX idx_companies_cnpj (cnpj),
    INDEX idx_companies_email (email),
    INDEX idx_companies_is_active (is_active)
);

-- Tabela de Usuários
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    email_verified_at TIMESTAMP NULL DEFAULT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('Gerente', 'Colaborador') NOT NULL DEFAULT 'Colaborador',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL DEFAULT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_users_company_id (company_id),
    INDEX idx_users_email (email),
    INDEX idx_users_role (role),
    INDEX idx_users_is_active (is_active)
);

-- Tabela de Clientes
CREATE TABLE clients (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    cpf_cnpj VARCHAR(18),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    birth_date DATE NULL,
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_clients_company_id (company_id),
    INDEX idx_clients_email (email),
    INDEX idx_clients_cpf_cnpj (cpf_cnpj),
    INDEX idx_clients_name (name),
    INDEX idx_clients_is_active (is_active)
);

-- Tabela de Veículos
CREATE TABLE vehicles (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    client_id BIGINT UNSIGNED NOT NULL,
    plate VARCHAR(10) NOT NULL,
    chassis VARCHAR(50),
    year INT NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    color VARCHAR(50),
    current_km INT DEFAULT 0,
    additional_info TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    INDEX idx_vehicles_company_id (company_id),
    INDEX idx_vehicles_client_id (client_id),
    INDEX idx_vehicles_plate (plate),
    INDEX idx_vehicles_chassis (chassis),
    INDEX idx_vehicles_is_active (is_active)
);

-- Tabela de Categorias de Produtos/Serviços
CREATE TABLE categories (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type ENUM('product', 'service') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_categories_company_id (company_id),
    INDEX idx_categories_type (type),
    INDEX idx_categories_is_active (is_active)
);

-- Tabela de Produtos
CREATE TABLE products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NULL,
    code VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    unit VARCHAR(20) DEFAULT 'UN',
    cost_price DECIMAL(10,2) DEFAULT 0.00,
    sale_price DECIMAL(10,2) NOT NULL,
    current_stock INT DEFAULT 0,
    min_stock INT DEFAULT 0,
    max_stock INT DEFAULT 0,
    location VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_products_company_id (company_id),
    INDEX idx_products_category_id (category_id),
    INDEX idx_products_code (code),
    INDEX idx_products_name (name),
    INDEX idx_products_is_active (is_active)
);

-- Tabela de Serviços
CREATE TABLE services (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    category_id BIGINT UNSIGNED NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    estimated_time INT DEFAULT 0, -- em minutos
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_services_company_id (company_id),
    INDEX idx_services_category_id (category_id),
    INDEX idx_services_name (name),
    INDEX idx_services_is_active (is_active)
);

-- Tabela de Orçamentos e Ordens de Serviço
CREATE TABLE orders (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    client_id BIGINT UNSIGNED NOT NULL,
    vehicle_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL, -- usuário responsável
    type ENUM('budget', 'service_order') NOT NULL,
    number VARCHAR(50) UNIQUE NOT NULL, -- número sequencial
    status ENUM('open', 'approved', 'in_progress', 'completed', 'cancelled') NOT NULL DEFAULT 'open',
    current_km INT,
    complaint TEXT, -- reclamação do cliente
    diagnosis TEXT, -- diagnóstico técnico
    observations TEXT,
    subtotal DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    discount_percentage DECIMAL(5,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) DEFAULT 0.00,
    payment_method ENUM('cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer', 'check') NULL,
    payment_status ENUM('pending', 'partial', 'paid', 'cancelled') DEFAULT 'pending',
    start_date TIMESTAMP NULL,
    completion_date TIMESTAMP NULL,
    delivery_date TIMESTAMP NULL,
    validity_date DATE NULL, -- para orçamentos
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_orders_company_id (company_id),
    INDEX idx_orders_client_id (client_id),
    INDEX idx_orders_vehicle_id (vehicle_id),
    INDEX idx_orders_user_id (user_id),
    INDEX idx_orders_number (number),
    INDEX idx_orders_type (type),
    INDEX idx_orders_status (status),
    INDEX idx_orders_created_at (created_at)
);

-- Tabela de Itens do Orçamento/Ordem (Produtos)
CREATE TABLE order_products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_order_products_order_id (order_id),
    INDEX idx_order_products_product_id (product_id)
);

-- Tabela de Itens do Orçamento/Ordem (Serviços)
CREATE TABLE order_services (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT UNSIGNED NOT NULL,
    service_id BIGINT UNSIGNED NOT NULL,
    quantity DECIMAL(10,3) NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    INDEX idx_order_services_order_id (order_id),
    INDEX idx_order_services_service_id (service_id)
);

-- Tabela de Movimentações de Estoque
CREATE TABLE stock_movements (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    product_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    order_id BIGINT UNSIGNED NULL, -- se a movimentação for relacionada a uma ordem
    type ENUM('entry', 'exit', 'adjustment') NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    unit_cost DECIMAL(10,2),
    reason VARCHAR(255),
    notes TEXT,
    previous_stock DECIMAL(10,3) NOT NULL,
    new_stock DECIMAL(10,3) NOT NULL,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_stock_movements_company_id (company_id),
    INDEX idx_stock_movements_product_id (product_id),
    INDEX idx_stock_movements_user_id (user_id),
    INDEX idx_stock_movements_order_id (order_id),
    INDEX idx_stock_movements_type (type),
    INDEX idx_stock_movements_created_at (created_at)
);

-- Tabela de Fornecedores
CREATE TABLE suppliers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    cnpj VARCHAR(18),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(10),
    notes TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    INDEX idx_suppliers_company_id (company_id),
    INDEX idx_suppliers_name (name),
    INDEX idx_suppliers_cnpj (cnpj),
    INDEX idx_suppliers_is_active (is_active)
);

-- Tabela de Contas a Pagar
CREATE TABLE accounts_payable (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    supplier_id BIGINT UNSIGNED NULL,
    order_id BIGINT UNSIGNED NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    payment_date DATE NULL,
    status ENUM('pending', 'paid', 'overdue', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer', 'check') NULL,
    notes TEXT,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_accounts_payable_company_id (company_id),
    INDEX idx_accounts_payable_supplier_id (supplier_id),
    INDEX idx_accounts_payable_due_date (due_date),
    INDEX idx_accounts_payable_status (status)
);

-- Tabela de Contas a Receber
CREATE TABLE accounts_receivable (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    client_id BIGINT UNSIGNED NULL,
    order_id BIGINT UNSIGNED NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    payment_date DATE NULL,
    status ENUM('pending', 'paid', 'overdue', 'cancelled') DEFAULT 'pending',
    payment_method ENUM('cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer', 'check') NULL,
    notes TEXT,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL,
    INDEX idx_accounts_receivable_company_id (company_id),
    INDEX idx_accounts_receivable_client_id (client_id),
    INDEX idx_accounts_receivable_due_date (due_date),
    INDEX idx_accounts_receivable_status (status)
);

-- Tabela de Configurações da Empresa
CREATE TABLE company_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP NULL DEFAULT NULL,
    updated_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_company_setting (company_id, setting_key),
    INDEX idx_company_settings_company_id (company_id)
);

-- Tabela de Histórico de Ações (Log de Auditoria)
CREATE TABLE activity_logs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    company_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    action VARCHAR(100) NOT NULL,
    model_type VARCHAR(100) NOT NULL, -- nome da model (ex: Order, Client, etc)
    model_id BIGINT UNSIGNED NOT NULL,
    changes JSON NULL, -- alterações realizadas
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP NULL DEFAULT NULL,
    
    FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_activity_logs_company_id (company_id),
    INDEX idx_activity_logs_user_id (user_id),
    INDEX idx_activity_logs_model (model_type, model_id),
    INDEX idx_activity_logs_created_at (created_at)
);
