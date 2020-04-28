# Saber

A demonstration web app for streaming video games live. Made with Ember.js and Rails.

Check out the live demo at https://saber.solversion.com

#### Why?

I want to create what's mostly a twitch.tv clone for self-study. A service like Twitch needs almost every facet of modern full stack development to provide that service, so in one project I can study and implement most of the functionality that would be used individually in other web apps, as well as making larger API and service design considerations.

Saber is still in development, and there are many things I'd like to change or add in the future!
<br>
<br>

---

<br>

## Technology

#### Front-end
- Ember.js 3 with jQuery

#### Back-end
- Rails 5.2 API with MariaDB and Devise for authentication
- Node.js with WebSockets for real-time chat and stream coordination
- [NGINX RTMP module](https://github.com/sergey-dryabzhinsky/nginx-rtmp-module) for live video streaming and conversion to HLS video
- Served by NGINX with Phusion Passenger
- Deployed on CentOS 7 with Linode

The SSL/TLS certificate for the live server is provided by [Let's Encrypt](https://letsencrypt.org/getting-started/). They're awesome and the certificates are free so you should get one too!

## Features

- Uses Ember.js for a single page app, navigation and actions feel snappy
- User accounts with multiple user type variants, registration, and authentication
- Almost real-time RTMP video streaming delivered as an HLS stream, and secured by a private stream key per each broadcaster
- Individual real-time WebSocket chat rooms for all broadcasters
- Credit purchasing and transaction/donation framework (like Bits on twitch.tv)
- Direct user messaging with unread counts (and email notifications in the future)
- Image upload with thumbnailing using [Shrine](https://github.com/shrinerb/shrine) and [ruby-vips](https://github.com/libvips/ruby-vips)

## To-do

- Transcoding / Multiple video quality selections
  - The main reason this isn't in yet is the hardware to do this efficiently is expensive
  - Depending on the outcome, this might require retiring the NGINX RTMP module
- Unit and integration tests
- Scaling and incorporate a CDN, especially for HLS delivery
- Deployment pipeline, and Linux dev environment setup
- Chat moderation
- Periodic stream thumbnailing for the browse results page
- Consider adding an embedded JavaScript game option and API for playing small mini games with others
- Much better search
- A separate WebSocket server for video stream coordination and potentially general front-end use
- Chat server needs to be stress tested. It's possible that WebSockets (and/or Node.js) may be inadequate or difficult to engineer for more than ~1000 total concurrent users.
- Some Rails actions make an unnecessary amount of DB queries, but  I've made sure none of them are N+1 at least
- ... Port the whole thing to React and GraphQL?
<br>
<br>

---

<br>

## Installation

The dev env and deployment process are rough right now, but you are welcome to try if you want to!

Also, I apologize for the lack of Linux dev environment instructions. I'm not proud of developing Ruby on Windows, but it works... well enough (haha).

### Windows Dev Environment
#### Requirements
- Ruby Development Kit 2.5.8-1 https://rubyinstaller.org/downloads/
  - Install per the directions here https://blog.teamtreehouse.com/installing-rails-5-windows
- Recommended current LTS node.js from https://nodejs.org/en/download/
- Python 2.7.x
  - Enable option to add python to PATH
- [vips library](https://github.com/libvips/libvips/releases), at least v8.8 web version
  - extract to any permanent location
  - add environment variable RUBY_DLL_PATH and set it to the full path you extracted to

#### Start

Install packages for each service:
```shell
cd ember
npm install ember-cli -g
npm install

cd chat
npm install

cd api
gem install bundler
bundler install
rails db:migrate RAILS_ENV=development
rails db:seed
```

Configure the below environment files development blocks to point to ```localhost```, or your machines local IP (e.g. 192.168.1.2) if you want to visit the site from your phone or other device:
```shell
api\config\application.rb
api\config\environments\development.rb
ember\config\environment.js
```

Open 3 command prompts (preferably as admin):
```shell
# command prompt 1
cd ember
ember s

# command prompt 2
cd chat
node chat.js

# command prompt 3
cd api
rails s
```

You should now be able to visit the site locally at ```localhost:4200``` or ```<ip>:4200```.

### Deployment to a CentOS server

Follow the instructions in ```deployment\staging\linode_staging_deployment.txt```

The instructions aren't completely fleshed out, so be warned if you're unfamiliar with Linux.
