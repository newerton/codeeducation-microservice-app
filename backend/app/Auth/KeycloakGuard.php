<?php

namespace App\Auth;

use App\Models\User;
use BadMethodCallException;
use Exception;
use Illuminate\Auth\GuardHelpers;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\Guard;
use Illuminate\Http\Request;
use Illuminate\Support\Traits\Macroable;
use Tymon\JWTAuth\JWT;

/**
 * Class KeycloakGuard
 * @package App\Auth
 */
class KeycloakGuard implements Guard
{

    use GuardHelpers, Macroable {
        __call as macroCall;
    }

    /**
     * @var JWT
     */
    private $jwt;

    /**
     * @var Request
     */
    private $request;

    public function __construct(JWT $jwt, Request $request)
    {
        $this->jwt = $jwt;
        $this->request = $request;
    }

    /**
     * Get the currently authenticated user.
     *
     * @return User|Authenticatable|null
     */
    public function user()
    {
        if ($this->user !== null) {
            return $this->user;
        }

        if ($token = $this->jwt->setRequest($this->request)->getToken() &&
            ($payload = $this->jwt->check(true))
        ) {
            $roles = isset($payload['realm_access']) && property_exists($payload['realm_access'], 'roles')
                ? $payload['realm_access']->roles : [];
            return $this->user = new User(
                $payload['sub'],
                $payload['name'],
                $payload['email'],
                $token,
                $roles
            );
        }
    }

    /**
     * Validate a user's credentials.
     *
     * @param array $credentials
     * @return void
     * @throws Exception
     */
    public function validate(array $credentials = [])
    {
        throw new Exception('Method not implemented');
    }

    /**
     * Magically call the JWT instance.
     *
     * @param string $method
     * @param array $parameters
     *
     * @return mixed
     * @throws BadMethodCallException
     *
     */
    public function __call($method, $parameters)
    {
        if (method_exists($this->jwt, $method)) {
            return call_user_func_array([$this->jwt, $method], $parameters);
        }

        if (static::hasMacro($method)) {
            return $this->macroCall($method, $parameters);
        }

        throw new BadMethodCallException("Method [$method] does not exist.");
    }
}
