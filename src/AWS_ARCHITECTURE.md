# LoL Game Review Platform - AWS Architecture

## System Overview
A League of Legends year-in-review and game coaching platform that provides personalized player analytics, match history, and AI-powered game review with interactive timeline analysis.

---

## Architecture Components

### Frontend Layer
**Service:** Amazon CloudFront + S3
- React/TypeScript SPA hosted on S3
- CloudFront CDN for global low-latency content delivery
- Custom domain with AWS Certificate Manager (ACM) for SSL/TLS
- Compression and edge caching for optimal performance

**Alternative:** AWS Amplify Hosting
- Simplified CI/CD with GitHub integration
- Automatic build and deployment
- Branch-based environments (dev, staging, prod)

---

### API Gateway & Compute Layer

#### API Gateway
**Service:** Amazon API Gateway (REST or HTTP API)
- RESTful API endpoints for all application logic
- Request validation and transformation
- CORS configuration for frontend integration
- API key management and throttling
- CloudWatch integration for monitoring

#### Backend Compute Options

**Option 1: AWS Lambda (Recommended for serverless)**
- **Player Profile Service**: Fetches summoner data, rank, level from Riot API
- **Match History Service**: Retrieves and processes recent games
- **Style DNA Calculator**: Analyzes gameplay patterns and generates personalized metrics
- **Game Timeline Service**: Processes match timeline data for event visualization
- **AI Chatbot Service**: Bedrock integration for game analysis Q&A

**Option 2: Amazon ECS/Fargate (For containerized microservices)**
- Dedicated containers for each service
- Auto-scaling based on load
- Better for long-running processes or complex ML workloads

**Option 3: Amazon EKS (For complex orchestration)**
- Kubernetes-based deployment
- Suitable for large-scale, multi-service architecture

---

### Data Layer

#### Primary Database
**Service:** Amazon DynamoDB
- **Players Table**: Store user profiles, Style DNA, cached stats
  - Partition Key: `region#summonerName#tag`
  - Attributes: rank, level, winRate, styleDNA metrics
  
- **Matches Table**: Store processed match data
  - Partition Key: `matchId`
  - Sort Key: `timestamp`
  - GSI: `summonerId-timestamp-index` for quick user match lookup
  
- **Timeline Events Table**: Store detailed game events
  - Partition Key: `matchId`
  - Sort Key: `eventTimestamp`
  - Attributes: eventType, participants, objectives

**Advantages:**
- Sub-10ms latency at scale
- Automatic scaling with on-demand pricing
- Native JSON support for Riot API responses
- TTL for automatic data expiration

**Alternative:** Amazon Aurora Serverless (PostgreSQL)
- Better for complex relational queries
- ACID transactions
- SQL-based analytics

#### Caching Layer
**Service:** Amazon ElastiCache (Redis)
- Cache Riot API responses (reduce API calls)
- Session management
- Rate limit tracking
- Cache Layer for frequently accessed profiles
- TTL: 5 minutes for match data, 1 hour for profile data

---

### AI/ML Layer

#### AI Chatbot
**Service:** Amazon Bedrock
- Claude 3.5 Sonnet or Haiku for game analysis
- Context: Match timeline, player stats, game events
- Capabilities:
  - Answer strategic questions
  - Explain deaths and mistakes
  - Suggest item builds and positioning
  - Compare performance to rank average

**Alternative:** Amazon SageMaker
- Custom-trained model on LoL gameplay data
- Fine-tuned for domain-specific analysis

#### Style DNA Generation
**Service:** AWS Lambda + SageMaker (optional)
- Algorithm analyzes:
  - Aggression: First blood %, damage dealt, kills/deaths
  - Farming: CS/min, gold efficiency
  - Vision: Vision score, control wards placed
  - Teamfight: Teamfight participation, objective control
- Outputs percentile scores (0-100)

---

### External Integrations

