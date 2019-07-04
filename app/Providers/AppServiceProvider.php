<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // 本地测试时打印SQL日志
        if (app()->environment('local')){
            \DB::listen(function ($query){
                \Log::info('sql_log:'. $query->sql, $query->bindings);
            });
        }
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
