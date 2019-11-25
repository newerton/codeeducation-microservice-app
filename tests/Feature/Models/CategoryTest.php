<?php

namespace Tests\Feature\Models;

use App\Models\Category;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CategoryTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
        factory(Category::class, 1)->create();
        $categories = Category::all();
        $this->assertCount(1, $categories);
        $categoryKeys = array_keys($categories->first()->getAttributes());
        $this->assertEquals(
            [
                'id',
                'name',
                'description',
                'is_active',
                'deleted_at',
                'created_at',
                'updated_at',
            ],
            $categoryKeys
        );
    }

    public function testCreate()
    {
        /** @var Category $category */
        $category = Category::create([
            'name' => 'test'
        ]);
        $category->refresh();
        $this->assertEquals('test', $category->name);
        $this->assertNull($category->description);
        $this->assertTrue((bool)$category->is_active);

        $category = Category::create([
            'name' => 'test',
            'description' => null,
        ]);
        $this->assertNull($category->description);

        $category = Category::create([
            'name' => 'test',
            'description' => 'test_description',
        ]);
        $this->assertEquals('test_description', $category->description);

        $category = Category::create([
            'name' => 'test',
            'is_active' => false,
        ]);
        $this->assertFalse($category->is_active);

        $category = Category::create([
            'name' => 'test',
            'is_active' => true,
        ]);
        $this->assertTrue($category->is_active);
    }

    public function testUpdate()
    {
        /** @var Category $category */
        $category = factory(Category::class)->create([
            'description' => 'test_description',
            'is_active' => false,
        ])->first();
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
}
