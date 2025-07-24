<?php
namespace App\Src\Data\General;

class RequestResponseGeneral
{
    private $response;
    private $data;
    private $error;

    public function __construct($response, $data, $error)
    {
        $this->response = $response;
        $this->data = $data;
        $this->error = $error;
    }

    public function getResponse()
    {
        return $this->response;
    }

    public function getData()
    {
        return $this->data;
    }

    public function getError()
    {
        return $this->error;
    }

    public function toJson()
    {
        return json_decode($this->response);
    }

    public function toJsonData()
    {
        return json_decode($this->data);
    }
}
