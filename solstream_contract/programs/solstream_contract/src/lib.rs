use anchor_lang::prelude::*;
use solana_program::pubkey::Pubkey;

declare_id!("9xoW3QTr4BjtJmGq2QN5mMyg96NP5TrVuZQZHbvkAVVi");

#[program]
pub mod solstream_contract {
    use super::*;

    // Artist uploads a track
    pub fn upload_track(ctx: Context<UploadTrack>, track_id: String, price: u64) -> Result<()> {
        let track = &mut ctx.accounts.track;
        track.track_id = track_id;
        track.price = price;
        track.likes = 0;
        track.shares = 0;
        Ok(())
    }

    // Fan streams a track and makes a payments
    pub fn stream_track(ctx: Context<StreamTrack>, track_id: String) -> Result<()> {
        let fan = &mut ctx.accounts.fan;
        let artist = &mut ctx.accounts.artist;
        let track = &mut ctx.accounts.track;

        // Ensure the correct track ID
        if track.track_id != track_id {
            return Err(ErrorCode::InvalidTrackId.into());
        }

        // Deduct the STM tokens from the fan's account
        if fan.stm_amount < track.price {
            return Err(ErrorCode::InsufficientFunds.into());
        }
        fan.stm_amount -= track.price;

        // Transfer the payment to the artist
        artist.stm_balance += track.price;

        // Reward the fan with points (10 points for streaming)
        fan.points += 10;

        Ok(())
    }

    // Fan likes a track
    pub fn like_track(ctx: Context<LikeTrack>, track_id: String) -> Result<()> {
        let fan = &mut ctx.accounts.fan;
        let track = &mut ctx.accounts.track;

        // Ensure the correct track ID
        if track.track_id != track_id {
            return Err(ErrorCode::InvalidTrackId.into());
        }

        // Check if already liked
        if fan.liked_tracks.contains(&track.key()) {
            return Err(ErrorCode::AlreadyLiked.into());
        }

        // Increment likes and add to liked tracks
        track.likes += 1;
        fan.liked_tracks.push(track.key());
        fan.points += 5; // Award 5 points for liking

        Ok(())
    }

    // Fan unlikes a track
    pub fn unlike_track(ctx: Context<UnlikeTrack>, track_id: String) -> Result<()> {
        let fan = &mut ctx.accounts.fan;
        let track = &mut ctx.accounts.track;

        // Ensure the correct track ID
        if track.track_id != track_id {
            return Err(ErrorCode::InvalidTrackId.into());
        }

        // Check if not liked
        if !fan.liked_tracks.contains(&track.key()) {
            return Err(ErrorCode::NotLiked.into());
        }

        // Decrement likes and remove from liked tracks
        track.likes -= 1;
        fan.liked_tracks.retain(|&id| id != track.key());
        fan.points = fan.points.saturating_sub(5); // Deduct 5 points

        Ok(())
    }

    // Fan shares a track
    pub fn share_track(ctx: Context<ShareTrack>, track_id: String) -> Result<()> {
        let fan = &mut ctx.accounts.fan;
        let track = &mut ctx.accounts.track;

        // Ensure the correct track ID
        if track.track_id != track_id {
            return Err(ErrorCode::InvalidTrackId.into());
        }

        // Increment shares and award points
        track.shares += 1;
        fan.points += 10; // Award 10 points for sharing

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(track_id: String)]
pub struct UploadTrack<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 4 + track_id.len() + 8 + 8 + 8, // Added space for likes and shares
        seeds = [b"track", user.key().as_ref(), track_id.as_bytes()],
        bump
    )]
    pub track: Account<'info, Track>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(track_id: String)]
pub struct StreamTrack<'info> {
    #[account(mut)]
    pub fan: Signer<'info>,
    #[account(mut)]
    pub artist: Account<'info, Artist>,
    #[account(mut)]
    pub track: Account<'info, Track>,
}

#[derive(Accounts)]
#[instruction(track_id: String)]
pub struct LikeTrack<'info> {
    #[account(mut)]
    pub fan: Signer<'info>,
    #[account(mut)]
    pub track: Account<'info, Track>,
}

#[derive(Accounts)]
#[instruction(track_id: String)]
pub struct UnlikeTrack<'info> {
    #[account(mut)]
    pub fan: Signer<'info>,
    #[account(mut)]
    pub track: Account<'info, Track>,
}

#[derive(Accounts)]
#[instruction(track_id: String)]
pub struct ShareTrack<'info> {
    #[account(mut)]
    pub fan: Signer<'info>,
    #[account(mut)]
    pub track: Account<'info, Track>,
}

#[account]
pub struct Track {
    pub track_id: String,
    pub price: u64, // Price to stream the track in STM tokens
    pub likes: u64, // Number of likes
    pub shares: u64, // Number of shares
}

#[account]
pub struct Artist {
    pub stm_balance: u64,
}

#[account]
pub struct Fan {
    pub stm_amount: u64,
    pub points: u64,
    pub liked_tracks: Vec<Pubkey>, // Tracks liked by the fan
}

#[error_code]
pub enum ErrorCode {
    #[msg("Track ID does not match.")]
    InvalidTrackId,
    #[msg("Insufficient funds to stream the track.")]
    InsufficientFunds,
    #[msg("Track already liked.")]
    AlreadyLiked,
    #[msg("Track not liked.")]
    NotLiked,
}