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
    var messages = thread.getMessages();
    var labels = {};

    console.log("Processing thread with first message subject [" + thread.getFirstMessageSubject() + "]; contains " + thread.getMessageCount() + " messages.");

    if (messages) {
      if (isFrom(messages[0], "github.com")) {
        labels[GITHUB] = true;
        if (isFrom(messages[0], "notifications@github.com")) {
          labels[NOTIFICATION] = true;

          for (var j = 0; j < messages.length; j++) {
            for (var label in getLabelsFor(messages[j])) {
              labels[label] = true;
            }
          }
          var labelNames = [];

          for (var label in labels) {
            labelNames.unshift(label);
          }

          console.log("The labels " + labelNames.join() + " will be assigned to this thread.");
          labelNames.forEach(function(labelName) { assignLabel(thread, labelName, dryRun); });
        }
      }
    }
  }
}

function getLabelsFor(message) {
  var labels = {};
  var body = message.getRawContent();
  var isActiveParticipant = bodyContains(body, "X-GitHub-Reason: author") || bodyContains(body, "X-GitHub-Reason: comment");
  var isSubscribed = bodyContains(body, "X-GitHub-Reason: subscribed");
  
  if (isActiveParticipant || isSubscribed) {
    var labelName = isSubscribed ? SUBSCRIBED : PARTICIPATING;
    labels[labelName] = true;
    if (bodyContains(body, "Merged #")) {
      labels[MERGED] = true;
    }
    if (bodyContains(body, "Closed #")) {
      labels[CLOSED] = true;
    }
  }

  if (bodyContains(body, "X-GitHub-Reason: mention")) {
    labels[DEFAULT_MENTION_LABEL] = true;
  }
  if (bodyContains(body, "X-GitHub-Reason: team_mention")) {
    labels[TEAM_MENTION] = true;
  }
  if (bodyContains(body, "X-GitHub-Reason: assign")) {
    labels[ASSIGNED] = true;
  }
  
  return labels;
}

function printCurrentLabels() {
  GmailApp.getUserLabels().forEach(function(label) { console.log("Label name: [" + label.getName() + "]"); } );
}

function createRequiredLabels(dryRun) {
  !dryRun && [ASSIGNED, CLOSED, GITHUB, MERGED, NOTIFICATION, PARTICIPATING, SUBSCRIBED, TEAM_MENTION, DEFAULT_MENTION_LABEL].forEach(function(label) { GmailApp.createLabel(label); });
}

function bodyContains(body, str) {
  return (body.indexOf(str) > -1);
}

function isFrom(message, from) {
  return message.getFrom().indexOf(from) > -1;
}

function assignLabel(thread, label, dryRun) {
  console.log("Assigning label [" + label + "]...");
  !dryRun && thread.addLabel(GmailApp.getUserLabelByName(label));
}
