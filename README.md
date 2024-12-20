# Rotary Club - 25 - Durbar

- [Durbar SETS Design Document](https://docs.google.com/document/d/1heSlfzsG461OeP8hy8r9V6APBYk0jXjeSKxl9v2jY2k/edit?tab=t.0)
- [Figma Design](https://www.figma.com/design/sN0dfmT8gGdtcMB9OQi2rJ/Durbar-App-Design?node-id=0-1&p=f&t=GwyQo6FeVaoDJ1Wx-0)

### Data Models:

The fields listed below are the important ones which should not be changed to allow for data fetch to work properly. Data fetch uses those fields to sort and retrieve or filter out data.

    itineraries(id, startTime ...) 

    members(id, role, support, name)

- All users have role="member" except for admin.
- support=true for users who can provide support as shown in the Figma.
- Any other fields for members can be removed/modified as it is a NoSQL DB
- For adding members alone, use the process I have defined in the app/protected/members.js addRandomMembers(). It creates a new user in firebase auth and then creates the rest of the firebase user info.
