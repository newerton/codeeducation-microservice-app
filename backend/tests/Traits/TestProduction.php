<?php

namespace Tests\Traits;

use Tests\TestCase;

trait TestProduction
{
    protected function skipTestIfNotProdution($message = '')
    {
        if (!$this->isTestingProduction()) {
            $this->markTestSkipped($message);
        }
    }

    protected function isTestingProduction()
    {
        return env('TESTING_PROD') !== false;
    }
}
