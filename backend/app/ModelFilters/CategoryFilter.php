<?php

namespace App\ModelFilters;

use Illuminate\Database\Eloquent\Builder;

class CategoryFilter extends DefaultModelFilter
{
    /**
     * Related Models that have ModelFilters as well as the method on the ModelFilter
     * As [relationMethod => [input_key1, input_key2]].
     *
     * @var array
     */
    public $sortable = ['name', 'is_active', 'created_at'];

    /**
     * @param $search
     */
    public function search($search)
    {
        $this->query->where('name', 'LIKE', "%{$search}%");
    }

    public function isActive($isActive)
    {
        $this->where('is_active', boolval($isActive));
    }

    /**
     * @param $genres
     */
    public function genres($genres)
    {
        $ids = explode(',', $genres);
        $this->whereHas('genres', function (Builder $query) use ($ids) {
            $query->whereIn('id', $ids);
        });
    }
}
