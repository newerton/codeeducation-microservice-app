<?php

namespace Tests\Feature\Models;

use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Ramsey\Uuid\Uuid;
use Tests\TestCase;

class VideoTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
        factory(Video::class, 1)->create();
        $videos = Video::all();
        $this->assertCount(1, $videos);
        $categoryKeys = array_keys($videos->first()->getAttributes());
        $this->assertEquals(
            [
                'id',
                'title',
                'description',
                'year_launched',
                'opened',
                'rating',
                'duration',
                'deleted_at',
                'created_at',
                'updated_at',
            ],
            $categoryKeys
        );
    }

    public function testCreate()
    {
        /** @var Video $category */
        $category = Video::create([
            'name' => 'test'
        ]);
        $category->refresh();
        $this->assertEquals('test', $category->name);
        $this->assertNull($category->description);
        $this->assertTrue((bool)$category->is_active);

        $category = Video::create([
            'name' => 'test',
            'description' => null,
        ]);
        $this->assertNull($category->description);

        $category = Video::create([
            'name' => 'test',
            'description' => 'test_description',
        ]);
        $this->assertEquals('test_description', $category->description);

        $category = Video::create([
            'name' => 'test',
            'is_active' => false,
        ]);
        $this->assertFalse($category->is_active);

        $category = Video::create([
            'name' => 'test',
            'is_active' => true,
        ]);
        $this->assertTrue($category->is_active);

        $category = Video::create([
            'name' => 'test',
            'is_active' => true,
        ]);

        $uuidV4 = Uuid::isValid($category->id);
        $this->assertTrue($uuidV4);
    }

    public function testUpdate()
    {
        /** @var Video $category */
        $category = factory(Video::class)->create([
            'description' => 'test_description',
            'is_active' => false,
        ]);
        $data = [
            'name' => 'test_name_updated',
            'description' => 'test_description_updated',
            'is_active' => true,
        ];
        $category->update($data);
        foreach ($data as $key => $value) {
            $this->assertEquals($value, $category->{$key});
        }
    }

    /**
     * @throws \Exception
     */
    public function testDelete()
    {
        /** @var Video $category */
        $category = factory(Video::class)->create();
        $category->delete();

        $this->assertSoftDeleted($category->getTable(), ['id' => $category->id]);
    }
}
