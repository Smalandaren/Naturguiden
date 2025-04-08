using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class Friend
{
    public int SenderId { get; set; }

    public int ReceiverId { get; set; }

    public bool Confirmed { get; set; }

    public DateTime TimeSent { get; set; }

    public DateTime? TimeConfirmed { get; set; }

    public virtual User Receiver { get; set; } = null!;

    public virtual User Sender { get; set; } = null!;
}