#### Riot Games API Integration
**Service:** AWS Lambda + API Gateway
- **Rate Limiting**: Track API call quotas (per-region limits)
- **Retry Logic**: Exponential backoff for 429/503 errors
- **Endpoints Used:**
  - `/lol/summoner/v4/summoners/by-riot-id/{gameName}/{tagLine}`
  - `/lol/match/v5/matches/by-puuid/{puuid}/ids`
  - `/lol/match/v5/matches/{matchId}`
  - `/lol/match/v5/matches/{matchId}/timeline`
  
**Secrets Management:** AWS Secrets Manager
- Store Riot API keys securely
- Automatic rotation support
- Fine-grained IAM access control

---

### Monitoring & Observability

#### Logging
**Service:** Amazon CloudWatch Logs
- Lambda function logs
- API Gateway access logs
- Application error tracking
- Log retention: 30 days

#### Metrics & Monitoring
**Service:** Amazon CloudWatch
- Custom metrics:
  - Riot API response times
  - Lambda cold starts
  - DynamoDB read/write capacity
  - Cache hit rates
- Alarms for:
  - API Gateway 5xx errors
  - Lambda timeouts
  - DynamoDB throttling

#### Distributed Tracing
**Service:** AWS X-Ray
- End-to-end request tracing
- Performance bottleneck identification
- Service map visualization

---

### Security & Compliance

#### Authentication & Authorization
**Service:** Amazon Cognito
- User registration and login (optional for future features)
- Social login integration (Riot Games OAuth)
- JWT token management
- MFA support

**Alternative:** Auth0/Firebase Auth (if Cognito is overkill)

#### Network Security
- **AWS WAF**: Protect API Gateway from SQL injection, XSS
- **VPC**: Place Lambda functions in private subnets (if accessing VPC resources)
- **Security Groups**: Restrict access to databases and caches

#### Data Protection
- **Encryption at Rest**: S3, DynamoDB, ElastiCache encryption
- **Encryption in Transit**: TLS 1.2+ for all API calls
- **IAM Roles**: Least-privilege access for Lambda functions
- **Secrets Manager**: Secure API key storage

---

### CI/CD Pipeline

**Service:** AWS CodePipeline + CodeBuild + CodeDeploy
1. **Source Stage**: GitHub webhook triggers pipeline
2. **Build Stage**: 
   - Frontend: Build React app, run tests
   - Backend: Package Lambda functions, run unit tests
3. **Deploy Stage**:
   - Frontend: Upload to S3, invalidate CloudFront cache
   - Backend: Deploy Lambda functions via CloudFormation/SAM

**Alternative:** GitHub Actions
- Build and test on GitHub runners
- Deploy to AWS using GitHub OIDC + IAM roles
- Secrets stored in GitHub Secrets

---

### Infrastructure as Code

**Service:** AWS CloudFormation / AWS SAM
- Define all infrastructure in YAML templates
- Parameterized environments (dev, staging, prod)
- Automated rollback on deployment failures

**Alternative:** Terraform
- Multi-cloud support
- State management with S3 backend
- Modular, reusable infrastructure components

---

## Data Flow Architecture

### User Flow: Profile Generation
1. User enters Region + Riot ID on frontend
2. CloudFront → API Gateway → Lambda (Profile Service)
3. Lambda checks DynamoDB cache for existing profile
4. If not cached:
   - Call Riot API for summoner data
   - Call Riot API for match history (last 20 games)
   - Calculate Style DNA metrics
   - Store in DynamoDB
   - Store in ElastiCache (1-hour TTL)
5. Return profile data to frontend

### User Flow: Game Review
1. User selects a match from history
2. API Gateway → Lambda (Match Detail Service)
3. Lambda fetches match timeline from DynamoDB
4. If not in DynamoDB:
   - Call Riot API `/lol/match/v5/matches/{matchId}/timeline`
   - Process and store events in DynamoDB
5. Return timeline events to frontend
6. Frontend renders map visualization + timeline
7. User asks chatbot question
8. API Gateway → Lambda (Chatbot Service)
9. Lambda invokes Bedrock with match context + user question
10. Return AI response to frontend

---

## Cost Optimization Strategies

