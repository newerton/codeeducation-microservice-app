<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

abstract class BasicCrudController extends Controller
{
    /**
     * @var int
     */
    protected $defaultPerPage = 15;

    /**
     * @return mixed
     */
    protected abstract function model();

    /**
     * @return mixed
     */
    protected abstract function rulesStore();

    /**
     * @return mixed
     */
    protected abstract function rulesUpdate();

    /**
     * @return mixed
     */
    protected abstract function resource();

    /**
     * @return mixed
     */
    protected abstract function resourceCollection();

    /**
     * @param Request $request
     * @return mixed
     * @throws \ReflectionException
     */
    public function index(Request $request)
    {
        $defaultPerPage = (int)$request->get('per_page', $this->defaultPerPage);
        $hasFilter = in_array(Filterable::class, class_uses($this->model()));;

        $query = $this->queryBuilder();

        if ($hasFilter) {
            $query = $query->filter($request->all());
        }

        $data = $request->has('all') || !$this->defaultPerPage
            ? $query->get()
            : $query->paginate($defaultPerPage);

        $resourceCollectionClass = $this->resourceCollection();
        $reflectionClass = new \ReflectionClass($resourceCollectionClass);
        return $reflectionClass->isSubclassOf(ResourceCollection::class)
            ? new $resourceCollectionClass($data)
            : $resourceCollectionClass::collection($data);
    }

    /**
     * @param Request $request
     * @return mixed
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        $validatedData = $this->validate($request, $this->rulesStore());
        $obj = $this->queryBuilder()->create($validatedData);
        $obj->refresh();
        $resource = $this->resource();
        return new $resource($obj);
    }

    /**
     * @param $id
     * @return Builder|\Illuminate\Database\Eloquent\Model
     */
    protected function findOrFail($id)
    {
        $model = $this->model();
        $keyName = (new $model)->getRouteKeyName();
        return $this->queryBuilder()->where($keyName, $id)->firstOrFail();
    }

    /**
     * @param $id
     * @return mixed
     */
    public function show($id)
    {
        $obj = $this->findOrFail($id);
        $resource = $this->resource();
        return new $resource($obj);
    }

    /**
     * @param Request $request
     * @param $id
     * @return mixed
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(Request $request, $id)
    {
        $obj = $this->findOrFail($id);
        $validatedData = $this->validate($request, $this->rulesUpdate());
        $obj->update($validatedData);
        $resource = $this->resource();
        return new $resource($obj);
    }

    /**
     * @param $id
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy($id)
    {
        $obj = $this->findOrFail($id);
        $obj->delete();
        return response()->noContent(); // 204 - No Content
    }

    /**
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function destroyCollection(Request $request)
    {
        $data = $this->validateIds($request);
        $this->model()::whereIn('id', $data['ids'])->delete();
        return response()->noContent(); // 204 - No Content
    }

    /**
     * @param Request $request
     * @return array
     */
    protected function validateIds(Request $request)
    {
        $model = $this->model();
        $ids = explode(',', $request->get('ids'));
        $validator = \Validator::make(
            [
                'ids' => $ids,
            ],
            [
                'ids' => 'required|exists:' . (new $model)->getTable() . ',id',
            ]
        );
        return $validator->validate();
    }

    /**
     * @return Builder
     */
    protected function queryBuilder(): Builder
    {
        return $this->model()::query();
    }
}
