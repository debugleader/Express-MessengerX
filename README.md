# MessengerX

MessengerX is a **web application** used for instant _messaging_ and for _group chats_.

![MessengerX Demo Image](https://i.ibb.co/j87ZM5K/msgx.png)

# Why?

Over 3 billion people use messaging apps on a regular basis to communicate with friends and businesses, and messaging is the most preferred channel for customer service in the U.S, therefore I decided to learn how to use web sockets to implement them and create this application.

# How can I try it?

* Use the web hosted version.

> [![forthebadge](https://forthebadge.com/images/badges/check-it-out.svg)](http://msgx.herokuapp.com/)

* Host it on your own machine.

> Note: You need to setup a MongoDB database first in order to connect to it by using mongoose. (Check line 25 in [server.js](https://github.com/debugleader/Express-MessengerX/blob/master/server.js))
```
Clone and cd into the repository location in your machine.
```
```bash
npm install
```
```bash
docker-compose up
```
> Warning: If you are using docker-tools, instead of typing localhost in your web browser, you need to use the default ip which is 192.168.99.100.

# How?

It uses a *register* form and a *login* system to authorize and authenticate users that are linked to a *database*, then it allows them to join specific *group chats* to communicate instantly!

------

> This application was initially built by Brad Traversy in this [tutorial](https://m.youtube.com/watch?v=jD7FnbI76Hg), I simply improved the application and added a login system, security, some styling, and more functionalities.

---

> [![forthebadge](https://forthebadge.com/images/badges/powered-by-jeffs-keyboard.svg)](https://debugleader.github.io)
