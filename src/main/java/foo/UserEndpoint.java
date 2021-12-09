package foo;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.BadRequestException;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.datastore.*;
import com.google.appengine.api.datastore.Query.SortDirection;

import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

import java.util.ArrayList;
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
                e1.setProperty("followed", new ArrayList<String>());

                DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
                Transaction txn = datastore.beginTransaction();
                datastore.put(e1);
                txn.commit();
                return e1;
            }
            
        }
        
        /**
         * 
         * @param userEmail Email de l'utilisateur dans l'endpoint
         * @return
         * @throws EntityNotFoundException
         */
        @ApiMethod(name="getUser", path = "user/{userEmail}", httpMethod = ApiMethod.HttpMethod.GET)
        public static Entity getUser(@Named("userEmail") String userEmail) throws EntityNotFoundException {
            Key userKey = KeyFactory.createKey("User", userEmail);

            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

            Entity e = datastore.get(userKey);
            return e;
        }

        //Entrées: Email du user dans l'endpoint
        @ApiMethod(name="getUserPosts", path = "user/{userEmail}/posts", httpMethod = ApiMethod.HttpMethod.GET)
        public List<Entity> getUserPosts(@Named("userEmail") String userEmail) throws EntityNotFoundException {
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    
            Query q = new Query("Post").setFilter(new Query.FilterPredicate("owner", Query.FilterOperator.EQUAL, userEmail));
            PreparedQuery pq = datastore.prepare(q);
    
            List<Entity> results = pq.asList(FetchOptions.Builder.withLimit(20));
    
            return results;
        }        

        @ApiMethod(name = "follow", path="follow", httpMethod = ApiMethod.HttpMethod.PUT)
        public Entity follow(UserClass user, @Named("key") String key) throws EntityNotFoundException, UnauthorizedException{

            if (user == null || key == null) {
                throw new UnauthorizedException("Invalid key");
            }

            Key ckey = KeyFactory.createKey("User", user.email);
            Query q1 = new Query("User").setFilter(new FilterPredicate("__key__", FilterOperator.EQUAL, ckey));
            DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
            PreparedQuery pq1 = datastore.prepare(q1);
            Entity e1 = pq1.asSingleEntity();

            if (e1.getProperty("followed") == null) {
                List<String> followed = new ArrayList<>();
                followed.add(key);
                e1.setProperty("followed", followed);

                Transaction txn1 = datastore.beginTransaction();
                datastore.put(e1);
                txn1.commit();

                return e1;
            }
            List<String> followed = (ArrayList<String>) e1.getProperty("followed");

            if(followed.contains(key)){
                throw new UnauthorizedException("User already followed");
            }
            else{
                followed.add(key);
                e1.setProperty("followed", followed);
                Transaction txn1 = datastore.beginTransaction();
                datastore.put(e1);
                txn1.commit();
                return e1;
            }
        }
    }