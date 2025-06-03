
<?php

// Exemplo de como as migrations Laravel devem ser estruturadas
// Use estes exemplos como base para criar suas migrations

/*
Migration: create_companies_table
*/
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCompaniesTable extends Migration
{
    public function up()
    {
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('cnpj', 18)->unique();
            $table->string('email')->unique();
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['cnpj', 'email', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('companies');
    }
}

/*
Migration: create_users_table
*/
class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['Gerente', 'Colaborador'])->default('Colaborador');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login')->nullable();
            $table->rememberToken();
            $table->timestamps();
            
            $table->index(['company_id', 'email', 'role', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
}

/*
Migration: create_clients_table
*/
class CreateClientsTable extends Migration
{
    public function up()
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('cpf_cnpj', 18)->nullable();
            $table->text('address')->nullable();
            $table->string('city', 100)->nullable();
            $table->string('state', 50)->nullable();
            $table->string('zip_code', 10)->nullable();
            $table->date('birth_date')->nullable();
            $table->text('notes')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['company_id', 'email', 'cpf_cnpj', 'name', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('clients');
    }
}

/*
Migration: create_vehicles_table
*/
class CreateVehiclesTable extends Migration
{
    public function up()
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->string('plate', 10);
            $table->string('chassis', 50)->nullable();
            $table->integer('year');
            $table->string('manufacturer', 100);
            $table->string('model', 100);
            $table->string('color', 50)->nullable();
            $table->integer('current_km')->default(0);
            $table->text('additional_info')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['company_id', 'client_id', 'plate', 'chassis', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('vehicles');
    }
}

/*
Migration: create_categories_table
*/
class CreateCategoriesTable extends Migration
{
    public function up()
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('type', ['product', 'service']);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['company_id', 'type', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('categories');
    }
}

/*
Migration: create_products_table
*/
class CreateProductsTable extends Migration
{
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('code', 50)->nullable();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('brand', 100)->nullable();
            $table->string('unit', 20)->default('UN');
            $table->decimal('cost_price', 10, 2)->default(0.00);
            $table->decimal('sale_price', 10, 2);
            $table->integer('current_stock')->default(0);
            $table->integer('min_stock')->default(0);
            $table->integer('max_stock')->default(0);
            $table->string('location', 100)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['company_id', 'category_id', 'code', 'name', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('products');
    }
}

/*
Migration: create_services_table
*/
class CreateServicesTable extends Migration
{
    public function up()
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('estimated_time')->default(0); // em minutos
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['company_id', 'category_id', 'name', 'is_active']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('services');
    }
}

/*
Migration: create_orders_table
*/
class CreateOrdersTable extends Migration
{
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('company_id')->constrained()->onDelete('cascade');
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('vehicle_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['budget', 'service_order']);
            $table->string('number', 50)->unique();
            $table->enum('status', ['open', 'approved', 'in_progress', 'completed', 'cancelled'])->default('open');
            $table->integer('current_km')->nullable();
            $table->text('complaint')->nullable();
            $table->text('diagnosis')->nullable();
            $table->text('observations')->nullable();
            $table->decimal('subtotal', 10, 2)->default(0.00);
            $table->decimal('discount_amount', 10, 2)->default(0.00);
            $table->decimal('discount_percentage', 5, 2)->default(0.00);
            $table->decimal('total_amount', 10, 2)->default(0.00);
            $table->enum('payment_method', ['cash', 'credit_card', 'debit_card', 'pix', 'bank_transfer', 'check'])->nullable();
            $table->enum('payment_status', ['pending', 'partial', 'paid', 'cancelled'])->default('pending');
            $table->timestamp('start_date')->nullable();
            $table->timestamp('completion_date')->nullable();
            $table->timestamp('delivery_date')->nullable();
            $table->date('validity_date')->nullable();
            $table->timestamps();
            
            $table->index(['company_id', 'client_id', 'vehicle_id', 'user_id', 'number', 'type', 'status', 'created_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('orders');
    }
}

// Continue seguindo este padrão para as demais tabelas...
// order_products, order_services, stock_movements, suppliers, 
// accounts_payable, accounts_receivable, company_settings, activity_logs

/*
Comandos Artisan para criar as migrations:

php artisan make:migration create_companies_table
php artisan make:migration create_users_table
php artisan make:migration create_clients_table
php artisan make:migration create_vehicles_table
php artisan make:migration create_categories_table
php artisan make:migration create_products_table
php artisan make:migration create_services_table
php artisan make:migration create_orders_table
php artisan make:migration create_order_products_table
php artisan make:migration create_order_services_table
php artisan make:migration create_stock_movements_table
php artisan make:migration create_suppliers_table
php artisan make:migration create_accounts_payable_table
php artisan make:migration create_accounts_receivable_table
php artisan make:migration create_company_settings_table
php artisan make:migration create_activity_logs_table

Depois de criar as migrations, execute:
php artisan migrate
*/
