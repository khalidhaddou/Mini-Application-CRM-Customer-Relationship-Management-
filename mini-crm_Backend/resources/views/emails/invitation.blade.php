
<html>
<head>
    <title>Invitation</title>
</head>
<body>
    <h1>Vous avez été invité(e) !</h1>
    <p>Bonjour {{ $invitation->name }},</p>
    <p>Vous avez été invité à rejoindre notre application.</p>
    <p>Veuillez cliquer sur le lien ci-dessous pour compléter votre profil :</p>
    <a href="{{ $url }}">Compléter votre profil</a>
</body>
</html>
