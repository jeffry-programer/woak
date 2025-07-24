<?php

namespace App\Src\Services\SubService;

use App\Models\SubService;

class UpdateSubServiceServices
{
    public function __invoke(array $data, int $id)
    {
        $subService = SubService::find($id);
        $subService->fill($data);
        if(isset($data['sub_service_image'])){
            $data['sub_service_image']->storeAs("public/sub_services/",$data['sub_service_image']->getClientOriginalName());
            $subService->sub_service_image = "/storage/public/sub_services/" . $data['sub_service_image']->getClientOriginalName();
        }
        $subService->save();
        return $subService;
    }
}
