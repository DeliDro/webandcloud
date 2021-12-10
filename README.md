
# Tinygram Project

This is a web application developped for the Web-Cloud & Datastores class at University of Nantes in first year of CS master's degree.

### Tools used

- Google Cloud Endpoints Framework
- Google Cloud Datastore
- Tailwind CSS

## Contributors
- Amar TIOUS
- Dro Kieu DELI
- Leo PORTEJOIE

## Rendu

https://tinygram-webandcloud.uc.r.appspot.com/

https://endpointsportal.tinygram-webandcloud.cloud.goog/


# Cost in Time of /posts
By modifying the limit of results in /posts, we were able to make tests and have these results: 

For the last 10 posts : average of 288 ms

For the last 100 posts : average of 383 ms

For the last 500 posts : average of 578 ms

# How many likes on a post in a second ?

By using the /spamLike API endpoint, we were able to test how many likes we could give to a post within a single second:
We got an average result of:
  - 25.8 likes per second


# API Methods

#### addPost : Uploads a post by the logged in user in the datastore
#### follow : Adds a user to the logged in user's list of followed accounts
#### like : adds a like by the logged in user on a post
#### like/{likeID} : gets a Like entity from the datastore
#### login : logs the user in using his google credentials and create a user entity in the datastore if he logs for the first time
#### post/{id} : gets a Post entity from the datastore
#### post/{id}/likes : gets all the Like entities that represent likes on a {id} post from the datastore
#### posts : gets the last 50 uploaded posts from the datastore
#### user/{userEmail}/posts : gets 20 posts by the user {userEmail} from the datastore


# The Case of /user/{userEmail}

We did program at /user/{userEmail} endpoint for the API, but we didn't find a way to make it work, despite it being the exact same as /post/{id} but for User entities instead of posts.

The consequences of this problem are that we couldn't display the amount of followers a user has, we couldn't display the list of accounts followed by the logged user, and we couldn't display the account of another user than the logged user.
