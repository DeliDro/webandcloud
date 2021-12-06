const baseEndpointURL = "https://tinygram-webandcloud.uc.r.appspot.com/_ah/api/tinyInsta/v1/";

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
}

// Si l'utilisateur n'est pas connecté
if (!gapi.auth2.getAuthInstance().isSignedIn.get() && window.location.pathname !== "/glogin.html") {
  window.location = "/glogin.html"
}