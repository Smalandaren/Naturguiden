using System;
using System.Collections.Generic;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public partial class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AvailableCategory> AvailableCategories { get; set; }

    public virtual DbSet<AvailableUtility> AvailableUtilities { get; set; }

    public virtual DbSet<Friend> Friends { get; set; }

    public virtual DbSet<Image> Images { get; set; }

    public virtual DbSet<Place> Places { get; set; }

    public virtual DbSet<PlaceCategory> PlaceCategories { get; set; }

    public virtual DbSet<PlaceUtility> PlaceUtilities { get; set; }

    public virtual DbSet<PlaceVisit> PlaceVisits { get; set; }

    public virtual DbSet<Review> Reviews { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<AnnouncementBanner> AnnouncementBanners { get; set; }
    public virtual DbSet<PlaceSuggestion> PlaceSuggestions { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AvailableCategory>(entity =>
        {
            entity.HasKey(e => e.Name).HasName("AvailableCategories_pkey");

            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Description).HasColumnName("description");
        });
        modelBuilder.Entity<AvailableUtility>(entity =>
        {
            entity.HasKey(e => e.Name).HasName("AvailableUtilities_pkey");

            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Description).HasColumnName("description");
        });

        modelBuilder.Entity<Friend>(entity =>
        {
            entity.HasKey(e => new { e.SenderId, e.ReceiverId }).HasName("Friends_pkey");

            entity.Property(e => e.SenderId).HasColumnName("sender_id");
            entity.Property(e => e.ReceiverId).HasColumnName("receiver_id");
            entity.Property(e => e.Confirmed).HasColumnName("confirmed");
            entity.Property(e => e.TimeConfirmed)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("time_confirmed");
            entity.Property(e => e.TimeSent)
                .HasColumnType("timestamp without time zone")
                .HasColumnName("time_sent");

            entity.HasOne(d => d.Receiver).WithMany(p => p.FriendReceivers)
                .HasForeignKey(d => d.ReceiverId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Friends_receiver_id_fkey");

            entity.HasOne(d => d.Sender).WithMany(p => p.FriendSenders)
                .HasForeignKey(d => d.SenderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Friends_sender_id_fkey");
        });

        modelBuilder.Entity<Image>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Images_pkey");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Url).HasColumnName("url");
            entity.Property(e => e.Filename).HasColumnName("filename");
            entity.Property(e => e.PlaceId).HasColumnName("place_id");
            entity.HasOne(d => d.Place).WithMany(p => p.Images)
                .HasForeignKey(d => d.PlaceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Images_place_id_fkey");
        });

        modelBuilder.Entity<Place>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Places_pkey");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.Approved).HasColumnName("approved");
            entity.Property(e => e.CreatedBy)
                .HasComment("Can be null due to deleted users")
                .HasColumnName("created_by");
            entity.Property(e => e.CreatedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_timestamp");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Latitude)
                .HasPrecision(9, 6)
                .HasColumnName("latitude");
            entity.Property(e => e.Longitude)
                .HasPrecision(9, 6)
                .HasColumnName("longitude");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<Place>()
            .HasMany<AvailableCategory>("Categories")
            .WithMany()
            .UsingEntity(j => j.ToTable("PlaceAvailableCategories"));

        modelBuilder.Entity<Place>()
            .HasMany<AvailableUtility>("Attributes")
            .WithMany()
            .UsingEntity(j => j.ToTable("PlaceAvailableUtilities"));
        modelBuilder.Entity<PlaceCategory>(entity =>
        {
            entity.HasKey(e => new { e.PlaceId, e.CategoryName }).HasName("PlaceCategories_pkey");

            entity.Property(e => e.PlaceId).HasColumnName("place_id");
            entity.Property(e => e.CategoryName).HasColumnName("category_name");
            entity.Property(e => e.Description).HasColumnName("description");

            entity.HasOne(d => d.CategoryNameNavigation).WithMany(p => p.PlaceCategories)
                .HasForeignKey(d => d.CategoryName)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("PlaceCategories_category_name_fkey");

            entity.HasOne(d => d.Place).WithMany(p => p.PlaceCategories)
                .HasForeignKey(d => d.PlaceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("PlaceCategories_place_id_fkey");
        });

        modelBuilder.Entity<PlaceUtility>(entity =>
        {
            entity.HasKey(e => new { e.PlaceId, e.UtilityName }).HasName("PlaceUtilities_pkey");

            entity.Property(e => e.PlaceId).HasColumnName("place_id");
            entity.Property(e => e.UtilityName).HasColumnName("utility_name");
            entity.Property(e => e.Description).HasColumnName("description");

            entity.HasOne(d => d.Place).WithMany(p => p.PlaceUtilities)
                .HasForeignKey(d => d.PlaceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("PlaceUtilities_place_id_fkey");

            entity.HasOne(d => d.UtilityNameNavigation).WithMany(p => p.PlaceUtilities)
                .HasForeignKey(d => d.UtilityName)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("PlaceUtilities_utility_name_fkey");
        });

        modelBuilder.Entity<PlaceVisit>(entity =>
        {
            entity.HasKey(e => new { e.UserId, e.PlaceId }).HasName("PlaceVisits_pkey");

            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.PlaceId).HasColumnName("place_id");
            entity.Property(e => e.CreatedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_timestamp");

            entity.HasOne(d => d.Place).WithMany(p => p.PlaceVisits)
                .HasForeignKey(d => d.PlaceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("PlaceVisits_place_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.PlaceVisits)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("PlaceVisits_user_id_fkey");
        });

        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Reviews_pkey");

            entity.Property(e => e.Id)
                .ValueGeneratedNever()
                .HasColumnName("id");
            entity.Property(e => e.Comment).HasColumnName("comment");
            entity.Property(e => e.CreatedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_timestamp");
            entity.Property(e => e.PlaceId).HasColumnName("place_id");
            entity.Property(e => e.Rating)
                .HasComment("1-5")
                .HasColumnName("rating");
            entity.Property(e => e.UserId)
                .HasComment("Can be null due to deleted users")
                .HasColumnName("user_id");

            entity.HasOne(d => d.Place).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.PlaceId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("Reviews_place_id_fkey");

            entity.HasOne(d => d.User).WithMany(p => p.Reviews)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("Reviews_user_id_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Users_pkey");

            entity.HasIndex(e => e.Email, "Users_email_key").IsUnique();

            entity.Property(e => e.Id)
                .HasColumnName("id");
            entity.Property(e => e.CreatedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_timestamp");
            entity.Property(e => e.Email).HasColumnName("email");
            entity.Property(e => e.FirstName).HasColumnName("first_name");
            entity.Property(e => e.IsAdmin).HasColumnName("is_admin");
            entity.Property(e => e.LastName).HasColumnName("last_name");
            entity.Property(e => e.PasswordHash).HasColumnName("password_hash");
            entity.Property(e => e.Provider)
                .HasComment("Name of the sign in-method. for example 'google'. If the user is registered using email/pwd, this shall be 'local'")
                .HasColumnName("provider");
            entity.Property(e => e.ProviderId)
                .HasComment("Id from the provider, for example a Google user id if the user is registered via Google.")
                .HasColumnName("provider_id");

            entity.HasMany(d => d.Places).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "Wishlist",
                    r => r.HasOne<Place>().WithMany()
                        .HasForeignKey("PlaceId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("Wishlist_place_id_fkey"),
                    l => l.HasOne<User>().WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("Wishlist_user_id_fkey"),
                    j =>
                    {
                        j.HasKey("UserId", "PlaceId").HasName("Wishlist_pkey");
                        j.ToTable("Wishlist");
                        j.IndexerProperty<int>("UserId").HasColumnName("user_id");
                        j.IndexerProperty<int>("PlaceId").HasColumnName("place_id");
                    });
        });

        modelBuilder.Entity<AnnouncementBanner>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("AnnouncementBanner_pkey");

            entity.ToTable("AnnouncementBanner");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ButtonLink).HasColumnName("button_link");
            entity.Property(e => e.ButtonText).HasColumnName("button_text");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.ShowButton).HasColumnName("show_button");
            entity.Property(e => e.Subtitle).HasColumnName("subtitle");
            entity.Property(e => e.Title).HasColumnName("title");
            entity.Property(e => e.Type)
                .HasComment("'information' or 'danger'")
                .HasColumnName("type");
        });

        modelBuilder.Entity<Place>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Places_pkey");

            entity.Property(e => e.Id)
                .HasColumnName("id")
                .ValueGeneratedOnAdd();

            entity.Property(e => e.Address).HasColumnName("address");
            entity.Property(e => e.Approved).HasColumnName("approved");
            entity.Property(e => e.CreatedBy).HasColumnName("created_by");
            entity.Property(e => e.CreatedTimestamp)
                .HasDefaultValueSql("CURRENT_TIMESTAMP")
                .HasColumnType("timestamp without time zone")
                .HasColumnName("created_timestamp");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.Latitude)
                .HasPrecision(9, 6)
                .HasColumnName("latitude");
            entity.Property(e => e.Longitude)
                .HasPrecision(9, 6)
                .HasColumnName("longitude");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<PlaceSuggestion>()
     .HasMany(p => p.Categories)
     .WithMany()
     .UsingEntity<Dictionary<string, object>>(
         "PlaceSuggestionCategories",
         r => r.HasOne<AvailableCategory>()
               .WithMany()
               .HasForeignKey("AvailableCategoryName")
               .HasConstraintName("FK_PlaceSuggestionCategories_Category"),
         l => l.HasOne<PlaceSuggestion>()
               .WithMany()
               .HasForeignKey("PlaceSuggestionId")
               .HasConstraintName("FK_PlaceSuggestionCategories_Suggestion")
     );

        modelBuilder.Entity<PlaceSuggestion>()
            .HasMany(p => p.Attributes)
            .WithMany()
            .UsingEntity<Dictionary<string, object>>(
                "PlaceSuggestionAttributes",
                r => r.HasOne<AvailableUtility>()
                      .WithMany()
                      .HasForeignKey("AvailableUtilityName")
                      .HasConstraintName("FK_PlaceSuggestionAttributes_Utility"),
                l => l.HasOne<PlaceSuggestion>()
                      .WithMany()
                      .HasForeignKey("PlaceSuggestionId")
                      .HasConstraintName("FK_PlaceSuggestionAttributes_Suggestion")
            );

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
