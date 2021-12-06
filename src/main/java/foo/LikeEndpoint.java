package foo;

import com.google.api.server.spi.auth.common.User;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.datastore.*;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


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
public class LikeEndpoint {


    // "/_ah/api/TinyInsta/v1/like"

    @ApiMethod(name = "likePost", path="like", httpMethod = ApiMethod.HttpMethod.POST)
	public Entity likePost(Like like) {

        Entity entity = new Entity("Like", like.postId + ":" + like.userId);
        entity.setProperty("postId", like.postId);
        entity.setProperty("userId", like.userId);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        Transaction txn = datastore.beginTransaction();
        datastore.put(entity);
        txn.commit();

        return entity;
	}


}