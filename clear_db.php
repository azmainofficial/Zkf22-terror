<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    // Disable foreign keys
    if (DB::getDriverName() === 'sqlite') {
        DB::statement('PRAGMA foreign_keys = OFF;');
    } else {
        DB::statement('SET FOREIGN_KEY_CHECKS = 0;');
    }

    $tables = DB::select('SHOW TABLES');
    $dbName = DB::getDatabaseName();
    $key = "Tables_in_" . $dbName;
    
    foreach ($tables as $table) {
        $name = $table->$key;
        if ($name === 'migrations') continue;
        
        if ($name === 'users') {
            DB::table($name)->where('email', '!=', 'admin@admin.com')->delete();
            echo "Preserved admin in 'users' table.\n";
        } else {
            DB::table($name)->truncate();
            echo "Truncated '$name' table.\n";
        }
    }

    if (DB::getDriverName() === 'sqlite') {
        DB::statement('PRAGMA foreign_keys = ON;');
    } else {
        DB::statement('SET FOREIGN_KEY_CHECKS = 1;');
    }

    echo "Database cleared successfully (Admin account preserved).\n";
} catch (\Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
}
