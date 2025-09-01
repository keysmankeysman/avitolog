<?php

if ( empty($_POST['phone']) ||
     empty($_SERVER['HTTP_X_REQUESTED_WITH']) ||
     strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest' )
    die;

$apiKey = 'pLTyZFoEn5OEvefjKO1C7tm6Xx6GdLYizoe4VXkb4Gp9JaVHY3aR5GTDJzvlsQammrD2kZp9p9tSrgGIWTmQB3Uoi442lj8RkrJ0qLmsd8I78lNZcwhsnN7GbVBntQBV';

$name = htmlspecialchars($_POST['fullname']);
$phone = htmlspecialchars($_POST['phone']);
$email = htmlspecialchars($_POST['email']);
$telegram = htmlspecialchars($_POST['telegram']);
$tariff = htmlspecialchars($_POST['tariff']);

$data = [
    'user' => [
        'first_name' => $name,
        'phone' => $phone
    ]
];

if ( !empty($email) )
    $data['user']['email'] = $email;
if ( !empty($telegram) )
    $data['user']['addfields']['TG'] = $telegram;
if ( !empty($tariff) )
    $data['user']['addfields']['Тариф'] = $tariff;

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://serviceleadbusinessschool.getcourse.ru/pl/api/users");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, 'action=add&key=' . $apiKey . '&params=' . base64_encode(json_encode($data)));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json; q=1.0, */*; q=0.1']);
$output = curl_exec($ch);
curl_close($ch);
echo $output;