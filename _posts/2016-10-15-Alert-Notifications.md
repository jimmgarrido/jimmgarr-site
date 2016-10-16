Notifications can be useful for providing critical information or grabbing the user's attention, and they can be used not on mobile but on the desktop as well. On MacOS, this can be done using the `NSUserNotification` and `NSUserNotificationCenter` classes. 

*Note: this post talks about local notifications, not remote (push) notifications.*

To get started, check out the [Xamarin UserNotification Sample](https://developer.xamarin.com/samples/mac/UserNotificationExample/). This sample demonstrates how to create an `NSUserNotification` object and deliver it using `NSUserNotificationCenter`. 

Apps use will use the [banner style by default](https://developer.apple.com/library/content/documentation/General/Reference/InfoPlistKeyReference/Articles/CocoaKeys.html#//apple_ref/doc/uid/TP40009251-SW19) which is great for displaying quick, non-critical information and will automatically be dismissed. However what if you want your notification to require user interaction or have actions they can choose from? In this case you will want an alert notification.

[image]


## Configure Your App for Alert Notifications

Alert notifications do not go away automatically and provide buttons for dismissing and other actions. But before you can use them in your app, you will need to do a couple of things:

- Declare 'alert' as the NSUserNotificationAlertStyle in the Info.plist file
- Sign the app bundle

Do the following:

1. Open the Info.plist file and select the "Source" tab from the bottom left of the editor
2. Add a new entry with 
   - name: NSUserNotificationAlertStyle
   - type: String
   - value: alert (case sensitive)
3. Save the Info.plist and then go to the app project's properties (right-click > Options)
4. Under "Mac signing", check the box to sign the bundle and let it automatically select an identity and provisioning profile or manually configure it


## Using Alert Notifications

The `NSUserNotification` class has several properties to customize your alert notifications. For example, you can change the text for the action button with `ActionButtonTitle` or for dismiss button with `OtherButtonTitle`.

And since the main purpose of an alert notification is to perform some action based on the user's input, `HasActionButton` is set to `true` by default giving your notification an action button.

### Additional Actions

 In order to add more actions, there is the `AdditionalActions` property available which takes an array of `NSUserNotificationAction`:
 
    not.AdditionalActions = new NSUserNotificationAction[] { 
        NSUserNotificationAction.GetAction("additional","Additional action"),
        NSUserNotificationAction.GetAction("more","More")
    };
            
The additional actions can be seen by clicking and holding the main action button:

[image]


### Responding to Interaction

When a user interacts with a notification, the `NSUserNotificationCenter.DidActivateNotification` delegate will be called. Inside the delegate you can get the `ActivationType` property to see what activated it, and if it was due to one of the additional actions you can then use the `AdditionalActivationAction` property to determine which one.

    center.DidActivateNotification += (s, e) => 
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


## Known Issues
Unfortunately there are currently some issues with `NSUserNotification` in Xamarin that you should be aware of.

First, as of Xamarin.Mac 2.10 the `NSUserNotification` class does not expose some important properties such as `AdditionalActions` or `ContentImage`. Luckily there are coming in the Xamarin.Mac 3.0 release which is currently in the [alpha preview stage](https://releases.xamarin.com/alpha-preview-xamarin-mac-support-on-macos-10-12-sierra/).

Second, the `NSUserNotificationActivationType` enumeration is incomplete: [Apple](https://developer.apple.com/reference/foundation/nsusernotification.activationtype) | [Xamarin](https://developer.xamarin.com/api/type/MonoMac.Foundation.NSUserNotificationActivationType/) 

You can see that it is missing the two newer activation types added in MacOS 10.9 and 10.10. This really isn't an issue as you can't even have additional actions or a reply button right now, but I've opened a [bug report](https://bugzilla.xamarin.com/show_bug.cgi?id=45526) nonetheless.