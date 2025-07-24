<?php

namespace App\Src\Data\General;

class QueryBuilder
{
    private array $querys;
    private bool $active;
    private array $functions;
    private array $withs;
    private string $rawSql;
    private $orderby;

    public function __construct(bool $active)
    {
        $this->active = $active;
        $this->querys = [];
        $this->functions = [];
        $this->withs = [];
        $this->rawSql = '';
        $this->orderby = [];
    }

    public function setOrderby($orderby)
    {
        $this->orderby = $orderby;
    }

    public function setRawSql($rawSql)
    {
        $this->rawSql = $rawSql;
    }

    public function setQueryWhere($key, $operation, $value)
    {
        array_push($this->querys, [
            'key' => $key,
            'operation' => $operation,
            'value' => $value
        ]);
    }

    public function setFunction($function)
    {
        array_push($this->functions, $function);
    }

    public function setWith($with)
    {
        array_push($this->withs, $with);
    }

    public function active(): bool
    {
        return $this->active;
    }

    public function getQuerys()
    {
        return $this->querys;
    }

    public function getFunctions()
    {
        return $this->functions;
    }

    public function getWiths()
    {
        return $this->withs;
    }

    public function getRawSql()
    {
        return $this->rawSql;
    }

    public function getOrderBy()
    {
        return $this->orderby;
    }

    public function rawActive()
    {
        return $this->rawSql == '' ? false : true;
    }


}
