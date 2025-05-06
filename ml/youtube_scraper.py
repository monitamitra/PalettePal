import os
import pandas as pd
import isodate
from googleapiclient.discovery import build
from dotenv import load_dotenv

# loading environment variables
load_dotenv()
YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

# initializing youtube client
youtube = build("youtube", "v3", developerKey=YOUTUBE_API_KEY)

# get video ids of search results
def search_videos(query, max_results = 25):
    video_ids = []
    for duration in ["medium", "long"]:
        request = youtube.search().list(q = query, type = "video", part = "id", 
            maxResults = max_results, fields = "items(id(videoId))")
        response = request.execute()
        temp_ids = [item["id"]["videoId"] for item in response["items"]]
        video_ids.extend(temp_ids)

    return video_ids

# get video details from ids and create dataset
def get_video_details(video_ids):        
    request = youtube.videos().list(part = "snippet,contentDetails", id=",".join(video_ids), 
        fields="items(id,snippet(title,description,channelTitle,publishedAt,thumbnails.medium.url),contentDetails(duration))")
    response = request.execute()

    video_data = []

    # get structured minutes format
    def format_duration(minutes_float):
        total_seconds = int(minutes_float * 60)
        hours = total_seconds // 3600
        mins = (total_seconds % 3600) // 60
        secs = total_seconds % 60
        if hours:
            return f"{hours}:{mins:02d}:{secs:02d}"
        else:
            return f"{mins}:{secs:02d}"


    for item in response["items"]:
        try:
            duration_iso = item['contentDetails']['duration']
            duration_minutes = isodate.parse_duration(duration_iso).total_seconds() / 60

            video_data.append({
                "video_id": item["id"], 
                "title": item["snippet"]["title"], 
                'description': item['snippet']['description'],
                'channel_title': item['snippet']['channelTitle'],
                'publish_time': item['snippet']['publishedAt'],
                'thumbnail_url': item['snippet']['thumbnails']['medium']['url'],
                'video_url': f"https://www.youtube.com/watch?v={item['id']}",
                'duration_minutes': round(duration_minutes, 2), 
                "formatted_duration": format_duration(duration_minutes)
            })
        
        except Exception as e:
            print("Skipping video due to error: {e}")
        
    return video_data

# main method to get videos dataframe
def scrape_video_data():
    queries = [
    "easy acrylic painting tutorial for beginners",
    "simple watercolor painting tutorial step by step",
    "full beginner painting tutorial",
    "paint a landscape for beginners",
    "easy full canvas painting tutorial",
    "how to paint for absolute beginners",
    "simple full painting project tutorial",

    "full acrylic painting tutorial",
    "complete watercolor painting tutorial",
    "full step by step painting tutorial",
    "full landscape painting tutorial",
    "complete oil painting demonstration",
    "how to paint a full canvas",
    "real time painting tutorial full",
    "paint along full painting tutorial",
    "one hour painting tutorial",
    "complete portrait painting tutorial",
    "still life painting full tutorial",
    "complete floral painting step by step",
    "paint a full forest scene tutorial",
    "paint a full seascape acrylic tutorial"
]

    # populating dataframe
    video_res = []
    
    for query in queries:
        video_ids = search_videos(query, max_results=25)
        video_data = get_video_details(video_ids)
        video_res.extend(video_data)
    
    
    all_videos_df = pd.DataFrame(video_res)
    # taking care of duplicates
    all_videos_df = all_videos_df.drop_duplicates(subset="video_id")
    all_videos_df = all_videos_df.reset_index(drop=True)

    # saving video dataframe to local storage
    output_path = os.path.join("..", "data", "videos_data.csv")
    all_videos_df.to_csv(output_path, index=False)
    print("Saving to:", output_path)

if __name__ == "__main__":
    scrape_video_data()