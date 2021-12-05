package main.java.foo;

import com.google.api.server.spi.auth.common.User;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.BadRequestException;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.datastore.*;


@Api(name = "TinyInsta",
     version = "v1",
     audiences = "1000529978221-24nk2p3p1o1efm3uapb1rc800939tma4.apps.googleusercontent.com",
  	 clientIds = "1000529978221-24nk2p3p1o1efm3uapb1rc800939tma4.apps.googleusercontent.com",
     namespace =
     @ApiNamespace(
		   ownerDomain = "tinygram-webandcloud.uc.r.appspot.com",
		   ownerName = "tinygram-webandcloud.uc.r.appspot.com",
		   packagePath = "")
     )

     public class UserEndpoint {


        @ApiMethod(name = "addUser", path = "user", httpMethod = ApiMethod.HttpMethod.POST)
        public Entity addUser(User user, String userName) throws BadRequestException, UnauthorizedException {
            if (user == null) {
                throw new UnauthorizedException("Invalid credentials");
            }
    
            Entity e = new Entity("User", user.getId());
            e.setProperty("email", user.getEmail());
            e.setProperty("name", userName);
    
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
            Transaction txn = datastore.beginTransaction();
            datastore.put(e);
            txn.commit();
    
            return e;
        }


        @ApiMethod(path = "user/{userId}")
        public static Entity getUser(@Named("userId") String userId) throws EntityNotFoundException {
            Key userKey = KeyFactory.createKey("User", userId);
    
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    
            return datastore.get(userKey);
        }


        @ApiMethod(path = "user/{userId}/posts")
        public List<Entity> getUserPosts(@Named("userId") String userId) throws EntityNotFoundException {
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    
            Query q = new Query("Post").setFilter(new Query.FilterPredicate("owner", Query.FilterOperator.EQUAL, userId));
            PreparedQuery pq = datastore.prepare(q);
    
            List<Entity> results = pq.asList(FetchOptions.Builder.withLimit(20));
    
            return results;
        }

     }