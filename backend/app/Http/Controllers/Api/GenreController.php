<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\GenreResource;
use App\Models\Genre;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Throwable;

class GenreController extends BasicCrudController
{
    private $rules = [
        'name' => 'required|max:255',
        'description' => 'nullable',
        'is_active' => 'boolean',
        'categories_id' => 'required|array|exists:categories,id,deleted_at,NULL'
    ];

    /**
     * @param Request $request
     * @return mixed
     * @throws ValidationException
     * @throws Throwable
     */
    public function store(Request $request)
    {
        /** @var Genre $obj */
        $validatedData = $this->validate($request, $this->rulesStore());
        $self = $this;
        $obj = \DB::transaction(function () use ($request, $validatedData, $self) {
            $obj = $this->model()::create($validatedData);
            $self->handleRelations($obj, $request);
            return $obj;
        });
        $obj->refresh();
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function update(Request $request, $id)
    {
        /** @var Genre $obj */
        $obj = $this->findOrFail($id);
        $validatedData = $this->validate($request, $this->rulesUpdate());
        $self = $this;
        $obj = \DB::transaction(function () use ($request, $validatedData, $self, $obj) {
            $obj->update($validatedData);
            $self->handleRelations($obj, $request);
            return $obj;
        });
        $resource = $this->resource();
        return new $resource($obj);
    }

    protected function handleRelations(Genre $genre, Request $request)
    {
        $genre->categories()->sync($request->get('categories_id'));
    }

    protected function model()
    {
        return Genre::class;
    }

    protected function rulesStore()
    {
        return $this->rules;
    }

    protected function rulesUpdate()
    {
        return $this->rules;
    }

    protected function resource()
    {
        return GenreResource::class;
    }

    protected function resourceCollection()
    {
        return $this->resource();
    }

    protected function queryBuilder(): Builder
    {
        return parent::queryBuilder()->with('categories');
    }
}
