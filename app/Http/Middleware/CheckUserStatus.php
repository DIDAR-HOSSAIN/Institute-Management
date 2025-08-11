<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class CheckUserStatus
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // Ensure the user is authenticated
        if (!$user) {
            return redirect()->route('login')->withErrors(['msg' => 'User not authenticated']);
        }

        // Check if user_status is 0 or 1
        if ($user->user_status == 0) {
            Auth::logout();
            return redirect()->route('login')->withErrors(['msg' => 'Your account is inactive or restricted.']);
        }

        return $next($request);
    }
}
