<?php

namespace App\ModelFilters;

use App\Models\CastMember;

class CastMemberFilter extends DefaultModelFilter
{
    /**
     * Related Models that have ModelFilters as well as the method on the ModelFilter
     * As [relationMethod => [input_key1, input_key2]].
     *
     * @var array
     */
    public $sortable = ['name', 'type', 'created_at'];

    /**
     * @param $search
     */
    public function search($search)
    {
        $this->query->where('name', 'LIKE', "%{$search}%");
    }

    public function type($type)
    {
        $_type = (int)$type;
        if (in_array($_type, CastMember::$types)) {
            $this->where('type', $_type);
        }
    }
}
