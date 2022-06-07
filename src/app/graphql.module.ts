import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import {environment} from '../environments/environment';
import {WebSocketLink} from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';
import { AuthenticationService } from './security/services';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const uri = environment.apiUrl+'/graphql'; // <-- add the URL of the GraphQL server here
const subscriptionUri = environment.wsUrl+'/rest/subscriptions'; // graphql subscription endpoint


export function createApollo(httpLink: HttpLink, authenticationService: AuthenticationService) {
  const http = httpLink.create({
    uri: uri
  });

  // websocket link
  let auth = undefined;
  const jwt=authenticationService.getFromSessionStorageBasedEnv("jwt");
  if (!!jwt) {
    auth = "Bearer "+jwt;
  }
  // websocket client
  const wsClient = new SubscriptionClient(subscriptionUri,
    {
      reconnect: true,
      connectionParams: {
        authorization: auth,
      }
    }
  );
  // websocket link
  const wsLink = new WebSocketLink(wsClient);
  // set websocket client into authentication service
  authenticationService.setWebSocketClient(wsClient);
  
  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query);
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    wsLink,
    http,
  );

  return {
    link: link,
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, AuthenticationService],
    },
  ],
})
export class GraphQLModule {}
