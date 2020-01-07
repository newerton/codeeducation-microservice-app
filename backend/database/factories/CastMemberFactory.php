<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\CastMember;
use Faker\Generator as Faker;

$factory->define(CastMember::class, function (Faker $faker) {
    $types = [CastMember::TYPE_DIRECTOR, CastMember::TYPE_ACTOR];
    $rand_keys = array_rand($types);
    return [
        'name' => $faker->lastName,
        'type' => $types[$rand_keys],
    ];
});
