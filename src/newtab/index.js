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
            // filter out not important stuffs
            .filter(
              notification => notification.reason !== 'subscribed'
            )
            .reduce(
              (result, notification) => {
                // commit id (sha) or pull request number
                var subject_uid = notification.subject.url;
                subject_uid = subject_uid.substr(subject_uid.lastIndexOf('/') + 1)

                var repoName = notification.repository.full_name;
                var repoUrl = notification.repository.html_url;
                var type = notification.subject.type;
                var url = '';
                var reason = notification.reason;

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
                  url: url,
                  reason: reason
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
                <h4><a href=${repoUrl}>${repoName}</a></h4>
              `)
              .appendTo(containerNotifications)


            var SORT_ORDER_NOTIFICATIONS = [
              'review_requested',
              'assign',
              'mention',
              'subscribed'
            ];

            var COLOR_CODE_NOTIFICATION_REASONS = {
              review_requested: 'text-danger',
              assign: 'text-danger',
              mention: 'text-danger',
              subscribed: 'text-muted'
            }

            notifications
              //sort by importances
              .sort(
                function(a, b){
                  var aReason = SORT_ORDER_NOTIFICATIONS.indexOf(a.reason);
                  aReason = aReason === -1 ? SORT_ORDER_NOTIFICATIONS.length + 1
                    : aReason;

                  var bReason = SORT_ORDER_NOTIFICATIONS.indexOf(b.reason);
                  bReason = bReason === -1 ? SORT_ORDER_NOTIFICATIONS.length + 1
                    : bReason;

                  if(aReason > bReason){
                    return 1;
                  } else if(aReason < bReason){
                    return -1;
                  }
                  return 0;
                }
              )
              .forEach(
              (notification) => {
                $('<ul />')
                  .appendTo(containerNotifications)
                  .append(`
                    <li>
                      <span class="badge">
                        ${notification.type}
                      </span>
                      <strong class="${COLOR_CODE_NOTIFICATION_REASONS[notification.reason]}">
                        ${notification.reason}
                      </strong>
                      <a href="${notification.url}">${notification.subject}</a>
                    </li>
                  `)
                  // .html(JSON.stringify(data, null, 2))
              }
            );
          }
        }, console.error);
      }
    }
  )
