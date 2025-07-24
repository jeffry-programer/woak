<?php

namespace App\Src\Services\File;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\File;

class FileServices
{
    public function uploadFile($file)
    {
        $file_original_name = str_replace(' ', '-', $file->getClientOriginalName());
        $name_created = date('dmys') . $file_original_name;
        // Store the file in the public directory
        $pathUploaded = Storage::disk('public')->put('uploads', $file);
        return [
            'url_local' => $pathUploaded,
            'size'      => Storage::disk('public')->size($pathUploaded),
            'type'      => $file->getMimeType(),
            'name'      => $name_created
        ];
    }

    public function deleteFile($name, $type = 'web')
    {
        if (Storage::exists($name)) {
            Storage::delete($name);
        } else {
            if ($type != 'json') {
                echo 'Archivo no existe ' . $name;
            }
        }
    }

    public function download($name, $renameFile)
    {
        if (Storage::exists($name)) {
            return Storage::download($name, $renameFile);
        } else {
            echo 'Archivo no existe ' . $name;
        }
    }
}
