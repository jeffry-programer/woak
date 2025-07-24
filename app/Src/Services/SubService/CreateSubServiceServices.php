<?php

namespace App\Src\Services\SubService;

use App\Models\SubService;

class CreateSubServiceServices
{
    public function __invoke(array $data)
    {
        $subService = new SubService();
        $subService->fill($data);
        if(isset($data['sub_service_image'])){
            $data['sub_service_image']->storeAs("public/sub_services/",$data['sub_service_image']->getClientOriginalName());
            $subService->sub_service_image = "/storage/public/sub_services/" . $data['sub_service_image']->getClientOriginalName();
        }
        $subService->save();
        return $subService;
    }
}
