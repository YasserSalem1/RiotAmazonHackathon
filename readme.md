
```markdown
# AI League Coach

**AI League Coach** is an intelligent coaching companion for **League of Legends**.  
It analyzes short gameplay clips (2–3 minutes) alongside official Riot match and timeline data to deliver **personalized, actionable feedback**—just like having a chess engine, but for League.

---

## 🚀 Features (MVP Scope)
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

## 📦 Project Structure (planned)

/frontend       → Next.js UI
/backend        → Lambda handlers
/infrastructure → IaC (Terraform/CDK)
/scripts        → Local dev/test scripts

````

---

## ⚡ Getting Started (local dev)

1. **Clone this repo**
   ```bash
   git clone https://github.com/<your-username>/ai-league-coach.git
   cd ai-league-coach
````

2. **Set your Riot API key**

   ```bash
   export RIOT_API_KEY=your_key_here
   ```

3. **Run the example script**

   ```bash
   python scripts/fetch_match.py <PUUID>
   ```

   This will print the latest match ID + timeline length.

---

## 📅 Roadmap

* [ ] Basic Riot API integration
* [ ] Store match/timeline JSON in S3 + DynamoDB
* [ ] Clip upload + link to match data
* [ ] Coaching heuristics (lane state, fight quality)
* [ ] Bedrock narrative coach (feedback + recaps)
* [ ] Frontend demo with shareable “Moment Cards”

---

## 🤝 Contributing

Open to collaborators! Fork, PR, or reach out if you’d like to join.

---

## 📜 License

MIT License (temporary until final decision).

---

**Note**: This project is being developed for the [Rift Rewind Hackathon](https://riftrewind.devpost.com/).

```

---

Do you also want me to draft the **`scripts/fetch_match.py`** file so your README instructions actually run right away?
```
