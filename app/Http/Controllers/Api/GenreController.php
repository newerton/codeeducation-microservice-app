<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends Controller
{
    private $rules = [
        'name' => 'required|max:255',
        'is_active' => 'boolean',
    ];

    /**
     * @param Request $request
     * @return Genre[]|\Illuminate\Database\Eloquent\Collection
     */
    public function index(Request $request)
    {
        return Genre::all();
    }

    /**
     * @param Request $request
     * @return mixed
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request)
    {
        /** @var Genre $genre */
        $this->validate($request, $this->rules);
        $genre = Genre::create($request->all());
        $genre->refresh();
        return $genre;
    }

    /**
     * @param Genre $genre
     * @return Genre
     */
    public function show(Genre $genre)
    {
        return $genre;
    }

    /**
     * @param Request $request
     * @param Genre $genre
     * @return Genre
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(Request $request, Genre $genre)
    {
        $this->validate($request, $this->rules);
        $genre->update($request->all());
        return $genre;
    }

    /**
     * @param Genre $genre
     * @return \Illuminate\Http\Response
     * @throws \Exception
     */
    public function destroy(Genre $genre)
    {
        $genre->delete();
        return response()->noContent(); // 204 - No Content
    }
}
