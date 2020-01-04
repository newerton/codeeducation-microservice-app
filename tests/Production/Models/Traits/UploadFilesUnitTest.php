<?php

namespace Tests\Production\Models\Traits;

use App\Models\Category;
use App\Models\Traits\Uuid;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\UploadedFile;
use Tests\Stubs\Models\UploadFilesStub;
use Tests\TestCase;
use Tests\Traits\TestStorages;

class UploadFilesProductionTest extends TestCase
{
    use TestStorages;

    private $obj;

    protected function setUp(): void
    {
        parent::setUp();
        $this->obj = new UploadFilesStub();
        \Config::set('filesystems.default', 'gcs');
        $this->deleteAllFiles();
    }

    public function testUploadFile()
    {
        $file = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFile($file);
        \Storage::assertExists("test/{$file->hashName()}");
    }

    public function testUploadFiles()
    {
        $file1 = UploadedFile::fake()->create('video.mp4');
        $file2 = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFiles([$file1, $file2]);
        \Storage::assertExists("test/{$file1->hashName()}");
        \Storage::assertExists("test/{$file2->hashName()}");
    }

    public function testDeleteOldFile()
    {
        $file1 = UploadedFile::fake()->create('video.mp4')->size(1);
        $file2 = UploadedFile::fake()->create('video.mp4')->size(1);
        $this->obj->uploadFiles([$file1, $file2]);
        $this->obj->deleteOldFiles();
        $this->assertCount(2, \Storage::allFiles());

        $this->obj->oldFiles = [$file1->hashName()];
        $this->obj->deleteOldFiles();
        \Storage::assertMissing("test/{$file1->hashName()}");
        \Storage::assertExists("test/{$file2->hashName()}");
    }

    public function testDeleteFile()
    {
        $file = UploadedFile::fake()->create('video.mp4');
        $filename = $file->hashName();
        $this->obj->uploadFile($file);
        $this->obj->deleteFile($filename);
        \Storage::assertMissing("test/{$filename}");

        $file = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFile($file);
        $this->obj->deleteFile($file);
        \Storage::assertMissing("test/{$file->hashName()}");
    }

    public function testeDeleteFiles()
    {
        $file1 = UploadedFile::fake()->create('video.mp4');
        $file2 = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFiles([$file1, $file2]);
        $this->obj->deleteFiles([$file1->hashName(), $file2]);
        \Storage::assertMissing("test/{$file1->hashName()}");
        \Storage::assertMissing("test/{$file2->hashName()}");
    }

}
