<?php

namespace App\Models\Traits;

/**
 * Trait SerializeDateToIso8601
 * @package App\Models\Traits
 */
trait SerializeDateToIso8601
{
    protected function serializeDate(\DateTimeInterface $data)
    {
        return $data->format(\DateTime::ISO8601);
    }
}
