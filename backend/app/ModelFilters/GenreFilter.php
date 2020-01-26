<?php

namespace App\ModelFilters;

use Illuminate\Database\Eloquent\Builder;

class GenreFilter extends DefaultModelFilter
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

    public function categories($categories)
    {
        $this->whereHas('categories', function (Builder $query) use ($categories) {
            $query->whereIn('id', $categories)
                ->orWhereIn('name', $categories);
        });
    }
}
