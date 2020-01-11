---
layout: post
title: Sorting The NextBus API
author: Jimmy Garrido
tags: blog
description: How I made the transit data provided by NextBus more organized and easier to use by creating the NextBus-Sort parser.
---
Many transit authorities make their data available for users to utilize, but most of the time they themselves don't host the data. This is especially true for real time data where the information is constantly updated.

San Francisco Muni uses [NextBus](http://cts.cubic.com/solutions/real-timepassengerinformation/nextbus,inc/aboutus.aspx) to host their real time data, so naturally this was the starting point for [nexMuni](http://nexdev.co/nexMUNI). The data from NextBus is decent and almost everything you could need for building a transit app is available, but the issue is how the data is sorted for use in an app.

One of the features that makes nexMuni unique is the nearby stops list. Most other apps show you **each individual** bus stop near you. This results in either a list with multiple stops listed for the same street corner or a cluttered map interface that makes it difficult to select an individual stop.

nexMuni, on the other hand, groups stops by their location. This means that the app will show a single listing for a street corner even if it has more than one bus stop. You would think this way makes the most logical sense and that all transit apps would do this, but the data provided by NextBus does not make this possible without some manual sorting.

## Original Data

Let's use the `routeConfig` command to get some data for the 14 bus route:

```
http://webservices.nextbus.com/service/publicXMLFeed?command=routeConfig&a=sf-muni&r=14
```

The data returned is in XML format and we can see that there is a lot of information here, most importantly the stops served by the route.

```xml
<route title="14-Mission" lonMax="-122.39332" lonMin="-122.46131" latMax="37.7942599" latMin="37.7059799" oppositeColor="000000" color="339999" tag="14">
	<stop title="Mission St & 30th St" tag="5572" stopId="15572" lon="-122.422" lat="37.7424399"/>
	<stop title="Mission St & Cortland Ave" tag="5584" stopId="15584" lon="-122.42284" lat="37.7411299"/>
	<stop title="Mission St & Appleton Ave" tag="5578" stopId="15578" lon="-122.4240399" lat="37.73899"/>
	...
</route>
```

This is great if all you are looking for is stop information for a single route. However, we need to have a list of all the bus stops within the system. We can obtain this by calling the same route config for every route on Muni and saving the stops from each request, but this leads to the first sorting issue: duplication of bus stops.

## Sort All The Things

The first way NextBus-Sort cleans up the list is by merging all the stops with the same title into a single entry. This allows us have a single lat/lon for a stop, but also the stopId and tag for each route serving the stop. The coordinates are crucial for locating stops near the user and the stopIds and tags are used later for getting prediction times.

The merging is done by getting the current line's title, the key, and finding all lines in the list with the same title, inclusive. The results are put into a new list with all the different stopIds and tags appended.

After the merging is complete, the list is sorted again to remove entries with the same, but reversed titles, e.g., "24th St & Mission St" and "Mission St & 24th St". This is done in similar fashion to the first merge in that the current line's title is reversed and searched for in the entire list. A new, third list is used to save the final, merged entries.

Once the second merge is complete, the final list is written to a plaint text file which can then be used to make a database for an app.

## Conclusion

Initially figuring out how to sort the data was no easy task. But it was something that needed to be done in order to give users a quick and intuitive experience. Looking at the code, you will see that I took a very direct path to the goal, not caring much for optimization. Because this isn't meant to be run inside an app, performance was not really the focus. My hope is that I can transform this program into a way for developers to get sorted data from NextBus by simply inputting the desired agency. The results would then be saved in a sqlite database, which developers would find more useful than a text file. 

But in the mean time, feel free utilize it for any agency supported by NextBus! 

Find the code on [Github](https://github.com/nexDevelopment/NextBus-Sort)

See the API documentation [here](http://www.nextbus.com/xmlFeedDocs/NextBusXMLFeed.pdf) [pdf]