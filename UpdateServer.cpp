#include <iostream>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <string.h>
#include <thread>
#include <map>
#include <vector>
#include <algorithm>
#include <string>
#include <sstream>


using namespace std;

map<string, vector<int>> user_history; // Maps user ID to a list of video IDs watched
map<int, int> video_popularity; // Maps video ID to its popularity count
map<int, vector<int>> video_associations;

int minVector(vector<int> videos) {
    int min = videos[0];
    for(int video : videos) {
        if(video_popularity[min] > video_popularity[video]) {
            min = video;
        }
    }
    return min;
}

vector<int> getRelated(int videoId, string user, int views) {
    //find the videos watched with this video.
    auto tr = video_associations.find(videoId);
    vector<int> related;
    //check if exist.
    if(tr != video_associations.end()) {
        related = video_associations[videoId];
        video_popularity[videoId] = views;
    } else {
        std::vector<int> vid;
        video_associations[videoId] = vid;
        video_popularity[videoId] = views;
    }

    //update process:
    
    // if there is user connected.
    if (!user.empty() && user != "null")
    {   
        auto it = user_history.find(user);
        //if user exist.
        if (it != user_history.end()) {
            vector<int> watched = user_history[user];
            //update the videos he watched with videoId.
            for (int video : watched)
            {
                vector<int>& friends = video_associations[video];
                auto check = std :: find(friends.begin(), friends.end(), videoId);
                //videoId already in list.
                if(check != friends.end()) {
                    continue;
                }
                // Check if videoId itself is being processed.
                if (videoId == video) {
                    continue;
                }
                // if there are too much to return, update with popularity.
                if(friends.size() >= 8) {
                    int min = minVector(friends);
                    if(video_popularity[min] < video_popularity[videoId]) {
                        std::replace(friends.begin(), friends.end(), min, videoId);
                    }
                } else {
                    friends.push_back(videoId);
                }
            }
            //need to check if there is 8 videos.
            //video_associations[videoId].insert(video_associations[videoId].begin(), watched.begin(), watched.end());
            // Insert Watched Videos into the Association List:
            vector<int>& assocList = video_associations[videoId];
            for (int watchedVideoId : watched) {
                // not add the video itself to it's recommend list
                if (watchedVideoId == videoId) {
                    continue; // Skip the current videoId
                }
                auto it = find(assocList.begin(), assocList.end(), watchedVideoId);
    
                if (it == assocList.end()) {
                    // The watched video is not already in the list
                    if (assocList.size() >= 8) {
                        // If there are already 8 videos, find the least popular
                        int minVideo = minVector(assocList);
                        if (video_popularity[watchedVideoId] > video_popularity[minVideo]) {
                            // Replace the least popular video if the watched one is more popular
                            replace(assocList.begin(), assocList.end(), minVideo, watchedVideoId);
                        }
                    } else {
                        // If there are less than 8 videos, just add it
                        assocList.push_back(watchedVideoId);
                    }
                }
            }

            //update the video in user. 
            user_history[user].push_back(videoId);

        } else {
            // User does not exist, create a new vector and add the new videoId
            std::vector<int> videos;
            videos.push_back(videoId);
            user_history[user] = videos;  // Insert the new user with the vector into the map
        }   
         
    }
    
    return video_associations[videoId];
    
}

std::string serializeVector(const std::vector<int>& vec) {
    std::ostringstream oss;
    for (size_t i = 0; i < vec.size(); ++i) {
        if (i != 0) oss << ","; // Add a comma between numbers
        oss << vec[i];
    }
    return oss.str();
}

