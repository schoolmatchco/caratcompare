#!/usr/bin/env python3
"""
Upload Diamond Comparison Videos to YouTube

Setup:
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials
5. Download credentials as 'client_secrets.json' in scripts/ folder
6. Run this script - it will open browser for auth

Requirements:
    pip install google-api-python-client google-auth-oauthlib google-auth-httplib2
"""

import os
import json
import time
from pathlib import Path
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle

# Configuration
PROJECT_ROOT = Path(__file__).parent.parent
VIDEO_DIR = PROJECT_ROOT / 'generated_videos'
CLIENT_SECRETS_FILE = Path(__file__).parent / 'client_secrets.json'
TOKEN_FILE = Path(__file__).parent / 'token.pickle'

# YouTube API scopes
SCOPES = ['https://www.googleapis.com/auth/youtube.upload']

def get_authenticated_service():
    """Authenticate and return YouTube API service"""
    credentials = None

    # Load saved credentials if they exist
    if TOKEN_FILE.exists():
        with open(TOKEN_FILE, 'rb') as token:
            credentials = pickle.load(token)

    # If no valid credentials, get new ones
    if not credentials or not credentials.valid:
        if credentials and credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
        else:
            if not CLIENT_SECRETS_FILE.exists():
                print("ERROR: client_secrets.json not found!")
                print("Please follow setup instructions in the file header.")
                exit(1)

            flow = InstalledAppFlow.from_client_secrets_file(
                CLIENT_SECRETS_FILE, SCOPES)
            credentials = flow.run_local_server(port=0)

        # Save credentials for next time
        with open(TOKEN_FILE, 'wb') as token:
            pickle.dump(credentials, token)

    return build('youtube', 'v3', credentials=credentials)

def upload_video(youtube, video_path, metadata):
    """
    Upload a single video to YouTube

    Args:
        youtube: Authenticated YouTube service
        video_path: Path to video file
        metadata: Dict with title, description, tags, category

    Returns:
        Video ID if successful, None otherwise
    """
    body = {
        'snippet': {
            'title': metadata['title'],
            'description': metadata['description'],
            'tags': metadata['tags'],
            'categoryId': metadata['category']
        },
        'status': {
            'privacyStatus': 'public',  # or 'unlisted' or 'private'
            'madeForKids': False,
            'selfDeclaredMadeForKids': False
        }
    }

    # Create media upload
    media = MediaFileUpload(
        video_path,
        chunksize=-1,  # Upload in a single request
        resumable=True,
        mimetype='video/mp4'
    )

    # Execute upload
    request = youtube.videos().insert(
        part=','.join(body.keys()),
        body=body,
        media_body=media
    )

    try:
        print(f"Uploading: {metadata['title']}")
        response = request.execute()
        video_id = response['id']
        print(f"✓ Uploaded! Video ID: {video_id}")
        print(f"  URL: https://youtube.com/watch?v={video_id}")
        return video_id

    except Exception as e:
        print(f"✗ Upload failed: {e}")
        return None

def upload_all_videos(max_uploads=50, delay_seconds=10):
    """
    Upload all generated videos to YouTube

    Args:
        max_uploads: Maximum number of videos to upload (to avoid spam detection)
        delay_seconds: Delay between uploads
    """
    # Get YouTube service
    youtube = get_authenticated_service()

    # Find all videos
    video_files = sorted(VIDEO_DIR.glob('*.mp4'))

    if not video_files:
        print("No videos found in", VIDEO_DIR)
        return

    print(f"Found {len(video_files)} videos")
    print(f"Will upload max {max_uploads} videos with {delay_seconds}s delay")
    print("\nStarting in 5 seconds... (Ctrl+C to cancel)")
    time.sleep(5)

    uploaded_count = 0
    uploaded_ids = []

    for video_path in video_files[:max_uploads]:
        # Load metadata
        metadata_path = video_path.with_name(f"{video_path.stem}_metadata.json")

        if not metadata_path.exists():
            print(f"⊘ Skipping {video_path.name} - no metadata file")
            continue

        with open(metadata_path, 'r') as f:
            metadata = json.load(f)

        # Upload
        video_id = upload_video(youtube, video_path, metadata)

        if video_id:
            uploaded_count += 1
            uploaded_ids.append({
                'video_id': video_id,
                'file': video_path.name,
                'title': metadata['title'],
                'url': f'https://youtube.com/watch?v={video_id}'
            })

            # Save upload log
            log_path = VIDEO_DIR / 'upload_log.json'
            with open(log_path, 'w') as f:
                json.dump(uploaded_ids, f, indent=2)

        # Delay between uploads (avoid spam detection)
        if uploaded_count < max_uploads:
            print(f"Waiting {delay_seconds}s before next upload...\n")
            time.sleep(delay_seconds)

    print("\n" + "=" * 50)
    print(f"✓ Upload complete! {uploaded_count} videos uploaded")
    print(f"Upload log saved to: {VIDEO_DIR / 'upload_log.json'}")

def upload_single_video(video_name):
    """Upload a single video by filename"""
    youtube = get_authenticated_service()

    video_path = VIDEO_DIR / f"{video_name}.mp4"
    metadata_path = VIDEO_DIR / f"{video_name}_metadata.json"

    if not video_path.exists():
        print(f"Video not found: {video_path}")
        return

    if not metadata_path.exists():
        print(f"Metadata not found: {metadata_path}")
        return

    with open(metadata_path, 'r') as f:
        metadata = json.load(f)

    upload_video(youtube, video_path, metadata)

if __name__ == '__main__':
    import sys

    print("YouTube Video Uploader")
    print("=" * 50)

    if len(sys.argv) > 1:
        # Upload single video
        video_name = sys.argv[1]
        print(f"Uploading single video: {video_name}")
        upload_single_video(video_name)
    else:
        # Upload all videos
        upload_all_videos(max_uploads=50, delay_seconds=10)
