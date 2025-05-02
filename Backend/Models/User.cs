using System;
using System.Collections.Generic;

namespace Backend.Models;

public partial class User
{
    public int Id { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? PasswordHash { get; set; }

    /// <summary>
    /// Name of the sign in-method. for example &apos;google&apos;. If the user is registered using email/pwd, this shall be &apos;local&apos;
    /// </summary>
    public string Provider { get; set; } = null!;

    /// <summary>
    /// Id from the provider, for example a Google user id if the user is registered via Google.
    /// </summary>
    public string? ProviderId { get; set; }

    public bool IsAdmin { get; set; }

    public DateTime CreatedTimestamp { get; set; }

    public virtual ICollection<Friend> FriendReceivers { get; set; } = new List<Friend>();

    public virtual ICollection<Friend> FriendSenders { get; set; } = new List<Friend>();

    public virtual ICollection<PlaceVisit> PlaceVisits { get; set; } = new List<PlaceVisit>();

    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();

    public virtual ICollection<Place> Places { get; set; } = new List<Place>();
}
