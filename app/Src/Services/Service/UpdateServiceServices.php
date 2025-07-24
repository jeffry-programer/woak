<?php

namespace App\Src\Services\Service;

use App\Models\Service;

class UpdateServiceServices
{
    public function __invoke(array $data, int $id)
    {
        $service = Service::find($id);
        $service->fill($data);
        if(isset($data['service_image'])){
            $data['service_image']->storeAs("public/services/",$data['service_image']->getClientOriginalName());
            $service->service_image = "/storage/public/services/" . $data['service_image']->getClientOriginalName();
        }
        $service->save();
        return $service;
    }
}
