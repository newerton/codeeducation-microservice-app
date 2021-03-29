<?php

namespace Tests\Feature\Http\Controllers\Api\VideoController;

use App\Http\Resources\VideoResource;
use App\Models\CastMember;
use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Tests\Traits\MockController;
use Tests\Traits\TestResources;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class VideoControllerCrudTest extends BaseVideoControllerTestCase
{
    use TestValidations, TestSaves, TestResources, MockController;

    private $serializedFields = [
        'id',
        'title',
        'description',
        'year_launched',
        'opened',
        'rating',
        'duration',
        'thumb_file_url',
        'banner_file_url',
        'trailer_file_url',
        'video_file_url',
        'created_at',
        'updated_at',
        'deleted_at',
        'categories' => [
            '*' => [
                'id',
                'name',
                'description',
                'is_active',
                'created_at',
                'updated_at',
                'deleted_at',
            ]
        ],
        'genres' => [
            '*' => [
                'id',
                'name',
                'is_active',
                'created_at',
                'updated_at',
                'deleted_at',
            ]
        ],
        'cast_members' => [
            '*' => [
                'id',
                'name',
                'type',
                'created_at',
                'updated_at',
                'deleted_at',
            ]
        ]
    ];

    protected function controller()
    {
        return VideoControllerCrudTest::class;
    }

    protected function model()
    {
        return Video::class;
    }

    protected function routeStore()
    {
        return route('videos.store');
    }

    protected function routeUpdate()
    {
        return route('videos.update', ['video' => $this->video->id]);
    }

    public function testIndex()
    {
        $response = $this->get(route('videos.index'));
        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => ['*' => $this->serializedFields],
                'meta' => [],
                'links' => []
            ]);
        $this->assertResource($response, VideoResource::collection(collect([$this->video])));
        $this->assertIfFilesUrlExists($this->video, $response);
    }

    public function testShow()
    {
        $response = $this->get(route('videos.show', ['video' => $this->video->id]));

        $response
            ->assertStatus(200)
            ->assertJsonStructure([
                'data' => $this->serializedFields
            ]);
        $this->assertResource($response, new VideoResource(Video::find($response->json('data.id'))));
        $this->assertIfFilesUrlExists($this->video, $response);
    }

    public function testInvalidationRequired()
    {
        $data = [
            'title' => '',
            'description' => '',
            'year_launched' => '',
            'rating' => '',
            'duration' => '',
            'categories_id' => '',
            'genres_id' => '',
            'cast_members_id' => '',
        ];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');
    }

    public function testInvalidationMax()
    {
        $data = ['title' => str_repeat('a', 256)];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);
    }

    public function testInvalidationInteger()
    {
        $data = ['duration' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'integer');
        $this->assertInvalidationInUpdateAction($data, 'integer');
    }

    public function testInvalidationYearLaunchedField()
    {
        $data = ['year_launched' => 'a',];
        $this->assertInvalidationInStoreAction($data, 'date_format', ['format' => 'Y']);
        $this->assertInvalidationInUpdateAction($data, 'date_format', ['format' => 'Y']);
    }

    public function testInvalidationOpenedField()
    {
        $data = ['opened' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');
    }

    public function testInvalidationRatingField()
    {
        $data = ['rating' => 0];
        $this->assertInvalidationInStoreAction($data, 'in');
        $this->assertInvalidationInUpdateAction($data, 'in');
    }

    public function testInvalidationCategoriesIdField()
    {
        $data = ['categories_id' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'array');
        $this->assertInvalidationInUpdateAction($data, 'array');

        $data = ['categories_id' => [100]];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

        $category = factory(Category::class)->create();
        $category->delete();

        $data = ['categories_id' => [$category->id]];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');
    }

    public function testInvalidationGenresIdField()
    {
        $data = ['genres_id' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'array');
        $this->assertInvalidationInUpdateAction($data, 'array');

        $data = ['genres_id' => [100]];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

        $genre = factory(Genre::class)->create();
        $genre->delete();
        $data = ['genres_id' => [$genre->id]];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');
    }

    /**
     * @throws \Exception
     */
    public function testSaveWithoutFiles()
    {
        $testData = Arr::except($this->sendData, ['categories_id', 'genres_id', 'cast_members_id']);
        $data = [
            [
                'send_data' => $this->sendData,
                'test_data' => $testData + ['opened' => false],
            ],
            [
                'send_data' => $this->sendData + ['opened' => true],
                'test_data' => $testData + ['opened' => true],
            ],
            [
                'send_data' => $this->sendData + ['rating' => Video::RATING_LIST[1]],
                'test_data' => $testData + ['rating' => Video::RATING_LIST[1]],
            ]
        ];

        foreach ($data as $key => $value) {
            $response = $this->assertStore(
                $value['send_data'],
                $value['test_data'] + ['deleted_at' => null]
            );
            $response->assertJsonStructure(['data' => $this->serializedFields]);
            $this->assertResource($response, new VideoResource(Video::find($response->json('data.id'))));

            $response = $this->assertUpdate(
                $value['send_data'],
                $value['test_data'] + ['deleted_at' => null]
            );
            $response->assertJsonStructure(['data' => $this->serializedFields]);
            $videoResource = new VideoResource(Video::find($response->json('data.id')));
            $this->assertResource($response, $videoResource);
        }
    }

    public function testSyncCategories()
    {
        $testData = Arr::except($this->sendData, ['categories_id', 'genres_id', 'cast_members_id']);

        $categoriesId = factory(Category::class, 3)->create()->pluck('id')->toArray();
        $genre = factory(Genre::class)->create();
        $genre->categories()->sync($categoriesId);
        $genreId = $genre->id;
        $castMemberId = factory(CastMember::class)->create()->id;

        $response = $this->json(
            'POST',
            $this->routeStore(),
            $testData + ['genres_id' => [$genreId], 'categories_id' => [$categoriesId[0]], 'cast_members_id' => [$castMemberId]]
        );

        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoriesId[0],
            'video_id' => $response->json('data.id')
        ]);

        $response = $this->json(
            'PUT',
            route('videos.update', ['video' => $response->json('data.id')]),
            $testData + ['genres_id' => [$genreId], 'categories_id' => [$categoriesId[1], $categoriesId[2]], 'cast_members_id' => [$castMemberId]]
        );

        $this->assertDatabaseMissing('category_video', [
            'category_id' => $categoriesId[0],
            'video_id' => $response->json('data.id')
        ]);
        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoriesId[1],
            'video_id' => $response->json('data.id')
        ]);
        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoriesId[2],
            'video_id' => $response->json('data.id')
        ]);
    }

    public function testSyncGenres()
    {
        $testData = Arr::except($this->sendData, ['categories_id', 'genres_id', 'cast_members_id']);

        /** @var Collection $genres */
        $genres = factory(Genre::class, 3)->create();
        $genresId = $genres->pluck('id')->toArray();
        $categoryId = factory(Category::class)->create()->id;
        $genres->each(function ($genre) use ($categoryId) {
            /** @var Genre $genre */
            $genre->categories()->sync($categoryId);
        });
        $castMemberId = factory(CastMember::class)->create()->id;

        $response = $this->json(
            'POST',
            $this->routeStore(),
            $testData + ['genres_id' => [$genresId[0]], 'categories_id' => [$categoryId], 'cast_members_id' => [$castMemberId]]
        );
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genresId[0],
            'video_id' => $response->json('data.id')
        ]);

        $response = $this->json(
            'PUT',
            route('videos.update', ['video' => $response->json('data.id')]),
            $testData + ['genres_id' => [$genresId[1], $genresId[2]], 'categories_id' => [$categoryId], 'cast_members_id' => [$castMemberId]]
        );

        $this->assertDatabaseMissing('genre_video', [
            'genre_id' => $genresId[0],
            'video_id' => $response->json('data.id')
        ]);
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genresId[1],
            'video_id' => $response->json('data.id')
        ]);
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genresId[2],
            'video_id' => $response->json('data.id')
        ]);
    }

    public function testSyncCastMembers()
    {
        $testData = Arr::except($this->sendData, ['categories_id', 'genres_id', 'cast_members_id']);

        /** @var Collection $genres */
        $genres = factory(Genre::class, 3)->create();
        $genresId = $genres->pluck('id')->toArray();
        $categoryId = factory(Category::class)->create()->id;
        $genres->each(function ($genre) use ($categoryId) {
            /** @var Genre $genre */
            $genre->categories()->sync($categoryId);
        });
        $castMembers = factory(CastMember::class, 3)->create();
        $castMembersId = $castMembers->pluck('id')->toArray();

        $response = $this->json(
            'POST',
            $this->routeStore(),
            $testData + ['genres_id' => [$genresId[0]], 'categories_id' => [$categoryId], 'cast_members_id' => [$castMembersId[0]]]
        );
        $this->assertDatabaseHas('cast_member_video', [
            'cast_member_id' => $castMembersId[0],
            'video_id' => $response->json('data.id')
        ]);

        $response = $this->json(
            'PUT',
            route('videos.update', ['video' => $response->json('data.id')]),
            $testData + ['genres_id' => [$genresId[1], $genresId[2]], 'categories_id' => [$categoryId], 'cast_members_id' => [$castMembersId[1], $castMembersId[2]]]
        );

        $this->assertDatabaseMissing('cast_member_video', [
            'cast_member_id' => $castMembersId[0],
            'video_id' => $response->json('data.id')
        ]);
        $this->assertDatabaseHas('cast_member_video', [
            'cast_member_id' => $castMembersId[1],
            'video_id' => $response->json('data.id')
        ]);
        $this->assertDatabaseHas('cast_member_video', [
            'cast_member_id' => $castMembersId[2],
            'video_id' => $response->json('data.id')
        ]);
    }

//    public function testRollbackStore()
//    {
//        $this->assertRollbackStore();
//    }
//
//    public function testRollbackUpdate()
//    {
//        $this->assertRollbackUpdate($this->video);
//    }

    public function testDestroy()
    {
        $response = $this->json(
            'DELETE',
            route('videos.destroy', ['video' => $this->video->id]),
            [
                'name' => 'test',
                'description' => 'test',
                'is_active' => true,
            ]
        );

        $response
            ->assertStatus(204);
        $this->assertNull(Video::find($this->video->id));
        $this->assertNotNull(Video::withTrashed()->find($this->video->id));
    }

    protected function assertHasCategory($videoId, $categoryId)
    {
        $this->assertDatabaseHas('category_video', [
            'video_id' => $videoId,
            'category_id' => $categoryId,
        ]);
    }

    protected function assertHasGenre($videoId, $genreId)
    {
        $this->assertDatabaseHas('genre_video', [
            'video_id' => $videoId,
            'genre_id' => $genreId,
        ]);
    }
}
