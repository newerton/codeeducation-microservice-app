<?php

namespace Tests\Browser;

use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class FrontendTest extends DuskTestCase
{
    /**
     * A Dusk test example.
     *
     * @return void
     */
    public function testExample()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/backend/categories')
                ->waitForText('Listagem de categorias', 2)
                ->assertSee('Listagem de categorias');
        });
    }
}
