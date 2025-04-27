<?php

namespace App\Mail;

// app/Mail/InvitationEmail.php

namespace App\Mail;

use App\Models\Invitation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvitationEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $invitation;

    // Constructeur
    public function __construct(Invitation $invitation)
    {
        $this->invitation = $invitation;
    }

    public function build()
    {
        return $this->view('emails.invitation')
                    ->with([
                        'url' => url('http://localhost:3000/invitation/validate/' . $this->invitation->token),
                        'name' => $this->invitation->name,
                    ]);
    }
}
