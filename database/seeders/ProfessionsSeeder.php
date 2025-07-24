<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Profession;
use App\Models\CategoryProfession;

class ProfessionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $medicos = CategoryProfession::create([
            'title' => 'Medicos'
        ]);

        Profession::create([
            'title' => 'Generalista',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Internista',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Cardiólogos',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Neumólogos',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Neurólogos',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Oncologos',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Pediatras',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Geriatras',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Psiquiatras',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Anestesiólogos',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Radiólogos',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Patólogos',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Cirujanos de diversas especialidades',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Médicos de Emergencias',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Intensivistas',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Infectólogos',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Endocrinólogos',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Nefrólogos',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Gastroenterólogos',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Dermatólogos',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Oftalmólogos',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Otorrinolaringólogos',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Residentes',
            'category_profession_id' => $medicos->id
        ]);

        Profession::create([
            'title' => 'Internos',
            'category_profession_id' => $medicos->id
        ]);

        $nurseAdvance = CategoryProfession::create([
            'title' => 'Enfermeras de Practicanta Advanzada'
        ]);

        Profession::create([
            'title' => 'Clinical Nurse Specialist (CNS)',
            'category_profession_id' => $nurseAdvance->id
        ]);

        Profession::create([
            'title' => 'Certified Registered Nurse Anesthetist (CRNA)',
            'category_profession_id' => $nurseAdvance->id
        ]);

        Profession::create([
            'title' => 'Certified Nurse-Midwife (CNM)',
            'category_profession_id' => $nurseAdvance->id
        ]);


        Profession::create([
            'title' => 'Certified Nurse Practitioner (CNP)',
            'category_profession_id' => $nurseAdvance->id
        ]);

        $nurseBasic = CategoryProfession::create([
            'title' => 'Personal de Enfermeraria'
        ]);

        Profession::create([
            'title' => 'Enfermeros/as Registrados/as (RN)',
            'category_profession_id' => $nurseBasic->id
        ]);

        Profession::create([
            'title' => 'Enfermeros/as Auxiliares / Licenciados/as (LPN/LVN)',
            'category_profession_id' => $nurseBasic->id
        ]);

        Profession::create([
            'title' => 'Auxiliares de Enfermería / Técnicos de Cuidado al Paciente',
            'category_profession_id' => $nurseBasic->id
        ]);

        $diagnostician = CategoryProfession::create([
            'title' => 'Personal de Diagnóstico'
        ]);

        Profession::create([
            'title' => 'Tecnólogos Radiológicos (Rayos X, CT, MRI)',
            'category_profession_id' => $diagnostician->id
        ]);

        Profession::create([
            'title' => 'Técnicos de Ultrasonido',
            'category_profession_id' => $diagnostician->id
        ]);

        Profession::create([
            'title' => 'Técnicos de Mamografía',
            'category_profession_id' => $diagnostician->id
        ]);

        Profession::create([
            'title' => 'Tecnólogos Médicos / Científicos de Laboratorio Clínico',
            'category_profession_id' => $diagnostician->id
        ]);

        Profession::create([
            'title' => 'Flebotomistas (Extracción de sangre)',
            'category_profession_id' => $diagnostician->id
        ]);

        Profession::create([
            'title' => 'Técnicos de Electrocardiogramas (EKG)',
            'category_profession_id' => $diagnostician->id
        ]);

        Profession::create([
            'title' => 'Técnicos de Electroencefalogramas (EEG)',
            'category_profession_id' => $diagnostician->id
        ]);

        Profession::create([
            'title' => 'Técnicos de Ecocardiogramas',
            'category_profession_id' => $diagnostician->id
        ]);

        $therapist = CategoryProfession::create([
            'title' => 'Personal Terapéutico y de Rehabilitación'
        ]);

        Profession::create([
            'title' => 'Fisioterapeutas',
            'category_profession_id' => $therapist->id
        ]);

        Profession::create([
            'title' => 'Asistentes de Fisioterapeutas',
            'category_profession_id' => $therapist->id
        ]);

        Profession::create([
            'title' => 'Terapistas Ocupacional',
            'category_profession_id' => $therapist->id
        ]);

        Profession::create([
            'title' => 'Terapeutas del Lenguaje',
            'category_profession_id' => $therapist->id
        ]);

        Profession::create([
            'title' => 'Patólogos del Habla y Lenguaje',
            'category_profession_id' => $therapist->id
        ]);

        Profession::create([
            'title' => 'Terapistas Respiratorios',
            'category_profession_id' => $therapist->id
        ]);

        Profession::create([
            'title' => 'Nutricionistas',
            'category_profession_id' => $therapist->id
        ]);

        Profession::create([
            'title' => 'Dietistas',
            'category_profession_id' => $therapist->id
        ]);

        Profession::create([
            'title' => 'Farmacéuticos',
            'category_profession_id' => $therapist->id
        ]);

        Profession::create([
            'title' => 'Técnicos de Farmacia',
            'category_profession_id' => $therapist->id
        ]);

        Profession::create([
            'title' => 'Trabajadores Sociales',
            'category_profession_id' => $therapist->id
        ]);

        Profession::create([
            'title' => 'Manejadores de Casos (Case Managers)',
            'category_profession_id' => $therapist->id
        ]);

        $logistic = CategoryProfession::create([
            'title' => 'Personal de Servicios de Apoyo y Logística'
        ]);

        Profession::create([
            'title' => 'Personal de Seguridad',
            'category_profession_id' => $logistic->id
        ]);

        Profession::create([
            'title' => 'Personal de Mantenimiento',
            'category_profession_id' => $logistic->id
        ]);

        Profession::create([
            'title' => 'Ingenieros Hospitalarios',
            'category_profession_id' => $logistic->id
        ]);

        Profession::create([
            'title' => 'Técnicos de Equipo Biomédico',
            'category_profession_id' => $logistic->id
        ]);

        Profession::create([
            'title' => 'Personal de Servicios Ambientales (Limpieza y Saneamiento)',
            'category_profession_id' => $logistic->id
        ]);

        Profession::create([
            'title' => 'Personal de Servicios de Alimentos',
            'category_profession_id' => $logistic->id
        ]);

        Profession::create([
            'title' => 'Transportistas de Pacientes',
            'category_profession_id' => $logistic->id
        ]);

        Profession::create([
            'title' => 'Personal de Lavandería',
            'category_profession_id' => $logistic->id
        ]);

        $coordinatorCustomer = CategoryProfession::create([
            'title' => 'Personal de Gestión y Coordinación del Paciente'
        ]);

        Profession::create([
            'title' => 'Personal de Admisiones y Registros',
            'category_profession_id' => $coordinatorCustomer->id
        ]);

        Profession::create([
            'title' => 'Secretarias',
            'category_profession_id' => $coordinatorCustomer->id
        ]);

        Profession::create([
            'title' => 'Representantes de Pacientes / Defensores del Paciente (para resolver quejas y necesidades)',
            'category_profession_id' => $coordinatorCustomer->id
        ]);

        Profession::create([
            'title' => 'Voluntarios (guía, lectura, compañía a pacientes)',
            'category_profession_id' => $coordinatorCustomer->id
        ]);

        Profession::create([
            'title' => 'Capellanes / Personal de Cuidado Espiritual',
            'category_profession_id' => $coordinatorCustomer->id
        ]);

        $tiSupport = CategoryProfession::create([
            'title' => 'Personal de Tecnologías de la Información (IT) que soporta directamente el cuidado'
        ]);

        Profession::create([
            'title' => 'Técnicos de Soporte de Sistemas de Expediente Clínico Electrónico (EHR)',
            'category_profession_id' => $tiSupport->id
        ]);

        Profession::create([
            'title' => 'Administradores de Red',
            'category_profession_id' => $tiSupport->id
        ]);
    }
}
