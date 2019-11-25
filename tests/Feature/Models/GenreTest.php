<?php

namespace Tests\Feature\Models;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Ramsey\Uuid\Uuid;
use Tests\TestCase;

class GenreTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
        factory(Genre::class, 1)->create();
        $genres = Genre::all();
        $this->assertCount(1, $genres);
        $genreKeys = array_keys($genres->first()->getAttributes());
        $this->assertEquals(
            [
                'id',
                'name',
                'is_active',
                'deleted_at',
                'created_at',
                'updated_at',
            ],
            $genreKeys
        );
    }

    public function testCreate()
    {
        /** @var Genre $genre */
        $genre = Genre::create([
            'name' => 'test'
        ]);
        $genre->refresh();
        $this->assertEquals('test', $genre->name);
        $this->assertTrue((bool)$genre->is_active);

        $genre = Genre::create([
            'name' => 'test'
        ]);
        $this->assertNull($genre->description);

        $genre = Genre::create([
            'name' => 'test',
            'is_active' => false,
        ]);
        $this->assertFalse($genre->is_active);

        $genre = Genre::create([
            'name' => 'test',
            'is_active' => true,
        ]);
        $this->assertTrue($genre->is_active);

        $genre = Genre::create([
            'name' => 'test',
            'is_active' => true,
        ]);

        $uuidV4 = Uuid::isValid($genre->id);
        $this->assertTrue($uuidV4);
    }

    public function testUpdate()
    {
        /** @var Genre $genre */
        $genre = factory(Genre::class)->create([
            'is_active' => false,
        ])->first();
        $data = [
            'name' => 'test_name_updated',
            'is_active' => true,
        ];
        $genre->update($data);
        foreach ($data as $key => $value) {
            $this->assertEquals($value, $genre->{$key});
        }
    }

    /**
     * @throws \Exception
     */
    public function testDelete()
    {
        /** @var Genre $genre */
        $genre = factory(Genre::class)->create();
        $genre->delete();

        $this->assertSoftDeleted($genre->getTable(), ['id' => $genre->id]);
    }
}
