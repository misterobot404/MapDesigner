<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" href="{{asset('favicon.png')}}">
    <title>Map Helper</title>
</head>
<body>
@section('content')
    <example-component></example-component>
@endsection

<div id="app">
    @yield('content')
</div>
<!-- Scripts -->
<script type="text/javascript" src='{{ asset('/js/app.js') }}'></script>

</body>
</html>
