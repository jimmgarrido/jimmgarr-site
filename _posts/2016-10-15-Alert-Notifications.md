---
layout: post
title: Alert Notifcations With Xamarin.Mac
description: Notifications can be useful not only on mobile but on the desktop as well. 
tags: blog
permalink: /posts/alert-notifications/
---

On macOS, the `NSUserNotification` and `NSUserNotificationCenter` classes allow you to deliver and respond to notifications presented to the user. 
To see this in action, download the Xamarin [UserNotification Sample](https://developer.xamarin.com/samples/mac/UserNotificationExample/).

By default, apps will use the [banner style](https://developer.apple.com/library/content/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW19) which is great for displaying quick, non-critical information and will automatically be dismissed. However what if you want your notification to require user interaction or have different actions? 

This is where alert notifications come in. By contrast, alert notifications do not go away automatically and provide buttons for dismissal and actions:

![Notification on macOS]({{ site.url }}/assets/macos_notification.png)

 But before you can use them in your app, you need to do a couple of things:

- Declare the style in the Info.plist file
- Sign the app bundle

## Configure Your App

To set up your app for alert notifications, do the following:

1. Open the Info.plist file and select the "Source" tab
2. Add a new entry with 
   - name: **NSUserNotificationAlertStyle**
   - type: **String**
   - value: **alert** (case sensitive)
3. Save the Info.plist and go to the app project's properties (right-click > Options)
4. Under "Mac signing", check the box to sign the bundle and let it automatically select an identity and provisioning profile or manually configure it


## Using Alert Notifications

The `NSUserNotification` class has properties that allow you to customize your alert notifications. For example, you can change the text for the action button with `ActionButtonTitle` or for dismiss button with `OtherButtonTitle`. Check out the [Apple documentation](https://developer.apple.com/reference/foundation/nsusernotification) for more. 

### Additional Actions

You can also enable your notification to have more than one action by using the `AdditionalActions` property and passing it an `NSUserNotificationAction` array:
 
{% highlight csharp linenos %}
myNotification.AdditionalActions = new NSUserNotificationAction[] { 
    NSUserNotificationAction.GetAction("additional","Additional action"),
    NSUserNotificationAction.GetAction("more","More")
};
{% endhighlight %}
            
The additional actions can be seen by clicking and holding the main action button:

![Alert notification on macOS]({{ site.url }}/assets/alert_notification.png)


### Responding to Interaction

When a user interacts with the notification, it will call the `DidActivateNotification` delegate. Once inside the delegate, you can get the `ActivationType` property to determine what activated it. If it was due to one of the additional actions, you can then use the `AdditionalActivationAction` property to get the specific action:

{%highlight csharp linenos %}
notCenter.DidActivateNotification += (s, e) => 
{
    switch (e.Notification.ActivationType)
    {
        case NSUserNotificationActivationType.ContentsClicked:
            Console.WriteLine("Notification Touched");
            break;
        case NSUserNotificationActivationType.ActionButtonClicked:
            Console.WriteLine("Action Selected");
            break;
        default:
            break;
    }
};
{% endhighlight %}


## Known Issues

**Update: Both issues below have been fixed in the [Cycle 9 release](https://releases.xamarin.com/stable-release-cycle-9/).**

Unfortunately there are currently some issues with `NSUserNotification` in Xamarin that you should be aware of:

1. As of Xamarin.Mac 2.10, the class does not expose some properties such as `AdditionalActions` or `ContentImage`. But they are coming with the Xamarin.Mac 3.0 release which is available as an [alpha preview](https://releases.xamarin.com/alpha-preview-xamarin-mac-support-on-macos-10-12-sierra/) as of writing.

2. The `NSUserNotificationActivationType` enumeration is incomplete and is missing the two new activation types added in macOS 10.9 and 10.10: [Apple](https://developer.apple.com/reference/foundation/nsusernotification.activationtype) / [Xamarin](https://developer.xamarin.com/api/type/MonoMac.Foundation.NSUserNotificationActivationType/). This really isn't an issue as you can't even have additional actions or a reply button right now (see first issue), but I have opened a [bug report](https://bugzilla.xamarin.com/show_bug.cgi?id=45526) nonetheless.