<?php

namespace App\Src\Services\Service;

use App\Models\Service;

class CreateServiceServices
{
    public function __invoke(array $data)
    {
        $service = new Service();
        $service->fill($data);
        if(isset($data['service_image'])){
            $data['service_image']->storeAs("public/services/",$data['service_image']->getClientOriginalName());
            $service->service_image = "/storage/public/services/" . $data['service_image']->getClientOriginalName();
        }
        $service->save();
        return $service;
    }
}
