console.log('aaaa')

import _ from 'lodash';

import dataUtil from '@src/util/dataUtil';
import restUtil from '@src/util/restUtil';

dataUtil.getPersistedProp('api-token')
  .then(
    (apiToken) =>{
      if(_.size(apiToken) > 0){
        // new rest api
        restUtil.setAuthToken(apiToken);

        //do api calls
        dataUtil.fetchFeeds().then( function(data){
          var containerFeeds = $('<pre />').appendTo('#container-feeds')
            .html(JSON.stringify(data, null, 2))
        }, console.error);
        dataUtil.fetchNotifications().then( function(data){
          var containerNotifications = $('<pre />').appendTo('#container-notifications')
            .html(JSON.stringify(data, null, 2))
        }, console.error);
        dataUtil.fetchEvents().then( function(data){
          var containerEvents = $('<pre />').appendTo('#container-events')
            .html(JSON.stringify(data, null, 2))
        }, console.error);
      }
    }
  )
