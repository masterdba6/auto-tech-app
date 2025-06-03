
<?php

// Exemplos de Models Eloquent para o sistema

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;

/*
Model: Company
*/
class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'cnpj',
        'email',
        'phone',
        'address',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relacionamentos
    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function clients()
    {
        return $this->hasMany(Client::class);
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function services()
    {
        return $this->hasMany(Service::class);
    }
}

/*
Model: User
*/
class User extends Authenticatable
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'last_login'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login' => 'datetime',
        'is_active' => 'boolean',
    ];

    // Relacionamentos
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Scopes
    public function scopeManagers($query)
    {
        return $query->where('role', 'Gerente');
    }

    public function scopeEmployees($query)
    {
        return $query->where('role', 'Colaborador');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Helpers
    public function isManager()
    {
        return $this->role === 'Gerente';
    }

    public function isEmployee()
    {
        return $this->role === 'Colaborador';
    }
}

/*
Model: Client
*/
class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'phone',
        'cpf_cnpj',
        'address',
        'city',
        'state',
        'zip_code',
        'birth_date',
        'notes',
        'is_active'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'is_active' => 'boolean',
    ];

    // Relacionamentos
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function vehicles()
    {
        return $this->hasMany(Vehicle::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}

/*
Model: Vehicle
*/
class Vehicle extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'client_id',
        'plate',
        'chassis',
        'year',
        'manufacturer',
        'model',
        'color',
        'current_km',
        'additional_info',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Relacionamentos
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    // Accessors
    public function getFullNameAttribute()
    {
        return "{$this->manufacturer} {$this->model} ({$this->year})";
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}

/*
Model: Order
*/
class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'client_id',
        'vehicle_id',
        'user_id',
        'type',
        'number',
        'status',
        'current_km',
        'complaint',
        'diagnosis',
        'observations',
        'subtotal',
        'discount_amount',
        'discount_percentage',
        'total_amount',
        'payment_method',
        'payment_status',
        'start_date',
        'completion_date',
        'delivery_date',
        'validity_date'
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'start_date' => 'datetime',
        'completion_date' => 'datetime',
        'delivery_date' => 'datetime',
        'validity_date' => 'date',
    ];

    // Relacionamentos
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orderProducts()
    {
        return $this->hasMany(OrderProduct::class);
    }

    public function orderServices()
    {
        return $this->hasMany(OrderService::class);
    }

    // Scopes
    public function scopeBudgets($query)
    {
        return $query->where('type', 'budget');
    }

    public function scopeServiceOrders($query)
    {
        return $query->where('type', 'service_order');
    }

    public function scopeStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    // Helpers
    public function isBudget()
    {
        return $this->type === 'budget';
    }

    public function isServiceOrder()
    {
        return $this->type === 'service_order';
    }

    public function calculateTotal()
    {
        $productsTotal = $this->orderProducts->sum('total_price');
        $servicesTotal = $this->orderServices->sum('total_price');
        $subtotal = $productsTotal + $servicesTotal;
        
        $discountAmount = $this->discount_percentage > 0 
            ? ($subtotal * $this->discount_percentage / 100)
            : $this->discount_amount;
            
        return $subtotal - $discountAmount;
    }
}

/*
Model: Product
*/
class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id',
        'category_id',
        'code',
        'name',
        'description',
        'brand',
        'unit',
        'cost_price',
        'sale_price',
        'current_stock',
        'min_stock',
        'max_stock',
        'location',
        'is_active'
    ];

    protected $casts = [
        'cost_price' => 'decimal:2',
        'sale_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    // Relacionamentos
    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function orderProducts()
    {
        return $this->hasMany(OrderProduct::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeLowStock($query)
    {
        return $query->whereColumn('current_stock', '<=', 'min_stock');
    }
}

// Continue seguindo este padrão para os demais models...
// Service, Category, OrderProduct, OrderService, StockMovement, 
// Supplier, AccountsPayable, AccountsReceivable, etc.
