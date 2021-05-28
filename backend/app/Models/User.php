<?php

namespace App\Models;

use Exception;
use Illuminate\Contracts\Auth\Authenticatable;

class User implements Authenticatable
{
    protected $id;
    protected $name;
    protected $email;
    protected $token;

    public function __construct(string $id, string $name, string $email, string $token)
    {
        $this->id = $id;
        $this->name = $name;
        $this->email = $email;
        $this->token = $token;
    }

    /**
     * @return string
     */
    public function getAuthIdentifierName(): string
    {
        return $this->email;
    }

    /**
     * @return string
     */
    public function getAuthIdentifier(): string
    {
        return $this->id;
    }

    /**
     * @return void
     * @throws Exception
     */
    public function getAuthPassword()
    {
        throw new Exception('Method not implemented');
    }

    /**
     * @return void
     * @throws Exception
     */
    public function getRememberToken()
    {
        throw new Exception('Method not implemented');
    }

    /**
     * @param string $value
     * @throws Exception
     */
    public function setRememberToken($value)
    {
        throw new Exception('Method not implemented');
    }

    /**
     * @return void
     * @throws Exception
     */
    public function getRememberTokenName()
    {
        throw new Exception('Method not implemented');
    }
}
