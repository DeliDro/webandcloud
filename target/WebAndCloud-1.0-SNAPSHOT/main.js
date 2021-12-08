const baseEndpointURL = "https://tinygram-webandcloud.uc.r.appspot.com/_ah/api/TinyInsta/v1/";

const EndpointURL = {
  follow: {
    method: "",
    url: baseEndpointURL + ""
  },
  addPost: {
    method: "post",
    url: baseEndpointURL + "addPost"
  },
  newPosts: {
    method: "get",
    url: baseEndpointURL + "posts"
  },
  likePost: {
    method: "post",
    url: baseEndpointURL + "like"
  }
}

/**
 * classe regroupant les actions opérables par un utilisateur
 */
class User {
  login(googleUser) {
    var user = googleUser.getBasicProfile();
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  logout() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut()
      .then(() => {
        alert("Déconnexion");
        sessionStorage.clear();
        window.location = "";
      })
      .catch(e => {
        alert("Erreur lors de la déconnexion");
        console.log(e);
      });
  }

  /**
   * Fonction de like d'un post
   * @param {{postId: string, userEmail: string}} data 
   */
  likePost(data) {
    axios[EndpointURL.likePost.method](EndpointURL.likePost.url, data)
      .then(e => {

      })
      .catch(error => {
        console.log(error);
        alert("Erreur lors du like")
      });
  }
}

class View {
  listNewPosts() {
    axios[EndpointURL.newPosts.method](EndpointURL.newPosts.url)
      .then(e => {

      })
      .catch (e => {
        console.log(error);
        alert("Erreur chargement des derniers Posts")
      })
  }

  createPostView(postData) {
    return (
      `<div class="w-1/4 m-2">
        <!-- Information utilisateur -->
        <div class="flex text-left items-center mb-2">
            <img src=${postData.url} alt="image" class="mr-2 rounded-full">
            <label class="mr-2 font-bold">${postData.name}</label>
            <label class="text-blue-400 cursor-pointer hover:text-blue-600">• S'abonner</label>
        </div>
        
        <!-- Image de la publication -->
        <img src=${postData.imageURL} alt="image" class="w-full" style="max-height: 300px;">
        
        <!-- J'aime -->
        <div class="text-right">
          <label class="text cursor-pointer" {onclick="User.likePost()"}>J'aime</label>
        </div>
      </div>`
    );
  }
}

// Si l'utilisateur n'est pas connecté
if (!gapi.auth2.getAuthInstance().isSignedIn.get() && window.location.pathname !== "/glogin.html") {
  window.location = "/glogin.html"
}