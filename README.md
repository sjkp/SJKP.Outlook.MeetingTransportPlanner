## Inspiration
Many sales people have busy calendars that often involves several clients meetings on the same day at different physical locations. Any person that have a calendar like that, have tried stressing out about driving from one meeting to the next in order to be on time. Often this stress is cause by poor planning with insufficient time to get from one location to another. BUT NO MORE, with Meeting Transport Planner Outlook Addin, it is easy to book transport placeholders that ensures that you have enough time getting from one place to another. 

## What it does
The addin helps you setup transport placeholder appointments, that have the correct duration for you to get to where you need to be at a specific time. The addin uses the Google Driving API to calculate the estimated driving distance, including traffic, and intelligently integrates with your Outlook calendar, so you don't have to retype information about the meeting location and time. 

## How I built it
The addin is built using Angular2 and TypeScript. It was built during the RC days of Angular2 and have since been updated to the Release Version of Angular2. It uses Office UI Fabric for that native Office look and feel. It uses the Exchange Web Service API to create appointments in the logged in users calendar (without requiring any additional authentication). 

## Install instructions
To install the addin, add the addin manifest to your outlook, using this guide:
https://dev.office.com/docs/add-ins/outlook/testing-and-tips?product=outlook 
The manifest url is: https://transportplanner.azurewebsites.net/SJKP.Outlook.MeetingTransportPlannerManifest.xml

## What's next for Outlook Meeting Transport Planner
The addin is planned to be released to the Office Store in the future. 
