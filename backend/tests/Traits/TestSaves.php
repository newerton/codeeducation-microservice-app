<?php
declare(strict_types=1);

namespace Tests\Traits;

use Illuminate\Foundation\Testing\TestResponse;

trait TestSaves
{
    protected abstract function model();

    protected abstract function routeStore();

    protected abstract function routeUpdate();

    /**
     * @param array $sendData
     * @param array $testDatabase
     * @param array|null $testJsonData
     * @return TestResponse
     * @throws \Exception
     */
    protected function assertStore(array $sendData, array $testDatabase, array $testJsonData = null): TestResponse
    {
        /** @var TestResponse $response */
        $response = $this->json('POST', $this->routeStore(), $sendData);
        if ($response->status() !== 201) {
            throw new \Exception("Response status must be 201, given {$response->status()}:\n{$response->content()}");
        }
        $this->assertInDatabase($response, $testDatabase);
        $this->assertJsonResponseContent($response, $testDatabase, $testJsonData);
        return $response;
    }

    /**
     * @param array $sendData
     * @param array $testDatabase
     * @param array|null $testJsonData
     * @return TestResponse
     * @throws \Exception
     */
    protected function assertUpdate(array $sendData, array $testDatabase, array $testJsonData = null): TestResponse
    {
        /** @var TestResponse $response */
        $response = $this->json('PUT', $this->routeUpdate(), $sendData);
        if ($response->status() !== 200) {
            throw new \Exception("Response status must be 201, given {$response->status()}:\n{$response->content()}");
        }
        $this->assertInDatabase($response, $testDatabase);
        $this->assertJsonResponseContent($response, $testDatabase, $testJsonData);
        return $response;
    }

    private function assertInDatabase(TestResponse $response, array $testDatabase)
    {
        $model = $this->model();
        $table = (new $model)->getTable();
        $this->assertDatabaseHas($table, $testDatabase + $this->getResponseId($response));
    }

    private function assertJsonResponseContent(TestResponse $response, array $testDatabase, array $testJsonData = null)
    {
        $testResponse = $testJsonData ?? $testDatabase;
        $response->assertJsonFragment($testResponse + $this->getResponseId($response));
    }

    private function getResponseId(TestResponse $response)
    {
        return ['id' => $response->json('id') ?? $response->json('data.id')];
    }
}