1. **API Gateway Caching**: Reduce Lambda invocations for repeated requests
2. **DynamoDB On-Demand**: Pay only for actual reads/writes
3. **Lambda Reserved Concurrency**: Prevent runaway costs from DDOS
4. **CloudFront Caching**: Reduce S3 GET requests
5. **ElastiCache**: Reduce expensive Riot API calls
6. **S3 Intelligent-Tiering**: Automatic cost optimization for static assets
7. **CloudWatch Log Retention**: 7-30 days instead of infinite
8. **Spot Instances for ECS**: If using Fargate/ECS instead of Lambda

---

## Scalability Considerations

### Auto-Scaling
- **Lambda**: Automatic horizontal scaling (up to 1000 concurrent executions)
- **DynamoDB**: On-demand or provisioned with auto-scaling
- **ElastiCache**: Cluster mode for horizontal scaling
- **CloudFront**: Global edge network scales automatically

### Rate Limiting
- **API Gateway**: Throttle limits per API key
- **Riot API**: Implement exponential backoff and queue system
- **DynamoDB**: Use DynamoDB Streams for async processing if needed

### High Availability
- **Multi-AZ**: Deploy Lambda, DynamoDB, ElastiCache across AZs
- **Multi-Region**: CloudFront automatically routes to closest edge
- **Failover**: Route 53 health checks for multi-region failover (future)

---

## Estimated AWS Monthly Costs (Moderate Traffic)

**Assumptions:**
- 10,000 unique users/month
- 5 searches per user (50,000 API calls)
- Average 20 matches per user profile
- 1,000 AI chatbot queries/month

| Service | Estimated Cost |
|---------|---------------|
| CloudFront | $10 |
| S3 | $5 |
| API Gateway | $15 |
| Lambda | $20 |
| DynamoDB | $25 |
| ElastiCache (t3.micro) | $12 |
| Bedrock (Claude Haiku) | $30 |
| CloudWatch | $10 |
| Secrets Manager | $1 |
| **TOTAL** | **~$128/month** |

**Note:** Costs will vary based on actual usage. Free tier covers first 12 months for many services.

---

## Future Enhancements

1. **Real-time Game Tracking**: Use AWS AppSync + DynamoDB Streams for live game updates
2. **Video Analysis**: Store VODs in S3, use AWS Rekognition for champion detection
3. **Machine Learning Models**: Train custom models on SageMaker for win prediction
4. **Mobile App**: Use AWS Amplify for React Native app
5. **Multi-Region Deployment**: Route 53 geolocation routing for global users
6. **Advanced Analytics**: Use Amazon Athena + S3 for historical data analysis
7. **Notification System**: SNS/SES for email notifications when friends play

---

## Security Best Practices

- ✅ Enable CloudTrail for audit logging
- ✅ Use IAM roles instead of IAM users
- ✅ Implement least-privilege access policies
- ✅ Enable MFA on root account
- ✅ Rotate API keys in Secrets Manager every 90 days
- ✅ Use AWS Config for compliance monitoring
- ✅ Enable GuardDuty for threat detection
- ✅ Regular security audits with AWS Security Hub

---

## Deployment Strategy

### Development Environment
- Separate AWS account or isolated VPC
- Reduced resources (smaller cache, lower Lambda memory)
- Shared DynamoDB tables with partition key isolation

### Staging Environment
- Production-like configuration
- Automated tests run after deployment
- Blue/Green deployment with API Gateway stages

### Production Environment
- Full auto-scaling enabled
- CloudFront with custom domain
- Multi-AZ deployment
- Comprehensive monitoring and alarms
- Automated backups for DynamoDB

---

## Disaster Recovery

**RTO (Recovery Time Objective):** 1 hour  
**RPO (Recovery Point Objective):** 5 minutes

- **DynamoDB**: Point-in-time recovery enabled (35-day retention)
- **S3**: Versioning enabled for static assets
- **Lambda**: Code stored in S3, quick redeployment
- **Cross-Region Backup**: DynamoDB Global Tables for critical data (optional)

---

## Contact & Support

For questions about this architecture, contact the engineering team or refer to:
- AWS Well-Architected Framework
- AWS Serverless Application Lens
- Riot Games Developer Portal
