<?php

namespace Tests\Stubs\Controllers;

use App\Http\Controllers\Api\BasicCrudController;
use Tests\Stubs\Models\GenreStub;

class GenreControllerStub extends BasicCrudController
{
    private $rules = [
        'name' => 'required|max:255',
        'description' => 'nullable'
    ];

    protected function model()
    {
        return GenreStub::class;
    }

    protected function rulesStore()
    {
        return $this->rules;
    }

    protected function rulesUpdate()
    {
        return $this->rules;
    }
}
