import _ from 'lodash';

import dataUtil from '@src/util/dataUtil';
import restUtil from '@src/util/restUtil';

dataUtil.getPersistedProp('api-token')
  .then(
    (apiToken) =>{
      if(_.size(apiToken) > 0){
        // new rest api
        restUtil.setAuthToken(apiToken);

        dataUtil.fetchNotifications().then( function(notifications){
          var containerNotifications = $('<div />').appendTo('#container-notifications');
          // var containerNotifications2 = $('<pre />').appendTo('#container-notifications')
          //   .text(JSON.stringify(notifications, null, 2))

          notifications = notifications || [];
          var notificationSections = notifications
            .reduce(
              (result, notification) => {
                // commit id (sha) or pull request number
                var subject_uid = notification.subject.url;
                subject_uid = subject_uid.substr(subject_uid.lastIndexOf('/') + 1)

                var repoName = notification.repository.full_name;
                var repoUrl = notification.repository.html_url;
                var type = notification.subject.type;
                var url = '';

                switch(type){
                  case 'PullRequest':
                    type = 'PR';
                    url = `${repoUrl}/pull/${subject_uid}`;
                    break;
                  case 'Commit':
                    url = `${repoUrl}/commit/${subject_uid}`
                    break;
                }

                result[repoName] = result[repoName] || [];

                result[repoName].push({
                  subject: notification.subject.title,
                  type: type,
                  repoName:  repoName,
                  repoUrl: repoUrl,
                  url: url
                });

                return result;
              },
              {}
            );

          for(var repoName in notificationSections){
            var notifications = notificationSections[repoName];
            var repoUrl = notifications[0].repoUrl;

            $('<div />')
              .append(`
                <a href=${repoUrl}><h3>${repoName}</h3></a>
              `)
              .appendTo(containerNotifications)

            notifications.forEach(
              (notification) => {
                $('<div />')
                  .appendTo(containerNotifications)
                  .append(`
                    <div>
                      <strong>
                        ${notification.type}
                      </strong>
                      <a href="${notification.url}">${notification.subject}</a>
                    </div>
                  `)
                  // .html(JSON.stringify(data, null, 2))
              }
            );
          }
        }, console.error);
      }
    }
  )
