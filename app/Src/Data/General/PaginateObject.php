<?php
namespace App\Src\Data\General;

class PaginateObject
{
    private $limit;
    private $active;
    private $page;

    public function __construct(int $limit, bool $active, int $page)
    {
        $this->limit = $limit;
        $this->active = $active;
        $this->page = $page;
    }

    public function getLimit(): int
    {
        return $this->limit;
    }

    public function getActive(): bool
    {
        return $this->active;
    }

    public function getPage(): int
    {
        return $this->page;
    }
}
