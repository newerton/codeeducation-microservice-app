<?php

namespace Tests\Traits;

use Illuminate\Http\Request;
use Tests\Exception\TestException;

trait MockController
{
    protected abstract function controller();

    protected abstract function model();

    protected function assertRollbackStore()
    {
        $controller = $this->mockControllerToHandleRelations("rulesStore");
        $request = \Mockery::mock(Request::class);
        try {
            $controller->store($request);
        } catch (TestException $exception) {
            $this->assertCount(1, $this->model()::all());
        }
    }

    protected function mockControllerToHandleRelations($rulesToMock)
    {
        $controller = \Mockery::mock($this->controller())
            ->makePartial()
            ->shouldAllowMockingProtectedMethods();
        $controller->shouldReceive("validate")
            ->withAnyArgs()
            ->andReturn($this->sendData);
        $controller->shouldReceive($rulesToMock)
            ->withAnyArgs()
            ->andReturn([]);
        $controller->shouldReceive("handleRelations")
            ->once()
            ->andThrow(new TestException());
        return $controller;
    }

    protected function assertRollbackUpdate($collection)
    {
        $controller = $this->mockControllerToHandleRelations("rulesUpdate");
        $request = \Mockery::mock(Request::class);
        try {
            $controller->update($request, $collection->id);
        } catch (TestException $exception) {
            $this->assertEquals($collection->refresh()->toArray(), $this->model()::find($collection->id)->toArray());
        }
    }
}
