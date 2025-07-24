<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@woak.com',
            'password' => bcrypt('12345678'), // password
        ]);

        $this->call(ProfessionsSeeder::class);
    }
}
