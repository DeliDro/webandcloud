package foo;

import com.google.api.server.spi.auth.common.User;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.datastore.*;

import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


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
public class LikeEndpoint {


    // "/_ah/api/tinyInsta/v1/like"
    @ApiMethod(name="getLike", path = "like/{likeID}", httpMethod = ApiMethod.HttpMethod.GET)
    public Entity getLike(@Named("likeID") String likeID) throws EntityNotFoundException {
        Key likeKey = KeyFactory.createKey("Like", likeID);
    
        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    
        return datastore.get(likeKey);
    }

    
    @ApiMethod(name = "likePost", path="like", httpMethod = ApiMethod.HttpMethod.POST)
	public Entity likePost(Like like) {
        String likeID = like.postId + ":" + like.userEmail;

        Entity entity;
        try{
            entity = getLike(likeID);

            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
            Key ckey = KeyFactory.createKey("Post", like.postId);
            Query q = new Query("Post").setFilter(new FilterPredicate("__key__", FilterOperator.EQUAL, ckey));
    

            PreparedQuery pq = datastore.prepare(q);
            Entity postMAJ = pq.asSingleEntity();
            postMAJ.setProperty("likeCount", (Long) postMAJ.getProperty("likeCount")-1);

            Key likeKey = KeyFactory.createKey("Like", likeID);

            Transaction txn = datastore.beginTransaction();
            datastore.delete(likeKey);
            datastore.put(postMAJ);
            txn.commit();
        }
        catch (Exception e){
            entity = new Entity("Like", likeID);
            entity.setProperty("postId", like.postId);
            entity.setProperty("userEmail", like.userEmail);
    
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    
            Key ckey = KeyFactory.createKey("Post", like.postId);
            Query q = new Query("Post").setFilter(new FilterPredicate("__key__", FilterOperator.EQUAL, ckey));
            PreparedQuery pq = datastore.prepare(q);
            Entity postMAJ = pq.asSingleEntity();
            postMAJ.setProperty("likeCount", (Long) postMAJ.getProperty("likeCount")+1);
    
            Transaction txn = datastore.beginTransaction();
            datastore.put(entity);
            datastore.put(postMAJ);
            txn.commit();

        }
        return entity;
	}

}