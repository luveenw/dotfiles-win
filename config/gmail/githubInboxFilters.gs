/**
Automagically assign message labels in Gmail based on Github message headers.

This script can create the following labels automatically for you. If you want this, uncomment the call to createRequiredLabels in processInbox.

* @<username> (or your username-specific label; messages with an @ mention will be assigned this label)
* Assigned
* Closed
* Github
* Merged
* Notification
* Participating
* Subscribed
* Team Mention

*/

var DEFAULT_MENTION_LABEL = "@luveenw";
var ASSIGNED = "Assigned";
var CLOSED = "Closed";
var GITHUB = "Github";
var MERGED = "Merged";
var NOTIFICATION = "Notification";
var PARTICIPATING = "Participating";
var SUBSCRIBED = "Subscribed";
var TEAM_MENTION = "Team Mention";

function processInboxDryRun() {
  processInbox(true);
}

function processInbox(dryRun) {
  if (typeof(dryRun) === 'undefined') {
    dryRun = false;
  }

  //printCurrentLabels();
  //createRequiredLabels(dryRun);
  
  processMessageThreads(dryRun);
}

function processMessageThreads(dryRun) {
  var threads = GmailApp.getInboxThreads(0, 50);
  for (var i = 0; i < threads.length; i++) {
    var thread = threads[i];
    console.log("Processing thread with first message subject [" + thread.getFirstMessageSubject() + "]");
    var messages = thread.getMessages();

    if (messages) {
      if (isFrom(messages, "github.com")) {
        assignLabel(thread, GITHUB, dryRun);
        if (isFrom(messages, "notifications@github.com")) {
          assignLabel(thread, NOTIFICATION, dryRun);
          for (var j = 0; j < messages.length; j++) {
            var message = messages[j];
            assignNotificationLabels(message, thread, dryRun);
          }
        }
        //thread.moveToArchive();
      }
    }
  }
}

function assignNotificationLabels(message, thread, dryRun) {
  var body = message.getRawContent();
  var isActiveParticipant = (bodyContains("X-GitHub-Reason: author")) || (bodyContains("X-GitHub-Reason: comment"));
  var isSubscribed = (bodyContains("X-GitHub-Reason: subscribed"));

  if (isActiveParticipant || isSubscribed) {
    assignLabel(thread, isSubscribed ? SUBSCRIBED : PARTICIPATING, dryRun);
    if (bodyContains("Merged #")) {
      assignLabel(thread, MERGED, dryRun);
    }
    if (bodyContains("Closed #")) {
      assignLabel(thread, CLOSED, dryRun);
    }
  }
  if (bodyContains("X-GitHub-Reason: mention")) {
    assignLabel(thread, DEFAULT_MENTION_LABEL, dryRun);
  }
  if (bodyContains("X-GitHub-Reason: team_mention")) {
    assignLabel(thread, TEAM_MENTION, dryRun);
  }
  if (bodyContains("X-GitHub-Reason: assign")) {
    assignLabel(thread, ASSIGNED, dryRun);
  }
}

function printCurrentLabels() {
  GmailApp.getUserLabels().forEach(function(label) { console.log("Label name: [" + label.getName() + "]"); } );
}

function createRequiredLabels(dryRun) {
  !dryRun && [ASSIGNED, CLOSED, GITHUB, MERGED, NOTIFICATION, PARTICIPATING, SUBSCRIBED, TEAM_MENTION, DEFAULT_MENTION_LABEL].forEach(function(label) { GmailApp.createLabel(label); });
}

function bodyContains(body, str) {
  return body.indexOf(str) > -1;
}

function isFrom(messages, from) {
  return (messages[0].getFrom()).indexOf(from) > -1;
}

function assignLabel(thread, label, dryRun) {
  console.log("Assigning label [" + label + "]...");
  !dryRun && thread.addLabel(GmailApp.getUserLabelByName(label));
}
