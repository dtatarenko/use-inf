##YOUR Sisense/Custom-SDK  Chat!!!
[https://github.com/dtatarenko/use-inf](https://github.com/dtatarenko/use-inf)

##from @useInf team 

#### start example:

**1. start Front example**
- cd ./app
  - npm i
  - cp config.ts.example config.ts
  - Fill SISENSE_URL, SISENSE_API_TOKEN in the placeholders
  - npm run start

**2. start Example-Service**
- cd ./example-service
  - npm i
  - cp env.example .env
  - Fill ORG, OPENAI_API_KEY in the placeholders
  - npm run build
  - npm run start


#### About:
 It's an example of usage \<Chat\> React component,
 that allows you to create your own chat-bot service, that may use any abstract format (cSDK, **cJAQL**, SQL, JAQL, SimplyAsk, Infusion)
\*(all that not in bold, not supported yet 😅, but stay in touch!)