package foo;

import com.google.api.server.spi.auth.common.User;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.BadRequestException;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.datastore.*;

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

     public class UserEndpoint {


        // _ah/api/tinyInsta/v1/login
        //Entrées: Objet UserClass
        @ApiMethod(name = "logUser", path = "login", httpMethod = ApiMethod.HttpMethod.POST)
        public Entity logUser(UserClass user) throws BadRequestException, UnauthorizedException {
            if (user == null) {
                throw new UnauthorizedException("Invalid credentials");
            }

            try{    //check if exists
                return getUser(user.email);
            }
            catch(Exception e){
                //create user if he doesn't exist
                Entity e1 = new Entity("User", user.email);
                e1.setProperty("email", user.email);
                e1.setProperty("name", user.name);
                e1.setProperty("url", user.url);

                DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
                Transaction txn = datastore.beginTransaction();
                datastore.put(e1);
                txn.commit();
                return e1;
            }
            
        }

        //Entrées: Email de l'utilisateur dans l'endpoint
        @ApiMethod(path = "user/{userEmail}")
        public static Entity getUser(@Named("userId") String userEmail) throws EntityNotFoundException {
            Key userKey = KeyFactory.createKey("User", userEmail);
    
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    
            return datastore.get(userKey);
        }


        //Entrées: Email du user dans l'endpoint
        @ApiMethod(path = "user/{userEmail}/posts")
        public List<Entity> getUserPosts(@Named("userId") String userEmail) throws EntityNotFoundException {
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    
            Query q = new Query("Post").setFilter(new Query.FilterPredicate("owner", Query.FilterOperator.EQUAL, userEmail));
            PreparedQuery pq = datastore.prepare(q);
    
            List<Entity> results = pq.asList(FetchOptions.Builder.withLimit(20));
    
            return results;
        }

     }