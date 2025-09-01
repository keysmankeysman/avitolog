<?php

if ( empty($_POST['code']) ||
    empty($_SERVER['HTTP_X_REQUESTED_WITH']) ||
    strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest' )
    die;

$promo = 'gofddododo4554944';

$code = htmlspecialchars($_POST['code']);

if ( $promo === $code )
    die('{"success":"true"}');
else
    die('{"success":"false"}');
