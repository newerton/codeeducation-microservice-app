<?php

namespace Tests\Feature\Models;

use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Ramsey\Uuid\Uuid;
use Tests\TestCase;

class CastMemberTest extends TestCase
{
    use DatabaseMigrations;

    public function testList()
    {
        factory(CastMember::class, 1)->create();
        $castMembers = CastMember::all();
        $this->assertCount(1, $castMembers);
        $categoryKeys = array_keys($castMembers->first()->getAttributes());
        $this->assertEquals(
            [
                'id',
                'name',
                'type',
                'deleted_at',
                'created_at',
                'updated_at',
            ],
            $categoryKeys
        );
    }

    public function testCreate()
    {
        /** @var CastMember $category */
        $castMember = CastMember::create([
            'name' => 'test',
            'type' => CastMember::TYPE_DIRECTOR
        ]);
        $castMember->refresh();
        $this->assertEquals('test', $castMember->name);
        $this->assertEquals(CastMember::TYPE_DIRECTOR, $castMember->type);

        $uuidV4 = Uuid::isValid($castMember->id);
        $this->assertTrue($uuidV4);
    }

    public function testUpdate()
    {
        /** @var CastMember $castMember */
        $castMember = factory(CastMember::class)->create([
            'type' => CastMember::TYPE_DIRECTOR
        ]);
        $data = [
            'type' => CastMember::TYPE_ACTOR
        ];
        $castMember->update($data);
        foreach ($data as $key => $value) {
            $this->assertEquals($value, $castMember->{$key});
        }
    }

    /**
     * @throws \Exception
     */
    public function testDelete()
    {
        /** @var CastMember $castMember */
        $castMember = factory(CastMember::class)->create();
        $castMember->delete();

        $this->assertSoftDeleted($castMember->getTable(), ['id' => $castMember->id]);
    }
}
