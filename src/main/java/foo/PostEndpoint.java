package foo;


import com.google.api.server.spi.auth.common.User;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.BadRequestException;
import com.google.appengine.api.datastore.*;


import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.PropertyProjection;
import com.google.appengine.api.datastore.PreparedQuery.TooManyResultsException;
import com.google.appengine.api.datastore.Query.CompositeFilter;
import com.google.appengine.api.datastore.Query.CompositeFilterOperator;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.appengine.api.datastore.QueryResultList;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.datastore.EntityNotFoundException;



import java.util.*;
import java.text.SimpleDateFormat;

@Api(name = "tinyInsta",
     version = "v1",
     audiences = "1000529978221-24nk2p3p1o1efm3uapb1rc800939tma4.apps.googleusercontent.com",
  	 clientIds = "1000529978221-24nk2p3p1o1efm3uapb1rc800939tma4.apps.googleusercontent.com",
     namespace =
     @ApiNamespace(
		   ownerDomain = "tinygram-webandcloud.uc.r.appspot.com",
		   ownerName = "tinygram-webandcloud.uc.r.appspot.com",
		   packagePath = "")
     )

public class PostEndpoint {


    //Entrée: Aucune
    @ApiMethod(name = "allPosts", path="posts", httpMethod = ApiMethod.HttpMethod.GET)
	public List<Entity> allPosts() {
		Query q = new Query("Post").addSort("date", SortDirection.DESCENDING);

		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		PreparedQuery pq = datastore.prepare(q);
		List<Entity> result = pq.asList(FetchOptions.Builder.withLimit(50));
		return result;
	}

    //Entrée: Un Objet Post
    @ApiMethod(name = "addPost", path="addPost", httpMethod = ApiMethod.HttpMethod.POST)
	public Entity addPost(PostMessage post) {

        SimpleDateFormat dateform = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        String postdate = dateform.format(new Date());


        Entity e = new Entity("Post", post.owner + ":" + postdate);
        e.setProperty("id", post.owner + ":" + postdate);
        e.setProperty("owner", post.owner);
        e.setProperty("url", post.url);
        e.setProperty("body", post.body);
        e.setProperty("date", postdate);
        e.setProperty("likeCount", 0);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Transaction txn = datastore.beginTransaction();
        datastore.put(e);
        txn.commit();

        return e;
	}

    //Entrée: l'ID du post dans l'endpoint
    @ApiMethod(name="getPost", path = "post/{id}", httpMethod = ApiMethod.HttpMethod.GET)
    public Entity getPost(@Named("id") String id) throws EntityNotFoundException {
        Key postKey = KeyFactory.createKey("Post", id);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

        Entity e = datastore.get(postKey);
        return e;
    }

    //Entrée: L'id du post dans l'endpoint
    @ApiMethod(name="getListUserLike", path = "post/{id}/likes", httpMethod = ApiMethod.HttpMethod.GET)
    public List<Entity> getListUserLike(@Named("id") String id) {

        Query q = new Query("Like").setFilter(new Query.FilterPredicate("postId", Query.FilterOperator.EQUAL, id));
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        PreparedQuery pq = datastore.prepare(q);

        List<Entity> results = pq.asList(FetchOptions.Builder.withLimit(100));
        List<Entity> users = new ArrayList<>();

        for (Entity likes : results) {
            Query q2 = new Query("User").setFilter(new Query.FilterPredicate("email", Query.FilterOperator.EQUAL, likes.getProperty("userEmail")));
            PreparedQuery pq2 = datastore.prepare(q2);

            users.add(pq2.asList(FetchOptions.Builder.withLimit(1)).get(0));
        }

        return users;
    }




    @ApiMethod(name = "fillPosts", path="fillposts", httpMethod = ApiMethod.HttpMethod.POST)
	public List<Entity> fillPosts() {

        SimpleDateFormat dateform = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
        String postdate;


        List<Entity> posts = new ArrayList<>();
        String cle;
        for(int i = 0; i <100; i++){
            postdate = dateform.format(new Date());
            cle = "tiousamar@gmail.com:"+postdate+"--"+Integer.toString(i);
            Entity e = new Entity("Post", cle);
            e.setProperty("id", cle);
            e.setProperty("owner", "tiousamar@gmail.com");
            e.setProperty("url", "https://pbs.twimg.com/profile_images/644403735188234244/0k4k_Aue_400x400.jpg");
            e.setProperty("body", "Generic post generation. Post de fillposts numero "+Integer.toString(i));
            e.setProperty("date", postdate);
            e.setProperty("likeCount", 0);
            posts.add(e);
        }

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Transaction txn = datastore.beginTransaction();
        for (Entity post: posts){
            datastore.put(post);
        }
        txn.commit();

        return posts;
	}



}