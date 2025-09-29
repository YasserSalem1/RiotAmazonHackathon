
```markdown
# AI League Coach

**AI League Coach** is an intelligent coaching companion for **League of Legends**.  
It analyzes short gameplay clips (2–3 minutes) alongside official Riot match and timeline data to deliver **personalized, actionable feedback**—just like having a chess engine, but for League.

---

## Features (MVP Scope)
- Upload a gameplay clip + provide a `matchId`/timestamp.
- Fetch match + timeline data from Riot’s **Match-v5 API**.
- Extract key features (gold/xp swings, vision, cooldowns, objective setup).
- Generate coaching insights with **AWS SageMaker + Bedrock**.
- Celebrate highlights with fun, shareable recap cards.

---

## 🛠 Tech Stack
- **Frontend**: Next.js (planned) hosted on AWS Amplify  
- **Backend**: AWS Lambda + API Gateway  
- **Data Storage**: S3 (clips, raw JSON), DynamoDB (cache)  
- **ML/AI**: Lightweight models on SageMaker, summaries via Bedrock  
- **APIs**: Riot Games Developer APIs (Match-v5, Timeline-v5, Summoner-v4)  

---

## Project Structure (planned)

/frontend       → Next.js UI
/backend        → Lambda handlers
/infrastructure → IaC (Terraform/CDK)
/scripts        → Local dev/test scripts

````