void handle_client(int client_sock) {
    std::cout << "Handling client in thread: " << this_thread::get_id() << endl;

    char buffer[4096];
    while (true) {
        int expected_data_len = sizeof(buffer);
        int read_bytes = recv(client_sock, buffer, expected_data_len, 0);
        
        if (read_bytes == 0) {
            // The connection is closed
            break;
        } else if (read_bytes < 0) {
            perror("error receiving data");
            break;
        } else {
            string message(buffer, read_bytes);

            // Check if it's a delete request
            if (message.substr(0, 6) == "DELETE") {
                std::string videoIdStr = message.substr(7); // Extract videoId from the message
                int videoId = std::stoi(videoIdStr);

                // Remove videoId from all data structures
                video_associations.erase(videoId);
                video_popularity.erase(videoId);

                // Remove videoId from the association lists of other videos
                for (auto& pair : video_associations) {
                    std::vector<int>& assocList = pair.second;
                    auto it = std::find(assocList.begin(), assocList.end(), videoId);
                    if (it != assocList.end()) {
                        assocList.erase(it); // Remove videoId from this list
                    }
                }

                // Also remove this videoId from any user's history
                for (auto& pair : user_history) {
                    std::vector<int>& history = pair.second;
                    history.erase(std::remove(history.begin(), history.end(), videoId), history.end());
                }

                std::cout << "Deleted videoId: " << videoId << " from all structures" << std::endl;

                std::string response = "Deleted videoId: " + videoIdStr;
                send(client_sock, response.c_str(), response.size(), 0);
            } else if (message.substr(0, 11) == "USER_DELETE") {
                std::cout << "In Delete User Case ";
                std::string userId = message.substr(12); // Extract userId from the message

                // Remove userId from all data structures
                
                user_history.erase(userId);

                std::cout << "Deleted userId: " << userId << " from user_history" << std::endl;

                std::string response = "Deleted userId: " + userId;
                send(client_sock, response.c_str(), response.size(), 0);
            } else {
                std::cout << "In Regular Case ";
                // Handle other types of requests
                size_t firstCommaPos = message.find(',');
                size_t secondCommaPos = message.find(',', firstCommaPos + 1);

                std::string videoIdStr = message.substr(0, firstCommaPos);
                int videoId = std::stoi(videoIdStr);

                // Extract the user string
                std::string user = message.substr(firstCommaPos + 1, secondCommaPos - firstCommaPos - 1);

                // Extract the views
                std::string viewsStr = message.substr(secondCommaPos + 1);
                int views = std::stoi(viewsStr);

                std::cout << "User: " << user << std::endl;
                std::cout << "Video ID: " << videoId << std::endl;
                std::cout << "Views: " << views << std::endl;

                std::cout << "Received: " << buffer << " in thread: " << std::this_thread::get_id() << std::endl;
                std::vector<int> videos = getRelated(videoId, user, views);
                int sent_bytes;
                if (videos.empty()) {
                    sent_bytes = send(client_sock, "0", 1, 0);
                } else {
                    std::string serialized = serializeVector(videos);
                    std::cout << "to send: " << serialized << std::endl;
                    sent_bytes = send(client_sock, serialized.c_str(), serialized.size(), 0);
                }

                if (sent_bytes < 0) {
                    perror("error sending data to client");
                    break;
                }
            }
        }
    }
    close(client_sock);
    std::cout << "Client connection closed in thread: " << this_thread::get_id() << endl;
}

int main() {
    const int server_port = 5555;
    int sock = socket(AF_INET, SOCK_STREAM, 0);
    if (sock < 0) {
        perror("error creating socket");
        return 1;
    }

    struct sockaddr_in sin;
    memset(&sin, 0, sizeof(sin));
    sin.sin_family = AF_INET;
    sin.sin_addr.s_addr = INADDR_ANY;
    sin.sin_port = htons(server_port);

    if (bind(sock, (struct sockaddr *) &sin, sizeof(sin)) < 0) {
        perror("error binding socket");
        return 1;
    }

    if (listen(sock, 5) < 0) {
        perror("error listening to a socket");
        return 1;
    }

    while (true) {
        struct sockaddr_in client_sin;
        unsigned int addr_len = sizeof(client_sin);
        int client_sock = accept(sock, (struct sockaddr *) &client_sin, &addr_len);
        if (client_sock < 0) {
            perror("error accepting client");
            continue;
        }
        thread client_thread(handle_client, client_sock);
        client_thread.detach();  // Let the thread run independently
    }

    close(sock);
    return 0;
}