<?php

use Illuminate\Support\Facades\Auth;

function pagination($request, $data)
{
    $page = $request->page;
    $limit = 8;
    $total = (clone $data)->pluck('id')->count();
    $offset = ($page - 1) * $limit;
    $total_page = ceil($total / $limit);
    $data = compact('limit', 'total', 'offset', 'total_page');
    return $data;
}

function pageInfo($pagination, $total_current)
{
    $data = [
        'offset' => $pagination['offset'],
        'limit' => $pagination['limit'],
        'total' => $pagination['total'],
        'total_page' => $pagination['total_page'],
        'total_current' => $total_current,
    ];
    return $data;
}

function months()
{
    $months = array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    return $months;
}
